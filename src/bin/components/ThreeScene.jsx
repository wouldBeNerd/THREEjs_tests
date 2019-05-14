import * as THREE from 'three';
import TrackballControls from "../threeJS_extensions/TrackballControls";
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ThreeScene extends Component{
  state = {
    canvasElement : document.querySelector(`#${this.props.id}`),
    resizeDicOccur : true,
  };

  constructor(props){
    super(props)
    this.resizeCanvasToDisplaySize = this.resizeCanvasToDisplaySize.bind(this)
    this.fitToContainer = this.fitToContainer.bind(this)
    this.animate = this.animate.bind(this)
    this.renderScene = this.renderScene.bind(this)
    this.addGrid = this.addGrid.bind(this)
    
  }
  _isMounted = false
  componentDidMount(){
    this._isMounted = true

    this.setState( {...this.state, ...{
      canvasElement : document.querySelector(`#${this.props.id}`),
      resizeDicOccur : true
    }}, 
      ()=>{
        const width = this.mount.width
        const height = this.mount.height

        //ADD SCENE
        this.scene = new THREE.Scene()
        // this.addGrid()

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
          45,
          width / height,
          1,
          1000
        )
        this.camera.position.z = 10
        this.camera.position.y = 6
        this.camera.position.x = -3
        this.camera.lookAt(0, 0, 0);
        
        
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#333333')
        this.renderer.gammaInput = true; // required or glossyness meshStandardMaterials
        this.renderer.gammaOutput = true; // required or glossyness meshStandardMaterials
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        
        //AD ORBIT CONTROLS MOUSE
        this.addOrbitControls()
            
        
        //LIGHTS
        this.lights = [];
        this.lights[ 0 ] = new THREE.PointLight( 0xffffbb, 1, 100);
        this.lights[ 0 ].position.set( 0, 10, 0 );
        this.lights[ 0 ].castShadow = true;
        this.scene.add( this.lights[ 0 ] );

        // this.lights[ 1 ] = new THREE.DirectionalLight( 0xffbb77, 0.3 );
        // this.lights[ 1 ].position.set( -5, 20, 0 );
        // this.scene.add( this.lights[ 1 ] );

        // this.lights = [];
        this.lights[ 2 ] = new THREE.PointLight( 0x77bbff, 1, 100);
        this.lights[ 2 ].position.set( 0, -5, 0 );
        this.lights[ 2 ].castShadow = true;
        this.scene.add( this.lights[ 2 ] );        

        // const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
        // const material = new THREE.MeshStandardMaterial({ color : 0x800080})
        // let mesh = new THREE.Mesh( geometry, material );
        // mesh.position.set( -4, 0, 0)
        // mesh.rotation.x += 15
        // mesh.rotation.y += 45
        // this.scene.add( mesh )
        if(this.props.to_scene !== undefined){
            this.props.to_scene.forEach( THREE_obj => {
                if(THREE_obj !== undefined){
                    this.scene.add( THREE_obj )

                    //three.module.js:31312 THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.
                    // const helper = new THREE.FaceNormalsHelper( THREE_obj, 2, 0x00ff00, 1 );
                    // this.scene.add( helper )


                }
            })
        }

        this.start()

        window.addEventListener("resize", this.fitToContainer)

      }
    )    



  }
    componentWillUnmount(){
    this._isMounted = false
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
    }



  addGrid(){

    var size = 20;
    var divisions = 20;
    
    var gridHelper = new THREE.GridHelper( size, divisions );
    this.scene.add( new THREE.AxisHelper());
    this.scene.add( gridHelper );
  
  }
  
  addOrbitControls(){
      this.controls = new TrackballControls( this.camera );
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.panSpeed = 0.8;
      this.controls.noZoom = false;
      this.controls.noPan = false;
      this.controls.staticMoving = true;
      this.controls.dynamicDampingFactor = 0.3;
      this.controls.keys = [ 65, 83, 68 ];
      this.controls.addEventListener( 'change', this.renderScene );
    // this.setState({...this.state, cameraControlsAdded : true})
  }
  
  start = () => {
      if (!this.frameId && this._isMounted) {
        this.frameId = requestAnimationFrame(this.animate)
      }
    }
  stop = () => {
      cancelAnimationFrame(this.frameId)
    }
  animate = () => {
    this.resizeCanvasToDisplaySize();
     if( this.controls !== undefined ) this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
     this.renderScene()
     this.frameId = window.requestAnimationFrame(this.animate)
  }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  resizeCanvasToDisplaySize() {
    if(this.state.resizeDicOccur && this._isMounted){
      const canvas = this.state.canvasElement;
      // look up the size the canvas is being displayed
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
    
      // adjust displayBuffer size to match
      if (this.mount.width !== width || this.mount.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    
        // update any render target sizes here
      }
      this.setState({...this.state, resizeDicOccur : false})
    }
  }
  fitToContainer(){
    if(this.state.resizeDicOccur === false && this._isMounted){
      let canvas = this.state.canvasElement
      // Make it visually fill the positioned parent
      canvas.style.width ='100%';
      // canvas.style.height='100%';
      // ...then set the internal size to match
      canvas.width  = canvas.offsetWidth;
      // canvas.height = canvas.offsetHeight;
      canvas.height = window.innerHeight * 0.85;
      // console.log(canvas)
      // console.log(canvas.offsetWidth, window.innerHeight * 0.85)
      this.setState({...this.state, resizeDicOccur : true})
    }
  }
//   onMouseEnterButton(e){  e.target.style.opacity = 0.8}
//   onMouseLeaveButton(e){  e.target.style.opacity = 0.3}
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

{/* 
            <button className="p-1 border border-warning" type="button" data-reactroot="" style={{backgroundColor : "rgb(255, 0, 00)", opacity:0.3}}
            onMouseEnter={this.onMouseEnterButton} onMouseLeave={this.onMouseLeaveButton} >
            <span className="m-1 glyph glyph-white glyph-camera-small ">
            </span>
            </button>

            <button className="p-1 border border-warning" type="button" data-reactroot="" style={{backgroundColor : "rgb(255, 0, 00)", opacity:0.3}}
            onMouseEnter={this.onMouseEnterButton} onMouseLeave={this.onMouseLeaveButton} >
            <span className="m-1 glyph glyph-white glyph-resize-small ">
            </span>
            </button>

            <button className="p-1 border border-warning" type="button" data-reactroot="" style={{backgroundColor : "rgb(255, 0, 00)", opacity:0.3}}
            onMouseEnter={this.onMouseEnterButton} onMouseLeave={this.onMouseLeaveButton} >
            <span className="m-1 glyph glyph-white glyph-vector-path-polygon ">
            </span>
            </button>

 */}

        </div>


      </div>

    )
  }
}
ThreeScene.propTypes = {
    id : PropTypes.string.isRequired,
    match : PropTypes.shape({
        params: PropTypes.shape({
          field1: PropTypes.number,
          field2: PropTypes.string
        })
      }),
    current_department : PropTypes.string,
    current_company_currency : PropTypes.string,    
    whoami : PropTypes.object,
    width : PropTypes.number,
    height : PropTypes.number,
  
  }
  export default ThreeScene