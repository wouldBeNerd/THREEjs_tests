import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TrackballControls from "./threeJS_extensions/TrackballControls";
import * as THREE from 'three';

let demo_rotate_object
// let demo_rotate_active = true

const ret_new_mat = ({  color= '#ee6666',  wireframe= true ,  wireframeLinewidth=5, alphaTest = 0, lights = true})=>{
  return new THREE.MeshStandardMaterial({color})
  // return new THREE.MeshBasicMaterial({color, wireframe})
  // return new THREE.MeshLambertMaterial({color, wireframe, wireframeLinewidth, alphaTest, lights})
}
//1 SI(threejs unit) = 100 cm
class ThreeScene extends Component{
  state = {
      // width: window.innerHeight * 0.8,
      // height: null,
      canvasElement : document.querySelector(`#${this.props.id}`),
      resizeDicOccur : true,
      materials : {
        default : ret_new_mat( {  color: '#666666' }),
        red : ret_new_mat( {  color: '#ff0000' }),
        magenta : ret_new_mat( {  color: '#ff00ff' }),
        blue : ret_new_mat( {  color: '#0000ff' }),
        green : ret_new_mat( {  color: '#00ff00' }),
        yellow : ret_new_mat( {  color: '#ffff00' }),
      },
      structures : []//{fn, specs:{obj_i, geoVec3, posVec3, material_name}, threeR}
  };

  constructor(props){
    super(props)
    this.resizeCanvasToDisplaySize = this.resizeCanvasToDisplaySize.bind(this)
    this.fitToContainer = this.fitToContainer.bind(this)

    this.onMouseEnterButton = this.onMouseEnterButton.bind(this)
    this.onMouseLeaveButton = this.onMouseLeaveButton.bind(this)
    this.animate = this.animate.bind(this)
    this.renderScene = this.renderScene.bind(this)
    this.addGrid = this.addGrid.bind(this)
    this.addBox = this.addBox.bind(this)
    this.addCustomMesh = this.addCustomMesh.bind(this)
    this.addCustomMesh2 = this.addCustomMesh2.bind(this)
    this.addCustomMesh3 = this.addCustomMesh3.bind(this)
    this.addCustomMesh4 = this.addCustomMesh4.bind(this)
    this.addCustomMesh5 = this.addCustomMesh5.bind(this)
    
  }
  _isMounted = false
  componentDidMount(){
    this._isMounted = true

    this.setState( {...this.state, ...{
      canvasElement : document.querySelector(`#${this.props.id}`),
      resizeDicOccur : true,
      structures :[
        { fn : this.addBox, specs : {wireframe : true, obj_i : 0, geoVec3 :[4, 0.01, 6], posVec3:[0,1,0], material_name : 'red'}, threeR : {}},
        { fn : this.addBox, specs : {wireframe : true, obj_i : 1, geoVec3 :[4, 0.01, 6], posVec3:[0,0.5,0], material_name : 'magenta'}, threeR : {}},
        { fn : this.addBox, specs : {wireframe : true, obj_i : 2, geoVec3 :[4, 0.01, 6], posVec3:[0,0,0], material_name : 'blue'}, threeR : {}},
        { fn : this.addBox, specs : {wireframe : true, obj_i : 3, geoVec3 :[4, 0.01, 6], posVec3:[0,-0.5,0], material_name : 'green'}, threeR : {}},
        { fn : this.addBox, specs : {wireframe : true, obj_i : 4, geoVec3 :[4, 0.01, 6], posVec3:[0,-1,0], material_name : 'yellow'}, threeR : {}},
        { fn : this.addBox, specs : {wireframe : true, obj_i : 4, geoVec3 :[1, 1, 1], posVec3:[0,0,0], material_name : 'red'}, threeR : {}},
        ]
    }}, 
      ()=>{
        const width = this.mount.width
        const height = this.mount.height



        //ADD SCENE
        this.scene = new THREE.Scene()
        this.addGrid()

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
          45,
          width / height,
          1,
          1000
        )
        this.camera.position.z = 30
  
        // White directional light at half intensity shining from the top.
        // this.directionalLight = new THREE.DirectionalLight( 0xbbbbbb, 0.5 );
        // this.directionalLight.castShadow = true;
        // this.scene.add( this.directionalLight );
        
        
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
        this.lights[ 0 ] = new THREE.DirectionalLight( 0xffffff, 0.5 );

        this.lights[ 0 ].position.set( 0, 10, 10 );
        
        this.scene.add( this.lights[ 0 ] );


        const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
        const material = new THREE.MeshStandardMaterial({ color : 0x800080})
        let mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( -4, 0, 0)
        mesh.rotation.x += 15
        mesh.rotation.y += 45
        this.scene.add( mesh )
        const helper = new THREE.FaceNormalsHelper( mesh, 2, 0x00ff00, 1 );
        this.scene.add( helper )

        // draw structures TEST
        // this.state.structures.map( struc => {
        //   struc["threeR"] = struc.fn( struc.specs )
        //   console.log(struc["threeR"].box.geometry.vertices)
        //   console.log(struc["threeR"].box.geometry)
        //   return struc
        // })
        
        
        //ADD CUBE
        this.addCustomMesh5()
        
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

addBox({obj_i, geoVec3, posVec3 = [0,0,0], material_name = "default"}){

  const geometry = new THREE.BoxGeometry(geoVec3[0], geoVec3[1], geoVec3[2])
  const box = new THREE.Mesh(geometry, this.state.materials[material_name])
  box.position.set(posVec3[0], posVec3[1], posVec3[2])
  this.scene.add(box)
  return {box, geometry}
}















addCustomMesh5(){
  // vertexColors means you will color all vertexes separately,
  // so you are not required to pass vertex colors to the material (but you can brighten and darken the entire object by doing so with 0x000000 and 0xffffff)
  // MAKE SURE TO ASSIGN COLORS TO YOUR FACES IN THIS CASE
  let material = new THREE.MeshStandardMaterial({  opacity: 1, vertexColors: THREE.VertexColors, side: 2, metalness: 1})


  let geometry = new THREE.Geometry();

  //the VERTEX/FACE manufacturing process combined with the direction of the normals is of utmost importance
  //NORMAL and VERTEX HIERARCHY
  //RIGHT >> FRONT >> RIGHTFRONT
  let vertex = [
    new THREE.Vector3( 3, 0, 0  ), //0
    new THREE.Vector3( 0, 0, 3  ), //1
    new THREE.Vector3( 3, 0, 3 ),  //2
  ]
  geometry.vertices = vertex;
  //create normal
  let normal = new THREE.Vector3( 0 , 1, 0)// reflect light from the top (0,1,0) provided face is pointingin the right direction
  //CREATE FIRST FACE
  let faces = [
    new THREE.Face3( 0 ,1 ,2, normal /** , new THREE.Color(0xff0000) */) // ( 2, 1, 0)  refers to the index order of the vertex points //COLORS ENTIRE FACE
  ]
  geometry.faces = faces
  //CREATE SECOND FACE
  //ADD/push 1 vertex to vertices
  geometry.vertices.push( new THREE.Vector3( 0, 0, 0) );
  //PUSH NEW FACE WITH ADJUSTED INDEX
  geometry.faces.push( new THREE.Face3( 1, 0, 3, normal, /** new THREE.Color(0x0000ff) */) ) //COLORS ENTIRE FACE

  // demo_rotate_active = false

  //FOR TRANSITIONAL GRADIENT COLORS IT IS BETTER TO COLOR EACH FACE's VERTEX INDIVIDUALLY AS SHOWN BELOW
  let v_colors = [ 0xff6600, 0x66ff00, 0x0066ff]
  geometry.faces.forEach( face => [0,1,2].forEach(v_i => face.vertexColors[v_i] = new THREE.Color(v_colors[v_i])) )

  demo_rotate_object = new THREE.Mesh( geometry, material )
  demo_rotate_object.position.set(0, 0.5, 0)
  demo_rotate_object.rotation.x += 0.7
  const helper = new THREE.FaceNormalsHelper( demo_rotate_object, 2, 0x00ff00, 1 );

  this.scene.add(demo_rotate_object);
  this.scene.add(helper);

  geometry.faces.map(console.log)
}
addCustomMesh4(){
  // vertexColors means you will color all vertexes separately,
  // so you are not required to pass vertex colors to the material (but you can brighten and darken the entire object by doing so with 0x000000 and 0xffffff)
  // MAKE SURE TO ASSIGN COLORS TO YOUR FACES IN THIS CASE
  let material = new THREE.MeshStandardMaterial({  opacity: 1, vertexColors: THREE.VertexColors})


  let geometry = new THREE.Geometry();

  //the VERTEX/FACE manufacturing process combined with the direction of the normals is of utmost importance
  //what I have noticed to work is to start from the right most front point and move to the left most backwards point
  //with prioritizing y over z in order
  let vertex = [
    new THREE.Vector3( 0, 0, 3 ),  //0
    new THREE.Vector3( 2, 0, 0  ), //1
    new THREE.Vector3( 0, 0, 0  ), //2
  ]
  geometry.vertices = vertex;
  //create normal
  let normal = new THREE.Vector3( 0 , 1, 0)// reflect light from the top (0,1,0) provided face is pointingin the right direction
  //CREATE FIRST FACE
  let faces = [
    new THREE.Face3( 0, 1, 2, normal, new THREE.Color(0xff0000)) // ( 2, 1, 0)  refers to the index order of the vertex points
  ]
  geometry.faces = faces
  //CREATE SECOND FACE
  //ADD/push 1 vertex to vertices
  geometry.vertices.push( new THREE.Vector3( 2, 0, 3) );
  //PUSH NEW FACE WITH ADJUSTED INDEX
  geometry.faces.push( new THREE.Face3( 1, 0, 3, normal, new THREE.Color(0x0000ff)) )

  // demo_rotate_active = false

  demo_rotate_object = new THREE.Mesh( geometry, material )
  demo_rotate_object.position.set(0, 0.5, 0)
  demo_rotate_object.rotation.x += 0.7
  const helper = new THREE.FaceNormalsHelper( demo_rotate_object, 2, 0x00ff00, 1 );

  this.scene.add(demo_rotate_object);
  this.scene.add(helper);

  geometry.faces.map(console.log)
}
addCustomMesh3(){

    let geometry = new THREE.Geometry();
    let material = this.state.materials.default
    // let material = new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

    //let x = 0, y = 0, z = 0; //incremental x y z
    let x_max = 10//x 0 ↔ 10
    let y_max = 5//y 0 ↕ 1
    let z_max = 6//z 0 / 6

    let x_segs = 5 //divides length of x over 50 segments
    let y_segs = 4 //divides length of y over 1 segments
    let z_segs = 4 //divides length of z over 4 segments
    // let x_inc = x_max / x_segs
    // let y_inc = y_max / y_segs
    // let z_inc = z_max / z_segs
    let xs = new Array(x_segs).fill( x_max / x_segs ).map( (x_inc, i) => x_inc * i); xs.push(x_max)//fill arr with all incremental poitns of x
    let ys = new Array(y_segs).fill( y_max / y_segs ).map( (y_inc, i) => y_inc * i); ys.push(y_max)//fill arr with all incremental poitns of y
    let zs = new Array(z_segs).fill( z_max / z_segs ).map( (z_inc, i) => z_inc * i); zs.push(z_max)//fill arr with all incremental poitns of z
    //xs = [ 0, 0.2, 0.4, 0.6, ... 10]
    //ys = [0, 1]
    //zs = [0, 1.5, 3, 4.5, 6]
  console.log(xs.length , ys.length, zs.length, " = ", xs.length * ys.length * zs.length)
  // let face_len = xs.length * ys.length * zs.length
    xs.forEach( (x , xi) => {
      ys.forEach( (y , yi) => {
        zs.forEach( (z , zi) => {
      
          geometry.vertices.push(
            new THREE.Vector3( xs[xi] , y     , z ),       //000 100 
            new THREE.Vector3( xs[xi] , ys[yi], z ),       //100 101
            new THREE.Vector3( x      , ys[yi], z )        //001 001
          );

          var normal = new THREE.Vector3( 0, 1, 0 ); //optional
          var color = new THREE.Color( 0xffaa00 ); //optional

          geometry.faces.push( new THREE.Face3( xi + zi + yi, xi + zi + yi + 1, xi + zi + yi + 2, normal, color ) );

            // console.log( xs[xi] , y     , z )
            // console.log( xs[xi] , ys[yi], z )
            // console.log( x      , ys[yi], z )


        })
      })
    })
//the face normals and vertex normals can be calculated automatically if not supplied above
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    console.log(geometry)
    console.log(geometry.vertices)

    this.scene.add( new THREE.Mesh( geometry, material ) );



    // xs.forEach( (x , xi) => {
    //   ys.forEach( (y , yi) => {
    //     zs.forEach( (z , zi) => {
      
    //     })
    //   })
    // })

      // geometry.vertices.push(
      //   new THREE.Vector3( -10,  10, 0 ),
      //   new THREE.Vector3( -10, -10, 0 ),
      //   new THREE.Vector3(  10, -10, 0 )
      // );
      
      // geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

    
    



    

}


addCustomMesh2(){

  let geometry = new THREE.BoxGeometry(10 , 3, 6, 100, 2, 5)

  //USE THREE.FaceColors for modifiable face colors
  //this material causes a mesh to use colors assigned to vertices
  let cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

  let len_face = geometry.faces.length;
  let faceIndices = ['a', 'b', 'c', 'd'];  
  for(let i = 0; i<len_face ;i++){//iterate all geometry faces
    let face = geometry.faces[i]//select face
    let numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;//3 or 4 sides to the face
    for( let j = 0; j < numberOfSides; j++ ) //iterate all vertexes (xyz vectors)
    {
      let v_i = face[ faceIndices[j] ] //get index of current vertex
      // console.log(v_i)
      let x = geometry.vertices[v_i].x //get current vertex from vertices
      geometry.vertices[v_i].y += Math.sin( x )//FULLNESS (calcualtes the wave) adjust y(height) by adding the sin of x(lenght)
      let b = Math.floor( (x + (10/2) ) / 10 *255)//calculate b color based on x
      let rgbV3 =[ 255 - b, 0, b] //set rgb colors
      let rgbStr = `rgb(${rgbV3[0]}, ${rgbV3[1]}, ${rgbV3[2]})`//create rgb string
      let color = new THREE.Color( rgbStr )//create color
      geometry.faces[i].color = color;//set color to current face
    }

  }
  console.log(geometry)
  let plane = new THREE.Mesh(geometry, cubeMaterial)
  // plane.geometry.elementsNeedUpdate = true; //no need because not instantiated yet, 
  this.scene.add(plane);

}

addCustomMesh(){

  let geometry = new THREE.BoxGeometry(10 , 1, 6, 200, 2, 1)

  //USE THREE.FaceColors for modifiable face colors
  // this material causes a mesh to use colors assigned to vertices
  let cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

  let len = geometry.vertices.length;
  // let len_face = geometry.faces.length;

  // let faceIndices = ['a', 'b', 'c', 'd'];  

  for(let i = 0; i<len ;i++){
    // console.log(i)
    // geometry.vertices[i].y += (i/10000)
    
    // geometry.vertices[i].y += (Math.sin((x ) * 20))/8//FULLNESS (calcualtes the wave)
    
    let x = geometry.vertices[i].x //get current vertices x   
    let b = Math.floor( (x + (10/2) ) / 10 *255)//calculate b color based on x
    let rgbV3 =[ 255 - b, 0, b]

    let rgb = `rgb(${rgbV3[0]}, ${rgbV3[1]}, ${rgbV3[2]})`

    let color = new THREE.Color( rgb )//10 = x

    if( geometry.faces[i*2-1] !== undefined) geometry.faces[i*2-1].color.set(color);
    if( geometry.faces[i*2] !== undefined) geometry.faces[i*2].color.set(color);

    // if( geometry.faces[i*2-1] !== undefined) geometry.faces[i*2-1].color.setRGB(rgbV3[0], rgbV3[1], rgbV3[2]);
    // if( geometry.faces[i*2] !== undefined) geometry.faces[i*2].color.setRGB(rgbV3[0], rgbV3[1], rgbV3[2]);
    
    // if( geometry.faces[i*2-1] !== undefined) geometry.faces[i*2-1].color = color;
    // if( geometry.faces[i*2] !== undefined) geometry.faces[i*2].color = color;
    console.log(geometry.vertices[i], x)
    console.log(geometry.faces[i])

  }


  var plane = new THREE.Mesh(geometry, cubeMaterial)

  plane.geometry.elementsNeedUpdate = true;

  this.scene.add(plane);
  

}

drawRectangleCurtain(
  //1 threejs unit = 1 meter
  {
    UOM_width = "cm", UOM_height = "cm",/**"m/cm/panels" */
    width, height, fabric_thickness, fullness = 100,/**100% */
    panel_direction = "vertical", panel_width = 200,
    finishings = [
      [{ description : "over 60mm", actions:["extend", "fold"] }]/**side 1 */
    ]
  }
){
  // let x = width;
  // let y = fabric_thickness;
  // let z = height;

}

addGrid(){

  var size = 10;
  var divisions = 10;
  
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
onMouseEnterButton(e){  e.target.style.opacity = 0.8}
onMouseLeaveButton(e){  e.target.style.opacity = 0.3}
render(){
    return(
      <div  >
        {(this.props.id === null)?null:
        <div id={`${this.props.id}`} style={{ width: `100%`, height: `${window.innerHeight * 0.85}px` }}
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



        </div>


      </div>

    )
  }
}
//examples
//PropTypes.string.isRequired,
//func, array, bool, object


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