import * as THREE from 'three';
// import TrackballControls from "../threeJS_extensions/TrackballControls";
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import parse_type from "../workers/parse_type"
import calc_xy_on_circle from "../workers/calc_xy_on_circle"

import MakeTextSprite from "../threeJS_extensions/build/MakeTextSprite"
import ExtrudeGeometry from "../threeJS_extensions/build/ExtrudeGeometry"
import red_dot from "../../assets/red_dot.png"
import { MeshBasicMaterial } from 'three';

const round_to_x_curry = ( round_to)=>{
    let pow = Math.pow( 10, round_to )
    console.log(pow)
    return (num)=>{
        return ( Math.round( num * pow ) / pow )
    }
}
const round_2_dec = round_to_x_curry(2)
const round_3_dec = round_to_x_curry(3)


//GLOBALS CAPITAL VARIABELS PARAMS ======================================================================================================================
//GLOBALS CAPITAL VARIABELS PARAMS ======================================================================================================================
//GLOBALS CAPITAL VARIABELS PARAMS ======================================================================================================================
//GLOBALS CAPITAL VARIABELS PARAMS ======================================================================================================================
//GLOBALS CAPITAL VARIABELS PARAMS ======================================================================================================================
//GLOBALS CAPITAL VARIABELS PARAMS ======================================================================================================================
//GLOBALS CAPITAL VARIABELS PARAMS ======================================================================================================================


/**EXTRUDE contains points/coords that can be used in ExtrudeGeometry to create shapes */
const EXTRUDE = {
    arrow : [[0, 0],[-0.7, 0],[-0.7, -2],[-1.5, -2],[ 0, -3.5],[1.5, -2],[0.7, -2],[0.7, 0]],
    sqaure : [[0.9, 0.9], [-0.9, 0.9], [-0.9, -0.9], [0.9, -0.9]]
}
let TEST_MESH, TEST_ROTATE = 0
let DEGREES_ARR = new Array(360).fill(0).map((z, i)=> i); 
/**45 degrees in radeans */let RADS_45 = THREE.Math.degToRad(45)
/**90 degrees in radeans */let RADS_90 = THREE.Math.degToRad(90) // same as Math.PI / 2
/**180 degrees in radeans */let RADS_180 = THREE.Math.degToRad(180)
/**270 degrees in radeans */let RADS_270 = THREE.Math.degToRad(270)

let SCALE_I_INIT = 1

/** REFACTORS SPRITE SIZE DEPENDING ON THE DEPTH OF Y CAMERA */
const text_scale_factor = 10
const TEXT_SCALES = [
    { width_scale : 0.73, height_scale :	0.36,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 0.73, height_scale :	0.36,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 1.47, height_scale :	0.73,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 2.21, height_scale :	1.1,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 2.94, height_scale :	1.47,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 3.68, height_scale :	1.84,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 4.42, height_scale :	2.21,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 5.15, height_scale :	2.57,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 5.89, height_scale :	2.94,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 6.63, height_scale :	3.31,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 7.36, height_scale :	3.68,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 8.1, height_scale :	4.05,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 8.84, height_scale :	4.42,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 9.57, height_scale :	4.78,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 10.31, height_scale :	5.15,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 11.05, height_scale :	5.52,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 11.78, height_scale :	5.89,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 12.52, height_scale :	6.26,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 13.26, height_scale :	6.63,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 14, height_scale :	7,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 14.73, height_scale :	7.36,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 15.47, height_scale :	7.73,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 16.21, height_scale :	8.1,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 16.94, height_scale :	8.47,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 17.68, height_scale :	8.84,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 18.42, height_scale :	9.21,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    { width_scale : 19.15, height_scale :	9.57,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    // { width_scale : 2.20, height_scale :	1.1,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    // { width_scale : 4.4, height_scale :	2.2,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    // { width_scale : 8, height_scale :	4,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    // { width_scale : 10, height_scale : 5,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
    // { width_scale : 14, height_scale :	7,   alignV2_x: new THREE.Vector2(0.1, 1), alignV2_z: new THREE.Vector2(0, 0.8)},
]
/** REFACTORS SPRITE SIZE DEPENDING ON THE DEPTH OF Y CAMERA */
const RED_DOT_SCALE_FACTOR = 10
/** contains one factor to apply to x y and z when scaling */
const RED_DOT_SCALES = new Array(40).fill(0.03).map( (base_factor, i)=> base_factor * (i+1) )
/**REFACTORS ARROW SIZE DEPENDING ON THE DEPTH OF CAMERA Y */
const MOVE_ARROW_FACTOR = 10
/** contains one factor to apply to X and Z when scaling keep Y at 0.1 */
const MOVE_ARROW_SCALES = new Array(40).fill(0.15).map( (base_factor, i)=> base_factor * (i+1) )
const ARROW_MATERIAL = new THREE.MeshBasicMaterial( {color:0x00ff00, opacity : 0.3, transparent:true})
const ARROW_MATERIAL_HIGHLIGHT = new THREE.MeshBasicMaterial( {color:0x00ff00, opacity : 0.7, transparent:true})
/**
 * TODO refactor to new new system
 * create object containing all THREE draw methods. 
 * export all THREE drawings to separate file and function
 * !consider precurring materials by wrapping imported draw methods into a curry
 * 
 * create object containing all HUD THREE drawings with their names and coordinates, materials, etc
 * 
 * 
 */


class ThreeDrawGrid extends Component{
    state = {
        canvasElement : document.querySelector(`#${this.props.id}`),
        drawing : {

        },
        mouse : {
            down : false,
            x : 0,
            y : 0,
            snap_increment : 1,// ! DO NOT SET TO 0 /* value indicated the nearest increment to round to (1,2,5) */
            snap_decimal : 100,// ! DO NOT SET TO 0 /*value indicates the product to divide and multiply during conversion 1 = m, 10 = dm, 100 = cm*/
            snap_point : false,
        },
        red_dot : {
            TObj : null,
            scale_i : SCALE_I_INIT,
        },
        move_arrows : {
            TObj : null,
            TObj_up : null,
            TObj_down : null,
            TObj_left : null,
            TObj_right : null,
            TObj_center : null,
            scale_i : SCALE_I_INIT,
            hover_up : false,
            hover_down : false,
            hover_left : false,
            hover_right : false,        
            hover_center : false    
        },        
        ruler : {
            text_scale_i : SCALE_I_INIT,/**defined which scaling object to get from text_scale */
            texts_x : [],//TObjs
            texts_z : [],//TObjs
        },
        live_ruler : {
            red:null,/** x axis */
            blue : null,/** z axis */
            green: null,/** point*/
            red_distance: 0,
            blue_distance: 0,
            green_distance: 0,
            // lastV3: new THREE.Vector3( 0,0,0),
            // history : [/**{ shape_type, V3s} */]
        },
        plane : {
            TObj : null,
            width : 500,
            height : 500
        },
        camera : {
            x: 0,
            y: 60,
            z: 0,
            look_x: 0,
            look_y: 0,
            look_z: 0,
        },
        moveing: {
            speed : 0,
            accelerate : 0.01,
            speed_max : 1
        },
        active_mode : "navigate",
        active_keys : {
        }
    };
    scene =  new THREE.Scene(); 
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); 
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    move_arrows = new THREE.Group();
    red_dot = null/* sprite that points out mouse location as snapped to grid*/
    constructor(props){
        super(props)
        this.render3D = this.render3D.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
        this.set_1_state = this.set_1_state.bind(this)
        this.set_prop = this.set_prop.bind(this)
        this.set_prop_from_input_event = this.set_prop_from_input_event.bind(this)
        this.new_or_state = this.new_or_state.bind(this)
        this.remove_from_scene = this.remove_from_scene.bind(this)
        //DRAW
        this.draw_plane = this.draw_plane.bind(this)
        this.draw_plane_rulers = this.draw_plane_rulers.bind(this)
        this.draw_red_dot = this.draw_red_dot.bind(this)
        this.draw_point_move_arrows = this.draw_point_move_arrows.bind(this)
        this.draw_2_point_ruler = this.draw_2_point_ruler.bind(this)

        //UPDATE
        this.on_mouse_move = this.on_mouse_move.bind(this)
        this.loc_parse = this.loc_parse.bind(this)

        this.update_ruler_text_scales = this.update_ruler_text_scales.bind(this)
        this.update_red_dot_scale = this.update_red_dot_scale.bind(this)
        this.update_move_arrows_scale = this.update_move_arrows_scale.bind(this)

        //MOUSE
        this.prevent_bubbles = this.prevent_bubbles.bind(this)
        this.drag_active = this.drag_active.bind(this)

        //KEYBOARD
        this.activate_keyboard_button = this.activate_keyboard_button.bind(this)
        this.deactivate_keyboard_button = this.deactivate_keyboard_button.bind(this)
        this.reset_key_variables = this.reset_key_variables.bind(this)
        
        this.move_general = this.move_general.bind(this)
        

        //CAMERA
        this.update_camera = this.update_camera.bind(this)
        this.move_camera.in = this.move_camera.in.bind(this)
        this.move_camera.out = this.move_camera.out.bind(this)
        this.move_camera.up = this.move_camera.up.bind(this)
        this.move_camera.down = this.move_camera.down.bind(this)
        this.move_camera.left = this.move_camera.left.bind(this)
        this.move_camera.right = this.move_camera.right.bind(this)

        //MODES
        // this.modes.draw_polygon = this.modes.draw_polygon.bind(this)
        
        this.custom_event_listeners_add = this.custom_event_listeners_add.bind(this)
        this.custom_event_listeners_remove = this.custom_event_listeners_remove.bind(this)
        this.raycast_mouse_position =  this.raycast_mouse_position.bind(this)

        
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
    move_general(pos_state_category, pos_state_keys, backwards=false, cb=()=>{} ){
        let {speed, accelerate, speed_max} = this.state.moveing
        let new_state = {...this.state}
        if(speed < speed_max) speed += accelerate;
        new_state.moveing.speed = speed
        pos_state_keys.forEach( pos_state_key => { 
            if(backwards === true) new_state[ pos_state_category ][ pos_state_key ] -= speed;
            else new_state[ pos_state_category ][ pos_state_key ] += speed;
        })

        this.setState(new_state, cb)
    }
    move_camera = {
        in:     ()=>{ this.move_general( "camera", ["y"], true, this.update_camera ) },
        out:    ()=>{ this.move_general( "camera", ["y"], false, this.update_camera ) },
        up:     ()=>{ this.move_general( "camera", ["z", "look_z"], true, this.update_camera ) },
        down:   ()=>{ this.move_general( "camera", ["z", "look_z"], false, this.update_camera ) },
        left:   ()=>{ this.move_general( "camera", ["x", "look_x"], true, this.update_camera ) },
        right:  ()=>{ this.move_general( "camera", ["x", "look_x"], false, this.update_camera ) },
    }
    update_camera( camera ){
        if(camera === undefined || camera === null){
            this.camera.position.set( this.state.camera.x, this.state.camera.y,  this.state.camera.z);
            this.camera.lookAt( new THREE.Vector3( this.state.camera.look_x, this.state.camera.look_y, this.state.camera.look_z ) )
        }else{
            camera.position.set( this.state.camera.x, this.state.camera.y,  this.state.camera.z);
            camera.lookAt( new THREE.Vector3( this.state.camera.look_x, this.state.camera.look_y, this.state.camera.look_z ) )
        }
        //! if scale out of array range use last
        let red_dot_i = Math.floor( this.state.camera.y / RED_DOT_SCALE_FACTOR)
        if(red_dot_i !== this.state.red_dot.scale_i && 
            this.state.red_dot.TObj !== null &&
            RED_DOT_SCALES[ red_dot_i ] !== undefined
        ){
            let new_state = {...this.state}
            new_state.red_dot.scale_i = red_dot_i
            this.setState(new_state, ()=>{
                this.update_red_dot_scale()
            })
        }else if(red_dot_i !== this.state.red_dot.scale_i){
            let new_state = {...this.state}
            new_state.red_dot.scale_i = red_dot_i
            this.setState(new_state, ()=>{
            })
        }


        let move_arrows_i = Math.floor( this.state.camera.y / MOVE_ARROW_FACTOR)
        if(move_arrows_i !== this.state.move_arrows.scale_i && 
            this.state.move_arrows.TObj !== null &&
            MOVE_ARROW_SCALES[ move_arrows_i ] !== undefined
        ){
            let new_state = {...this.state}
            new_state.move_arrows.scale_i = move_arrows_i
            this.setState(new_state, ()=>{
                this.update_move_arrows_scale()
            })
        }else if(move_arrows_i !== this.state.move_arrows.scale_i){
            let new_state = {...this.state}
            new_state.move_arrows.scale_i = move_arrows_i
            this.setState(new_state, ()=>{
            })
        }

        let new_scale_i = Math.floor( this.state.camera.y / text_scale_factor )
        if(new_scale_i !== this.state.ruler.text_scale_i && 
            TEXT_SCALES[ new_scale_i ] !== undefined &&
            this.state.ruler.texts_x.children !== undefined && 
            this.state.ruler.texts_z.children !== undefined 
        ){
            let new_state = {...this.state}
            new_state.ruler.text_scale_i = new_scale_i
            this.setState(new_state, ()=>{
                this.update_ruler_text_scales()
            })
        }else if(new_scale_i !== this.state.ruler.text_scale_i ){
            let new_state = {...this.state}
            new_state.ruler.text_scale_i = new_scale_i
            this.setState(new_state, ()=>{
            })
        }

    }
    update_ruler_text_scales(){
        /**reapply the scale and align ratio of all texts in texts_x and texts_y */
        let scale = TEXT_SCALES[ this.state.ruler.text_scale_i  ]
        console.log("scaling", scale)
        let { alignV2_x, alignV2_z, width_scale, height_scale} = scale
        let new_ruler_texts_x = this.state.ruler.texts_x.children.map( text => {
            text.center = alignV2_x
            text.scale.set( width_scale , height_scale)   
            // text.verticesNeedUpdate = true
            return text
        })
        let new_ruler_texts_z = this.state.ruler.texts_z.children.map( text => {
            text.center = alignV2_z
            text.scale.set( width_scale , height_scale)   
            // text.verticesNeedUpdate = true
            return text
        })        
    }
    update_red_dot_scale(){
        let new_scale = RED_DOT_SCALES[ this.state.red_dot.scale_i ]
        this.state.red_dot.TObj.scale.set( new_scale, new_scale, 0.01 )
    }
    update_move_arrows_scale(){
        let new_scale = MOVE_ARROW_SCALES[ this.state.move_arrows.scale_i ]
        this.state.move_arrows.TObj.scale.set( new_scale, 0.01, new_scale )
    }
//DRAW DRAW DRAW DRAW===============================================================================================================
//DRAW DRAW DRAW DRAW===============================================================================================================
//DRAW DRAW DRAW DRAW===============================================================================================================
//DRAW DRAW DRAW DRAW===============================================================================================================
//DRAW DRAW DRAW DRAW===============================================================================================================
//DRAW DRAW DRAW DRAW===============================================================================================================
//DRAW DRAW DRAW DRAW===============================================================================================================
    draw_2_point_ruler( cb ){
        
    }
    draw_point_move_arrows( cb ){
        if(this.state.move_arrows.TObj === null){

            let arrows = this.move_arrows
            // let material = new THREE.MeshBasicMaterial( {color:0x00ff00, opacity : 0.3, transparent:true})

            let up = ExtrudeGeometry(EXTRUDE.arrow, ARROW_MATERIAL, { depth: 0.01, bevelEnabled: true,bevelThickness: 0.2, bevelSize: 0.1,}, {x:0.3, y:0.3, z:0.3} )
            up.rotateX(RADS_90)
            up.name = "arrow_up"

            let down = up.clone()
            down.rotateZ(RADS_180)
            down.name = "arrow_down"
            
            let left = up.clone()
            left.rotateZ(RADS_270)
            left.name = "arrow_left"

            let right = up.clone()
            right.rotateZ(RADS_90)
            right.name = "arrow_right"

            let center = ExtrudeGeometry(EXTRUDE.sqaure, ARROW_MATERIAL, { depth: 0.01, bevelEnabled: true,bevelThickness: 0.2, bevelSize: 0.1,}, {x:0.3, y:0.3, z:0.3} )
            center.rotateX(RADS_90)
            
            center.name = "arrow_center"

            //move arrows
            const spacing = 0.7
            up.position.set(0, 0, -spacing)
            down.position.set(0, 0, spacing)
            left.position.set(-spacing, 0, 0)
            right.position.set(spacing, 0, 0)
            center.position.set(0,0,0)

            // up_arrow.scale.set(new THREE.Vector3(0.3, 0.3, 0.3))
            console.log(up)
            arrows.add(up)
            arrows.add(down)
            arrows.add(left)
            arrows.add(right)
            arrows.add(center)
            this.scene.add(arrows)

            //scale to scale_i
            const scale = MOVE_ARROW_SCALES[ this.state.move_arrows.scale_i ]
            console.log(scale)
            arrows.scale.set(scale, 0.1, scale)

            let new_state = {...this.state}
            new_state.move_arrows.TObj = arrows
            new_state.move_arrows.TObj_up = up
            new_state.move_arrows.TObj_down = down
            new_state.move_arrows.TObj_left = left
            new_state.move_arrows.TObj_right = right
            new_state.move_arrows.TObj_center = center

            
            this.setState(new_state, cb)
        }else{
            cb()
        }

    }
    draw_text_sprite( message, { width_scale=2, height_scale=1.5, alignV2=new THREE.Vector2(0,1), textColor = {r:255, g:255, b:255, a:1}, sizeAttenuation=true} ){
        // TODO depending on the z location of camera the scale of the letters must be adjusted 
        let sprite = MakeTextSprite( message, { textColor, sizeAttenuation } )
        // textSprite.rotation.x = Math.PI / 2
        // sprite.position.set(0, 1, 0)
        sprite.center = alignV2
        sprite.scale.set( width_scale , height_scale)   
        return sprite
        // this.scene.add(sprite)
    }    
    draw_plane_rulers( cb ){//RUNS AT INIT THEREFORE IN A CALLBACK CHAIN

        /**get text scale */
        let scale_i = this.state.ruler.text_scale_i
        let scale = TEXT_SCALES[scale_i]

        let w_m = this.state.plane.width / 2
        let h_m = this.state.plane.height / 2
        // let w_dm = this.state.plane.width * 10 / 2
        // let h_dm = this.state.plane.height * 10 / 2
        // let w_cm = this.state.plane.width * 100 / 2
        // let h_cm = this.state.plane.height * 100 / 2
        // let start_p = 0
        // ! we are iterating half only, so we must add negative as well as positive points at the same time
        let m_geo = new THREE.Geometry();
        let m_mat = new THREE.LineBasicMaterial({color:0xffffff, opacity : 0.6, transparent:false, linewidth : 10})
        let texts_x = new THREE.Group()
        let texts_z = new THREE.Group()
        //width lines and width texts
        for(let i = 0; i < w_m; i++){
            let modulo = i % 10
            let length = 0.1;
            if( modulo === 0 ){//0, 10, 20...
                length = 0.25
                if(i !== 0){
                    let text = this.draw_text_sprite( `${i}`, {alignV2:scale.alignV2_x, width_scale:scale.width_scale, height_scale:scale.height_scale})
                    let neg_text = text.clone()
                    text.position.set( i , 0.001, length )
                    neg_text.position.set( -i , 0.001, length )
                    texts_x.add(text)                
                    texts_x.add(neg_text)            
                }
            }else if( modulo === 5){//5, 15, 25, ...
                length = 0.15
                if(i !== 0){
                    let text = this.draw_text_sprite( `${i}`, {alignV2:scale.alignV2_x, width_scale:scale.width_scale, height_scale:scale.height_scale})
                    let neg_text = text.clone()
                    text.position.set( i , 0.001, length )
                    neg_text.position.set( -i , 0.001, length )
                    texts_x.add(text)                
                    texts_x.add(neg_text)                                   
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
                    let text = this.draw_text_sprite( `${i}`, {alignV2:scale.alignV2_z, width_scale:scale.width_scale, height_scale:scale.height_scale})
                    let neg_text = text.clone()
                    text.position.set( length , 0.001, i )
                    neg_text.position.set( length , 0.001, -i )
                    texts_z.add(text)                
                    texts_z.add(neg_text)                 
                }
            }else if( modulo === 5){//5, 15, 25, ...
                length = 0.15
                if(i !== 0){
                    let text = this.draw_text_sprite( `${i}`, {alignV2:scale.alignV2_z, width_scale:scale.width_scale, height_scale:scale.height_scale})
                    let neg_text = text.clone()
                    text.position.set( length , 0.001, i )
                    neg_text.position.set( length , 0.001, -i )
                    texts_z.add(text)                
                    texts_z.add(neg_text)                                    
                }
            }
            m_geo.vertices.push( new THREE.Vector3( length , 0.001, i));
            m_geo.vertices.push( new THREE.Vector3( -length , 0.001, i));

            m_geo.vertices.push( new THREE.Vector3( -length , 0.001, -i));
            m_geo.vertices.push( new THREE.Vector3( length , 0.001, -i));
        }


        let m_ruler = new THREE.LineSegments( m_geo, m_mat ) 
        this.scene.add(m_ruler);
        this.scene.add(texts_x)
        this.scene.add(texts_z)
        let new_state = {...this.state}
        new_state.ruler.texts_x = texts_x
        new_state.ruler.texts_z = texts_z

        this.setState(new_state, cb)// ! /*KEEP LAST AS IT CONTAINS CALLBACK */
    }
    draw_red_dot( cb ){//RUNS AT INIT THEREFORE IN A CALLBACK CHAIN
        var spriteMap = new THREE.TextureLoader().load( red_dot );
        var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 0.2, 0.2, 1 );
        sprite.center = new THREE.Vector2( 0.5, 0.5)
        sprite.position.set( 0,0.1,0)
        this.red_dot = sprite;
        this.scene.add( sprite );
        
        let new_state = {...this.state}
        new_state.red_dot.TObj = sprite

        cb()
    }
    draw_plane( cb ){//RUNS AT INIT THEREFORE IN A CALLBACK CHAIN
        let geometry = new THREE.PlaneGeometry(this.state.plane.width, this.state.plane.height, 4)
        let material = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0, side : THREE.DoubleSide})
        let mesh = new THREE.Mesh( geometry, material)
        mesh.rotation.x = Math.PI / 2
        mesh.position.set(0, 0, 0)
        mesh.name = "plane"
        // mesh.rotation.y = 0.09
        console.log(mesh)
        this.scene.add(mesh)

        let new_state = this.state
        new_state.plane.TObj = mesh
        this.setState( new_state ,()=>{
            console.log("redrew grid")
            geometry.dispose()
            material.dispose()
            cb()
        })
    }

//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================
//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================
//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================
//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================
//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================
//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================
//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================
//CONTROLS MOUSE KEYS EVENTLISTENERS===============================================================================================================



    modes = {//!modes must ALWAYS CONTAIN active_keys, EVEN IF EMPTY (CRASH ANIMATE LOOP)
        navigate:{
            mouse_drag : ()=>{

                console.log("navigate drag")

            },
            active_keys : {
                "PageDown" : this.move_camera.in,
                "PageUp" : this.move_camera.out,
                "ArrowUp" : this.move_camera.up,
                "ArrowDown" : this.move_camera.down,
                "ArrowLeft" : this.move_camera.left,
                "ArrowRight" : this.move_camera.right,
            }
        },
        draw_polygon:{
            mouse_drag : ()=>{
                console.log("draw_polygon drag")
                let set_x = this.state.move_arrows.hover_left_right
                let set_y = this.state.move_arrows.hover_up_down

                //TODO change to position of point rather than move arrow
                let x = this.move_arrows.position.x
                let y = this.move_arrows.position.y
                let z = this.move_arrows.position.z

                if(set_x) x = this.state.mouse.x
                if(set_y) z = this.state.mouse.y
                
                //set arrow 
                this.move_arrows.position.set(x, y, z)
                
            },
            active_keys : {
                // "PageDown" : this.move_camera.in,
                // "PageUp" : this.move_camera.out,
                // "ArrowUp" : this.move_camera.up,
                // "ArrowDown" : this.move_camera.down,
                // "ArrowLeft" : this.move_camera.left,
                // "ArrowRight" : this.move_camera.right,
            }
        },

    }
    drag_active(){
        this.modes[ this.state.active_mode ].mouse_drag()
    }
    reset_key_variables(event){
        if(Object.keys(this.state.active_keys).length === 0){
            if(this.state.moveing.speed > 0) this.set_prop("moveing", "speed", ()=>{return 0} )
        }
    }
    activate_keyboard_button(event){
            if ( event.key === "F5" || event.key ==="F12") return;
            if ( event.repeat === true){ return; }
            if ( event.defaultPrevented) {
              return; // Do nothing if the event was already processed
            }
            //for keys that need to be held down to move faster
            //! DO NOT USE FOR ONE TIME PRESS KEYS
            const activate_key = (key)=>{
                let new_state = {...this.state};
                new_state.active_keys[ key ] = true;
                this.setState(new_state, console.log(Object.keys( this.state.active_keys)))
            }
            let registered_keys = {
                "1" : ()=>{console.log(event.key, "navigate"); this.set_1_state("active_mode", ()=>"navigate") },
                "2" : ()=>{console.log(event.key, "draw_polygon"); this.set_1_state("active_mode", ()=>"draw_polygon") },
                "3" : ()=>{console.log(event.key)},
                "Enter" : ()=>{console.log(event.key)},
            }
            if( registered_keys[ event.key ] ){
                registered_keys[ event.key ]()
            }else{
                //! the following keys are not one time press keys
                //! they must be held in, must be deactivated
                activate_key(event.key)
                // "ArrowDown" : ()=>{},
                // "ArrowUp" : ()=>{},
                // "ArrowLeft" : ()=>{},
                // "ArrowRight" : ()=>{},
                // "PageUp" : ()=>{console.log(event.key)},
                // "PageDown" : ()=>{console.log(event.key)},
            }
            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
    }
    deactivate_keyboard_button(event){
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }
        //for keys that need to be held down to move faster
        //! DO NOT USE FOR ONE TIME PRESS KEYS
        const deactivate_key = (key)=>{
            let new_state = {...this.state};
            if( new_state.active_keys[ key ] ){
                delete new_state.active_keys[ key ]
                this.setState(new_state, console.log(Object.keys( this.state.active_keys)))
            }
        }
        //! the following keys are not one time press keys
        //! they must be held in, must be deactivated
        deactivate_key(event.key)
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
        this.reset_key_variables(event)//! clean up any variables that were being used by active keys prior to release
    }    
    custom_event_listeners_add(){
        this.mount.addEventListener( 'mousemove', this.on_mouse_move, false );
        this.mount.addEventListener( 'mousedown', ()=>this.set_prop("mouse", "down",()=>{return true}), false)
        this.mount.addEventListener( 'mouseup', ()=>this.set_prop("mouse", "down",()=>{return false}), false)
        window.addEventListener("keydown", this.activate_keyboard_button, true );
        window.addEventListener("keyup", this.deactivate_keyboard_button, true );
    }
    custom_event_listeners_remove(){
        this.mount.removeEventListener( 'mousemove', this.on_mouse_move, false );
        this.mount.removeEventListener( 'mousedown', ()=>this.set_prop("mouse", "down",()=>{return true}), false)
        this.mount.removeEventListener( 'mouseup', ()=>this.set_prop("mouse", "down",()=>{return false}), false)        
        window.removeEventListener("keydown", this.activate_keyboard_button, true );
        window.removeEventListener("keyup", this.deactivate_keyboard_button, true );
    }    
//RAYCASTING ===========================================================================================================================
//RAYCASTING ===========================================================================================================================
//RAYCASTING ===========================================================================================================================
//RAYCASTING ===========================================================================================================================
//RAYCASTING ===========================================================================================================================

    raycast_mouse_position(){
        /**
         * 
        ```
        raycastnames = {
            plane : "captures mouse location on drawing plane",
            arrow_up : "moves point up when dragged",
            arrow_down : "moves point up when dragged",
            arrow_left : "moves point up when dragged",
            arrow_right : "moves point up when dragged",
        }
        ```
         */
        this.raycaster.setFromCamera( this.mouse, this.camera );
        let intersects

        if(//prevent raycasting if objects do not exist
            this.state.move_arrows.TObj_up !== null &&
            this.state.move_arrows.TObj_down !== null &&
            this.state.move_arrows.TObj_left !== null &&
            this.state.move_arrows.TObj_right !== null &&
            this.state.move_arrows.TObj_centert !== null &&
            this.state.plane.TObj !== null 
        ){//CALCULATES WHERE THE MOUSE IS ON THE DRAWING PLANE WHICH IS ON Y 0
            intersects = this.raycaster.intersectObjects( 
                [
                    this.state.move_arrows.TObj_up,
                    this.state.move_arrows.TObj_down,
                    this.state.move_arrows.TObj_left,
                    this.state.move_arrows.TObj_right,
                    this.state.move_arrows.TObj_center,
                    this.state.plane.TObj//keep plane at bottom index
                ]
             );
            if(intersects.length > 0){
                // console.log(intersects)
                let new_state = this.state
                // console.log(  this.loc_parse( intersects[intersects.length -1].point.x ))
                const actions = {
                    "arrow_up" : (TObj)=>{ 
                        if(this.state.mouse.down)return;
                        if(new_state.move_arrows.hover_up_down) return;
                        new_state.move_arrows.TObj_up.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_down.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_left.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_right.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_center.material = ARROW_MATERIAL

                        new_state.move_arrows.hover_up_down = true
                        new_state.move_arrows.hover_left_right = false

                    },
                    "arrow_down" : (TObj)=>{ 
                        if(this.state.mouse.down)return;
                        if(new_state.move_arrows.hover_up_down) return;
                        new_state.move_arrows.TObj_up.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_down.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_left.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_right.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_center.material = ARROW_MATERIAL

                        new_state.move_arrows.hover_up_down = true
                        new_state.move_arrows.hover_left_right = false
                    },
                    "arrow_left" : (TObj)=>{ 
                        if(this.state.mouse.down)return;
                        if( new_state.move_arrows.hover_left_right) return;
                        new_state.move_arrows.TObj_up.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_down.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_left.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_right.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_center.material = ARROW_MATERIAL

                        new_state.move_arrows.hover_up_down = false
                        new_state.move_arrows.hover_left_right = true
                    },
                    "arrow_right" : (TObj)=>{ 
                        if(this.state.mouse.down)return;
                        if(new_state.move_arrows.hover_left_right) return;
                        new_state.move_arrows.TObj_up.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_down.material = ARROW_MATERIAL
                        new_state.move_arrows.TObj_left.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_right.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_center.material = ARROW_MATERIAL

                        new_state.move_arrows.hover_up_down = false
                        new_state.move_arrows.hover_left_right = true
                    },
                    "arrow_center" : (TObj)=>{ 
                        if(this.state.mouse.down)return;
                        if(new_state.move_arrows.hover_up_down && new_state.move_arrows.hover_left_right ) return;
                        new_state.move_arrows.TObj_up.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_down.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_left.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_right.material = ARROW_MATERIAL_HIGHLIGHT
                        new_state.move_arrows.TObj_center.material = ARROW_MATERIAL_HIGHLIGHT

                        new_state.move_arrows.hover_up_down = true
                        new_state.move_arrows.hover_left_right = true
                    },                    
                    "plane" : (TObj)=>{
                        new_state.mouse.x = this.loc_parse( TObj.point.x )
                        new_state.mouse.y = this.loc_parse( TObj.point.z )//z because the plane has been rotated                        
                    }                                                     
                }
                intersects.forEach( (TObj, i )=> {
                    actions[ TObj.object.name ](TObj)
                })
                const remove_arrow_highlights = ()=>{
                    if( this.state.mouse.down ) return ;
                    new_state.move_arrows.TObj_up.material = ARROW_MATERIAL
                    new_state.move_arrows.TObj_down.material = ARROW_MATERIAL
                    new_state.move_arrows.TObj_left.material = ARROW_MATERIAL
                    new_state.move_arrows.TObj_right.material = ARROW_MATERIAL
                    new_state.move_arrows.TObj_center.material = ARROW_MATERIAL
                    new_state.move_arrows.hover_up_down = false
                    new_state.move_arrows.hover_left_right = false               
                }
                if(intersects.length === 1 && intersects[0].object.name ==="plane") remove_arrow_highlights();
                

                this.setState(new_state)
            }

        }

    }
//INIT ANIMATE START STOP===============================================================================================================
//INIT ANIMATE START STOP===============================================================================================================
//INIT ANIMATE START STOP===============================================================================================================
//INIT ANIMATE START STOP===============================================================================================================
//INIT ANIMATE START STOP===============================================================================================================
//INIT ANIMATE START STOP===============================================================================================================
//INIT ANIMATE START STOP===============================================================================================================


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

            this.custom_event_listeners_add()
            
            // ! FUNCTIONS HERE MUST END WITH CALLBACK
            this.draw_plane( 
                ()=> this.draw_plane_rulers(//enclose by unexecuted function otherwise it will attempt to run immediately rather than at cb moment
                    ()=> this.draw_red_dot(//enclose by unexecuted function otherwise it will attempt to run immediately rather than at cb moment
                        ()=> this.draw_point_move_arrows(//enclose by unexecuted function otherwise it will attempt to run immediately rather than at cb moment
                            ()=>{
                                console.log("starting")


                                this.start()
                            }

                        )
                    )
                )
            )
           
        })//callback after setstate
        // this.render3D()
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

        //!check activate_keys against active_keys in modes , trigger one iteration if mode and active key is valid
        if( this.modes[ this.state.active_mode ]["active_keys"] ){
            Object.keys( this.state.active_keys ).forEach( active_key => {
                if(this.modes[ this.state.active_mode ]["active_keys"][ active_key ]) this.modes[ this.state.active_mode ]["active_keys"][ active_key ]()
            })
        }
        //!set state.mouse.x  and state.mouse.y
        this.raycast_mouse_position()

        //!PAINTS RED DOT IN NEW POSITION
        if( this.red_dot ) this.red_dot.position.set( this.state.mouse.x, 0.1, this.state.mouse.y  )
        //!MOVES ARROW IF HOVERED AND MOUSE DOWN
        if( this.state.mouse.down ) this.drag_active();

       this.render3D()//this.renderer.render
       this.frameId = window.requestAnimationFrame(this.animate)
    }
    render3D(){
        this.renderer.render(this.scene, this.camera);
    }
    set_1_state( property, set_fn, cb_fn = ()=>{} ){
        let new_state = this.state
        new_state[property] = set_fn()
        this.setState( new_state, cb_fn)
    }
    set_prop(category, property, set_fn, cb_fn = ()=>{} ){
        let new_state = this.state
        new_state[category][property] = set_fn()
        this.setState( new_state, cb_fn)
    }
    set_prop_from_input_event( category, property, type, this_fn ){
        // console.log(category, property)
        return (e)=>{
            let new_state =  {...this.state}
            new_state[category][property] =parse_type(type, e.target.value)
            this.setState({...new_state,}, this_fn )
        }
    }
    componentWillUnmount(){
        this._isMounted = false
        this.stop()
        this.custom_event_listeners_remove()
        this.mount.removeChild(this.renderer.domElement)
    }
    prevent_bubbles(e, cb){
        e.stopPropagation(); e.preventDefault();
        if (cb !== undefined) cb(e);
    }
    render(){
    return(
        <div  >


        {(this.props.id === null)?null:
            <div id={`${this.props.id}`} style={{ width: `100%`, height: `${window.innerHeight /** 0.85*/}px` }}
                ref={(mount) => { this.mount = mount }}//3D CANVAS GETS MOUNTED HERE
            />}


        {/* BUTTONS CONTAINER */}
        <form className="px-2 py-1" style={{minWidth:400}}
            onSubmit={(e)=>{ this.prevent_bubbles(e, ()=>{})}}
            onMouseOver={(e)=>{ this.prevent_bubbles(e, ()=>{})}}
            /**DISABLE onMouseMove event because it prevents user of range slider */
            // onMouseMove={(e)=>{ this.prevent_bubbles(e, ()=>{})}}
        >
            {/* BUTTONS VISUAL CONTAINER */}
            <div style={{
                position: "absolute",
                top: "32px", 
                left: "0px", 
                opacity: 0.9, 
                zIndex: 10000
            }} className="container">
                <div className="row col col-sm-3 ">
                    <div className="col col-sm text-white" >{`Camera X:${ round_2_dec( this.state.camera.x ) } Y:${  round_2_dec(this.state.camera.y)  } Z:${  round_2_dec(this.state.camera.z) }`}</div>
                </div>
                <div className="row col col-sm-3 ">
                    <div className="col col-sm text-white" >{`Mouse X:${this.state.mouse.x} Y:${this.state.mouse.y}`}</div>
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
                    onChange={this.set_prop_from_input_event("mouse", "snap_increment", "number", ()=>{} )}
                    >
                        {/*value indicated the nearest increment to round to */}
                        <option value = {1}>1</option>
                        <option value = {2}>2</option>
                        <option value = {5}>5</option>
                    </select>                        
                    <select className="col col-sm-8 bg-dark text-white"
                    value = {this.state.mouse.snap_decimal}
                    onChange={this.set_prop_from_input_event("mouse", "snap_decimal", "number", ()=>{} )}
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
                        onChange={this.set_prop_from_input_event("mouse", "snap_point", "boolean", ()=>{} )}
                        />
                    </div>                       
                </div>            
                <div className="row col col-sm-3 input-group ">   
                    <div className="col text-white text-left border-light bg-dark border d-flex align-items-start justify-content-center p-0">
                        <div className="col p-0 m-0" >
                            <button className="btn btn-dark btn-sm border-none pt-0" type="button" data-reactroot=""
                                // onClick={ this.set_prop("camera", "y", "number", ()=>{}, ()=>{ return this.state.camera.y - 5} )}
                            >
                                <span className="glyph glyph-mountain_small glyph-small glyph-white align-middle">
                                </span>
                            </button>
                        </div>
                        <div className="col col-8 pl-0 pr-0" >
                            <input type="range" className="form-control p-1" min={5} max={200} 
                            value = { this.state.camera.y }
                            onChange={ this.set_prop_from_input_event("camera", "y", "number", this.update_camera )}
                            
                            />
                        </div>
                        <div className="col p-0 m-0" >
                            <button className="btn btn-dark btn-sm border-none pt-0" type="button" data-reactroot="">
                                <span className="glyph glyph-mountain_large glyph-small glyph-white align-middle">
                                </span>
                            </button>
                        </div>                 
                    </div>
                </div>
            </div>

        </form>

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

/**
* important terms
* console.log( THREE.Math.euclideanModulo(11, 3) ) // same as % oeprator
* 
* LERP = Linear Interpolation (give 2 vectors or points and  %/decimal place)
* it will than return a point between the 2 points depending on the decimal
* mimics straight line movement between 2 points
*   THREE.Math.degToRad( deg )
*   THREE.Math.
*   THREE.Math.lerp( x, y, t)
*   Vector3.lerpVectors(v1, v2, t)
* 
* 
* 
```
    const calc_xy_on_circle = (r, a, cx , cy) =>{
        //! angle converted to radians
        let radians = a * Math.PI / 180 
        let x = Math.cos(radians) * (cx + r)
        let y = Math.sin(radians) * (cy + r)
        return [x, y]
    }

    const calc_xy_on_circle2 = (r, a, cx , cy) =>{
        //! angle converted to radians
        let radians = THREE.Math.degToRad(a)
        let V3 = new THREE.Vector3( cx , cy, 0)
        let c = new THREE.Cylindrical( r, radians, cy)
        let new_V3 = V3.setFromCylindrical( c )
        return [V3.z, V3.x]
    }
```
* EXAMPLE OF ROTATION AROUND SPHERICAL POSITION (ORBITTING)
*
*
```
    let sphere_geo = new THREE.SphereGeometry(1, 8, 8)
    let sphere_mat = new THREE.MeshBasicMaterial({color: 0x993333, wireframe: true})
    TEST_MESH = new THREE.Mesh( sphere_geo, sphere_mat)
    this.scene.add(TEST_MESH)
    //! convert degrees to radians 
    console.log( TEST_MESH.position.setFromSpherical( new THREE.Spherical( 10, THREE.Math.degToRad(45), THREE.Math.degToRad(45)) ) )
    console.log(TEST_MESH)
    //! THIS PART GOES IN animate
    TEST_ROTATE += 0.03
    TEST_MESH.position.setFromSpherical( new THREE.Spherical( 10, TEST_ROTATE , TEST_ROTATE) ) 
```
*
*
*
*/