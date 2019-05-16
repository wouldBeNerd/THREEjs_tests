import * as THREE from 'three';
// import TrackballControls from "../threeJS_extensions/TrackballControls";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse_type from "../workers/parse_type"




function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

/**render sprite like numbers on screen
 * 
 * @param {string} message 
 * @param {{fontsize:number, fontface:string, border:boolean borderThickness:number, textColor:{r:number, g:number, b:number, a:number }, borderColor:{r:number, g:number, b:number, a:number }, backgroundColor:{r:number, g:number, b:number, a:number }}} opts 
 */

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 50;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 0;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:255, b:0, a:0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:0, g:0, b:0, a:0 };
	// var spriteAlignment = THREE.SpriteAlignment.topLeft;
		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";
	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(255, 255, 255, 1.0)";
	context.fillText( message, borderThickness, fontsize + borderThickness);
    // context.width = textWidth + borderThickness
    // context.height = fontsize * 1.4 + borderThickness
    // canvas.width = (textWidth + borderThickness) * 1.1
    // canvas.height = (fontsize * 1.4 + borderThickness) * 1.1
    // context.top = 0
    // context.left = 0

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture } );
	var sprite = new THREE.Sprite( spriteMaterial );
    // sprite.scale.set(  textWidth + borderThickness ,  fontsize * 1.4 + borderThickness , 0.1);
    sprite.center = new THREE.Vector2( 0, 1)
    console.log(  textWidth + borderThickness  ,  fontsize * 1.4 + borderThickness  )
	return sprite;	
}

const loc_parse = ( num ) => {
    return Number.parseFloat(num).toFixed(2)
}
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
        this.on_mouse_move = this.on_mouse_move.bind(this)
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
            this.draw_plane( 
                ()=> this.draw_plane_rulers(//enclose by unexecuted function otherwise it will attempt to run immediately rather than at cb moment
                       ()=>{
                           console.log("starting")
                            this.start()
                        }
                )
            )
           
        })//callback after setstate
        // this.render3D()
    }
    draw_plane_rulers( cb ){


        let textSprite = makeTextSprite( "199.64" )
        // textSprite.rotation.x = Math.PI / 2
        textSprite.position.set(0, 1, 0)
        let width_ratio = 2
        let height = 1.5
        textSprite.scale.set( width_ratio * height, height)        
        this.scene.add(textSprite)



        if(this.font === undefined || this.font === null){
            let loader = new THREE.FontLoader();
            loader.load("lib/three_font/helvetiker_regular.typeface.json", (font)=>{
                this.font = font

                var textMaterial = new THREE.MeshBasicMaterial( 
                    { color: 0x00ff00 }
                  );    
                let textgeometry = new THREE.TextGeometry("123.456", {
                    font: font,
                    size: 0.4,
                    height: 0.004,
                    curveSegments: 5,
                    bevelEnabled: true,
                    bevelThickness: 0.004,
                    bevelSize: 0.001,
                    bevelOffset: 0,
                    bevelSegments: 5
                })
                let mesh = new THREE.Mesh( textgeometry, textMaterial)
                // mesh.scale()
                mesh.rotation.x = (Math.PI / 2)*3
                mesh.position.set(-10, 0.5, -10)
                // this.mesh.needsUpdate = true
                this.scene.add(mesh)
                // this.scene.needsUpdate = true
                cb()

            })

        }else{

            // var textMaterial = new THREE.MeshPhongMaterial( 
            //     { color: 0xff0000, specular: 0xffffff }
            //   );    
            // let textgeometry = new THREE.TextGeometry("123.456", {
            //     font: this.font,
            //     size: 80,
            //     height: 5,
            //     curveSegments: 12,
            //     bevelEnabled: true,
            //     bevelThickness: 10,
            //     bevelSize: 8,
            //     bevelOffset: 0,
            //     bevelSegments: 5
            // })
            // let mesh = new THREE.Mesh( textgeometry, textMaterial)

            // mesh.rotation.x = Math.PI / 2
            // mesh.position.set(0, 3, 0)
            // this.scene.add(mesh)
    
    
            // cb()
        }



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

        if( this.state.plane.plane !== null ){
            intersects = this.raycaster.intersectObjects( [this.state.plane.plane] );
            if(intersects.length > 0){
                let new_state = this.state
                // console.log( this.raycaster.point )
                new_state.mouse = {
                    x : loc_parse( intersects[intersects.length -1].point.x ),
                    y : loc_parse( intersects[intersects.length -1].point.z )
                }
                this.setState(new_state)
            }

        }
        //FOR DRAW_GRID POINT INTERSECTION DETECTION DEPRECATED
        // if( this.scene.children !== undefined ){
        //     intersects = this.raycaster.intersectObjects( this.state.grid.interactive_points );
        //     // if(intersects.length > 0) console.log(intersects)

     
        //     for ( var i = 0; i < this.previously_intersected.length; i++ ) {
        //         this.previously_intersected[ i ].object.material.color.set( 0xffffff );
        //         this.previously_intersected[ i ].object.material.transparent = true
        //     }
        //     this.previously_intersected = []
        //     for ( var i = 0; i < intersects.length; i++ ) {
        //         console.log(intersects[ i ].object.material.point)
        //         intersects[ i ].object.material.color.set( 0x0000ff );
        //         intersects[ i ].object.material.transparent = false
        //         this.previously_intersected.push( intersects[ i ] )
        //     }
        // }


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