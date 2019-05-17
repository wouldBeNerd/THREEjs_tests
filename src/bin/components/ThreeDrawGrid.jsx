import * as THREE from 'three';
// import TrackballControls from "../threeJS_extensions/TrackballControls";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse_type from "../workers/parse_type"

import MakeTextSprite from "../threeJS_extensions/build/MakeTextSprite"
import red_dot from "../../assets/red_dot.png"




class ThreeDrawGrid extends Component{
    state = {
        canvasElement : document.querySelector(`#${this.props.id}`),
        grid : {
            size : 10,
            step : 1,
            grid : null,
            interactive_points : []
        },
        mouse : {
            x : 0,
            y : 0,
            snap_increment : 1,/*value indicated the nearest increment to round to (1,2,5) */
            snap_decimal : 1,/*value indicates the product to divide and multiply during conversion 1 = m, 10 = dm, 100 = cm*/
            snap_point : false,
        },
        live_ruler : {
            red:null,/** x axis */
            blue : null,/** z axis */
            green: null,/** point*/
            red_distance: 0,
            blue_distance: 0,
            green_distance: 0,
            last: new THREE.Vector3( 0,0,0)
        },
        plane : {
            plane : null,
            width : 500,
            height : 500
        },
        camera : {
            x: 0,
            y: 40,
            z: 0,
            look_x: 0,
            look_y: 0,
            look_z: 0,
        }
    };
    scene =  new THREE.Scene(); 
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); 
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    red_dot = null/* sprite that points out mouse location as snapped to grid*/
    constructor(props){
        super(props)
        this.render3D = this.render3D.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
        this.update_camera = this.update_camera.bind(this)
        this.set_prop = this.set_prop.bind(this)
        this.new_or_state = this.new_or_state.bind(this)
        this.remove_from_scene = this.remove_from_scene.bind(this)
        this.draw_grid = this.draw_grid.bind(this)
        this.draw_plane = this.draw_plane.bind(this)
        this.draw_plane_rulers = this.draw_plane_rulers.bind(this)
        this.draw_red_dot = this.draw_red_dot.bind(this)
        this.on_mouse_move = this.on_mouse_move.bind(this)
        this.loc_parse = this.loc_parse.bind(this)
    }
    _isMounted = false
    componentDidMount(){
    this._isMounted = true

        this.init3D()
    }
    new_or_state(property, category, funct_fn ){
        if( this.state[property][category] === null){
            return funct_fn();
        }else{
            return this.state[property][category];
        }
    }
    remove_from_scene( id, scene ){
        
        if( scene !== undefined || scene !== null ){ 
            let object = scene.getObjectByName(id)
            // console.log(object)
            if(object) scene.remove( object );
        }else{ 
            let object = this.scene.getObjectByName(id)
            // console.log(object)
            if(object)this.scene.remove( object );
        }
    }
    loc_parse( num ){/**parse location to snap_to value */
        /**
         * TODO: add snap to point toggle, if enabled find nearest point and snap to it
         *   
         */
        let increment = this.state.mouse.snap_increment
        let decimal = this.state.mouse.snap_decimal

        let rounded_num = num * decimal
        let increment_difference = rounded_num % increment

        if(increment_difference < increment / 2){
            return (rounded_num - increment_difference) / decimal
        }else{
            return (rounded_num + (increment - increment_difference)) / decimal
        }
    }
    on_mouse_move( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }
    update_camera( camera ){
        if(camera === undefined || camera === null){
            this.camera.position.set( this.state.camera.x, this.state.camera.y,  this.state.camera.z);
            this.camera.lookAt( new THREE.Vector3( this.state.camera.look_x, this.state.camera.look_y, this.state.camera.look_z ) )
        }else{
            camera.position.set( this.state.camera.x, this.state.camera.y,  this.state.camera.z);
            camera.lookAt( new THREE.Vector3( this.state.camera.look_x, this.state.camera.look_y, this.state.camera.look_z ) )
        }

    }
    init3D(){



        let scene = this.scene;
        let renderer = this.renderer;
        let camera = this.camera;
        this.update_camera( camera )
        renderer.setSize( window.innerWidth, window.innerHeight)
        this.mount.appendChild( renderer.domElement )
        
        // positioning a light above the camera
        var light = new THREE.PointLight( 0xffffff, 4, 1000, 1 );
        light.position.set( this.state.camera.x, this.state.camera.y,  this.state.camera.z);
        camera.add(light);




        // let grid = this.draw_grid()

        // this.mount =this.state.canvasElement
        // console.log(this.mount)

        this.setState( {
            ...this.state,
            grid:{ ...this.state.grid }
        },()=>{

            window.addEventListener( 'mousemove', this.on_mouse_move, false );
            // this.draw_grid()
            // ! FUNCTIONS HERE MUST END WITH CALLBACK
            this.draw_plane( 
                ()=> this.draw_plane_rulers(//enclose by unexecuted function otherwise it will attempt to run immediately rather than at cb moment
                    ()=> this.draw_red_dot(//enclose by unexecuted function otherwise it will attempt to run immediately rather than at cb moment
                        ()=>{
                            console.log("starting")
                             this.start()
                         }
                    )
                )
            )
           
        })//callback after setstate
        // this.render3D()
    }
    text_sprite( message, {width_ratio=2, height=1.5, alignV2=new THREE.Vector2(0,1), textColor = {r:255, g:255, b:255, a:1}} ){
        // TODO depending on the z location of camera the scale of the letters must be adjusted 
        let sprite = MakeTextSprite( message, { textColor} )
        // textSprite.rotation.x = Math.PI / 2
        // sprite.position.set(0, 1, 0)
        sprite.center = alignV2
        sprite.scale.set( width_ratio * height, height)   
        return sprite
        // this.scene.add(sprite)
    }
    draw_plane_rulers( cb ){
        let w_m = this.state.plane.width / 2
        let h_m = this.state.plane.height / 2
        let w_dm = this.state.plane.width * 10 / 2
        let h_dm = this.state.plane.height * 10 / 2
        let w_cm = this.state.plane.width * 100 / 2
        let h_cm = this.state.plane.height * 100 / 2
        let start_p = 0
        // ! we are iterating half only, so we must add negative as well as positive points at the same time
        let m_geo = new THREE.Geometry();
        let m_mat = new THREE.LineBasicMaterial({color:0xffffff, opacity : 0.6, transparent:false, linewidth : 10})
        let text_group = new THREE.Group()
        //width lines and width texts
        for(let i = 0; i < w_m; i++){
            let modulo = i % 10
            let length = 0.1;
            if( modulo === 0 ){//0, 10, 20...
                length = 0.25
                if(i !== 0){
                    let text = this.text_sprite( `${i}`, {alignV2:new THREE.Vector2(0.1, 1)})
                    let neg_text = text.clone()
                    text.position.set( i , 0.001, length )
                    neg_text.position.set( -i , 0.001, length )
                    text_group.add(text)                
                    text_group.add(neg_text)                
                }
            }else if( modulo === 5){//5, 15, 25, ...
                length = 0.15
                if(i !== 0){
                    let text = this.text_sprite( `${i}`, {alignV2:new THREE.Vector2(0.1, 1)})
                    let neg_text = text.clone()
                    text.position.set( i , 0.001, length )
                    neg_text.position.set( -i , 0.001, length )
                    text_group.add(text)                
                    text_group.add(neg_text)                
                }
            }
            m_geo.vertices.push( new THREE.Vector3( i , 0.001, length));
            m_geo.vertices.push( new THREE.Vector3( i , 0.001, -length));

            m_geo.vertices.push( new THREE.Vector3( -i , 0.001, -length));
            m_geo.vertices.push( new THREE.Vector3( -i , 0.001, length));
        }
        //height lines and height texts
        for(let i = 0; i < h_m; i++){
            let modulo = i % 10
            let length = 0.1;            
            if( modulo === 0 ){//0, 10, 20...
                length = 0.25
                if(i !== 0){
                    let text = this.text_sprite( `${i}`, {alignV2:new THREE.Vector2(0, 0.8)})
                    let neg_text = text.clone()
                    text.position.set( length , 0.001, i )
                    neg_text.position.set( length , 0.001, -i )
                    text_group.add(text)                
                    text_group.add(neg_text)                
                }
            }else if( modulo === 5){//5, 15, 25, ...
                length = 0.15
                if(i !== 0){
                    let text = this.text_sprite( `${i}`, {alignV2:new THREE.Vector2(0, 0.8)})
                    let neg_text = text.clone()
                    text.position.set( length , 0.001, i )
                    neg_text.position.set( length , 0.001, -i )
                    text_group.add(text)                
                    text_group.add(neg_text)                
                }
            }
            m_geo.vertices.push( new THREE.Vector3( length , 0.001, i));
            m_geo.vertices.push( new THREE.Vector3( -length , 0.001, i));

            m_geo.vertices.push( new THREE.Vector3( -length , 0.001, -i));
            m_geo.vertices.push( new THREE.Vector3( length , 0.001, -i));
        }


        let m_ruler = new THREE.LineSegments( m_geo, m_mat ) 
        this.scene.add(m_ruler);
        this.scene.add(text_group)

        cb()
    }
    draw_red_dot( cb ){

        var spriteMap = new THREE.TextureLoader().load( red_dot );
        var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 0.2, 0.2, 1 );
        sprite.center = new THREE.Vector2( 0.5, 0.5)
        sprite.position.set( 0,0.1,0)
        this.red_dot = sprite;
        this.scene.add( sprite );

        cb()
    }
    draw_plane( cb ){
        let geometry = new THREE.PlaneGeometry(this.state.plane.width, this.state.plane.height, 4)
        let material = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0, side : THREE.DoubleSide})
        let mesh = new THREE.Mesh( geometry, material)
        mesh.rotation.x = Math.PI / 2
        mesh.position.set(0, 0, 0)
        // mesh.rotation.y = 0.09
        console.log(mesh)
        this.scene.add(mesh)

        let new_state = this.state
        new_state.plane.plane = mesh
        this.setState( new_state ,()=>{
            console.log("redrew grid")
            geometry.dispose()
            material.dispose()
            cb()
        })
    }
    draw_grid(){
        let scene = this.scene
        //remove from scene if grid exists
        this.remove_from_scene( "grid", scene)
        this.state.grid.interactive_points.forEach( (gp, gi)=> this.remove_from_scene( `gridp${gi}`, scene))
        //redraw new grid
        let size = this.state.grid.size+0, step = this.state.grid.step+0;
        console.log(size, step)
        let geometry = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial({color:0x333333, opacity : 0.3, transparent:false, linewidth : 10})

        for(let i = -size; i <= size; i += step){

            geometry.vertices.push( new THREE.Vector3( -size , - 0.04, i));
            geometry.vertices.push( new THREE.Vector3(  size , - 0.04, i));

            geometry.vertices.push( new THREE.Vector3( i , - 0.04, -size));
            geometry.vertices.push( new THREE.Vector3( i , - 0.04,  size));

        }

        let grid = new THREE.LineSegments( geometry, material ) 
        grid.name = "grid"


        scene.add(grid);


        let points = new Array((size * 2) / step).fill(0).map( (zero, i) => i * step + (-size) )
        points.push(size)//add the last size one
        let interactive_points = []
        
        let sphere_geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
        points.forEach( (ptx, xi) => {
            points.forEach( (ptz, zi) => {
                let sphere_material = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0})
                // let geometry = new THREE.Sphere(new THREE.Vector3(ptx, -0.04, ptz), 0.3);
                let mesh = new THREE.Mesh(sphere_geometry, sphere_material)
                mesh.position.set( ptx, -0.02, ptz )
                mesh.name = `gridp${xi+zi}`
                scene.add(mesh)
                interactive_points.push(mesh)
            })
        })


        let new_state = this.state
        new_state.grid.grid = grid
        new_state.grid.interactive_points = interactive_points
        this.setState( new_state ,()=>{
            console.log("redrew grid")
            geometry.dispose()
            material.dispose()
            this.start()
        })


    }
    start = () => {
        


        if (!this.frameId && this._isMounted) {
          this.frameId = requestAnimationFrame(this.animate)
        }
      }
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }
    previously_intersected = []
    animate = () => {

        this.raycaster.setFromCamera( this.mouse, this.camera );

        let intersects
        // console.log(this.scene.children)

        // this.state.plane.plane.raycast( this.raycaster, )
        if( this.red_dot ){
            this.red_dot.position.set( this.state.mouse.x, 0.1, this.state.mouse.y  )
        }
        if( this.state.plane.plane !== null ){
            intersects = this.raycaster.intersectObjects( [this.state.plane.plane] );
            if(intersects.length > 0){
                let new_state = this.state
                // console.log(  this.loc_parse( intersects[intersects.length -1].point.x ))
                new_state.mouse.x = this.loc_parse( intersects[intersects.length -1].point.x )
                new_state.mouse.y = this.loc_parse( intersects[intersects.length -1].point.z )
                this.setState(new_state)
            }

        }

    //   this.resizeCanvasToDisplaySize();
    //    if( this.controls !== undefined ) this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
       this.render3D()
       this.frameId = window.requestAnimationFrame(this.animate)
    }
    // renderScene = () => {
    //   this.renderer.render(this.scene, this.camera)
    // }    
    render3D(){
        this.renderer.render(this.scene, this.camera);
    }
    set_prop( category, property, type, this_fn){
        // console.log(category, property)
        return (e)=>{
            let new_state =  this.state
            new_state[category][property] =parse_type(type, e.target.value)
            this.setState({...new_state,}, this_fn )
        }
    }
    componentWillUnmount(){
    this._isMounted = false
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
    }
    render(){
    return(
        <div  >
        {(this.props.id === null)?null:
        <div id={`${this.props.id}`} style={{ width: `100%`, height: `${window.innerHeight /** 0.85*/}px` }}
            ref={(mount) => { this.mount = mount }}
        />}
        {/* BUTTONS */}
        <div style={{
            position: "absolute",
            top: "32px", 
            left: "0px", 
            opacity: 0.9, 
            zIndex: 10000
        }} className="container">
            <div className="row">
                <div className="col col-sm-1 text-white" >{`x:${this.state.mouse.x}`}</div>
                <div className="col col-sm-1 text-white" >{`y:${this.state.mouse.y}`}</div>
                {/* <input min="1" className="col col-sm-1 bg-dark text-white form-control form-control-sm" 
                    type="number" value={this.state.grid.step} onChange={this.set_prop("grid", "step", "number", this.draw_grid)}
                />
                <input min="1"  className="col col-sm-1 bg-dark text-white form-control form-control-sm" 
                    type="number" value={this.state.grid.size} onChange={this.set_prop("grid", "size", "number", this.draw_grid)}
                /> */}
            </div>
            <div className="row col col-sm-3 ">
                <div className="col text-white text-left border-light border d-flex align-items-start justify-content-center">
                    <span>
                        Snap To
                    </span>
                </div>
            </div>
            <div className="row col col-sm-3 ">
                <select className="col bg-dark text-white"
                value = {this.state.mouse.snap_increment}
                onChange={this.set_prop("mouse", "snap_increment", "number", ()=>{} )}
                >
                    {/*value indicated the nearest increment to round to */}
                    <option value = {1}>1</option>
                    <option value = {2}>2</option>
                    <option value = {5}>5</option>
                </select>                        
                <select className="col col-sm-8 bg-dark text-white"
                value = {this.state.mouse.snap_decimal}
                onChange={this.set_prop("mouse", "snap_decimal", "number", ()=>{} )}
                >
                    {/*value indicates the product to divide and multiply during conversion 1 = m, 10 = dm, 100 = cm*/}
                    <option value = {1}>meter</option>
                    <option value = {10}>decimeter</option>
                    <option value = {100}>centimeter</option>
                </select>                   
            </div>
           
            <div className="row col col-sm-3 input-group">   
                <div className="col text-white text-left border-light border d-flex align-items-start justify-content-center p-0">
                    <input type="checkbox" data-toggle="toggle" data-size="xs" data-onstyle="primary" data-offstyle="secondary" 
                    className = "m-0" data-on="Point Snap ON" data-off="Point Snap OFF" 
                    data-width="100%" data-height="100%"
                    defaultChecked={this.state.mouse.snap_point} 
                    onChange={this.set_prop("mouse", "snap_point", "boolean", ()=>{} )}
                    />
                </div>                       
            </div>            
        </div>


        </div>

    )
    }
}
ThreeDrawGrid.propTypes = {
    id : PropTypes.string.isRequired,
    // match : PropTypes.shape({
    //     params: PropTypes.shape({
    //       field1: PropTypes.number,
    //       field2: PropTypes.string
    //     })
    //   }),
    // current_department : PropTypes.string,
    // current_company_currency : PropTypes.string,    
    // whoami : PropTypes.object,
    // width : PropTypes.number,
    // height : PropTypes.number,
  
  }
  export default ThreeDrawGrid