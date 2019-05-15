import * as THREE from 'three';
// import TrackballControls from "../threeJS_extensions/TrackballControls";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse_type from "../workers/parse_type"
class ThreeDrawGrid extends Component{
    state = {
        canvasElement : document.querySelector(`#${this.props.id}`),
        grid : {
            size : 20,
            step : 1,
            grid : null,
        }
    };
    scene =  new THREE.Scene() 
    renderer = new THREE.WebGLRenderer()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000) 
    constructor(props){
        super(props)
        this.render3D = this.render3D.bind(this)
        this.set_prop = this.set_prop.bind(this)
        this.new_or_state = this.new_or_state.bind(this)
        this.remove_from_scene = this.remove_from_scene.bind(this)
        this.draw_grid = this.draw_grid.bind(this)
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
            console.log(object)
            if(object) scene.remove( object );
        }else{ 
            let object = this.scene.getObjectByName(id)
            console.log(object)
            if(object)this.scene.remove( object );
        }
    }
    init3D(){
        let scene = this.scene;
        let renderer = this.renderer;
        let camera = this.camera;
        camera.position.set(0,40,0);
        camera.lookAt( scene.position )
        renderer.setSize( window.innerWidth, window.innerHeight)
        this.mount.appendChild( renderer.domElement )


        // let grid = this.draw_grid()

        // this.mount =this.state.canvasElement
        // console.log(this.mount)

        this.setState( {
            ...this.state,
            grid:{ ...this.state.grid }
        },()=>{
            this.draw_grid()
            this.render3D()
        })//callback after setstate
        // this.render3D()
    }
    draw_grid(){

        let scene = this.scene
        //remove from scene if grid exists
        this.remove_from_scene( "grid", scene)
        //redraw new grid
        let size = this.state.grid.size+0, step = this.state.grid.step+0;
        console.log(size, step)
        let geometry = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial({color:0xffffff})

        for(let i = -size; i <= size; i += step){

            geometry.vertices.push( new THREE.Vector3( -size , - 0.04, i));
            geometry.vertices.push( new THREE.Vector3(  size , - 0.04, i));

            geometry.vertices.push( new THREE.Vector3( i , - 0.04, -size));
            geometry.vertices.push( new THREE.Vector3( i , - 0.04,  size));

        }

        let grid = new THREE.LineSegments( geometry, material ) 
        grid.name = "grid"

        scene.add(grid);


        let new_state = this.state
        this.state.grid.grid = grid
        this.setState( new_state ,()=>{
            this.render3D()
            geometry.dispose()
            material.dispose()
        })


    }
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
        }}>
                <input className="form-control form-control-sm" type="number" value={this.state.grid.step} onChange={this.set_prop("grid", "step", "number", this.draw_grid)}/>
                <input className="form-control form-control-sm" type="number" value={this.state.grid.size} onChange={this.set_prop("grid", "size", "number", this.draw_grid)}/>

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