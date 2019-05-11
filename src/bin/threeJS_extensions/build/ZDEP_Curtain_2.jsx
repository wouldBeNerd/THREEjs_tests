import * as THREE from 'three';

/**this function returns a THREE.js mesh
 * it must be passed in the `to_scene` array of the ThreeScene component
 * 
 * in the examplebelow the variable `curtain_test` represents a THREE_obj returned by this function
```jsx

        let curtain_test = Curtain()

        <ThreeScene to_scene = {[ curtain_test ]}
            id="cvcalc"
        />
``` 
 * 
 */
const Curtain = () => {
    //TEST STTRUCTURE
    // const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
    // const material = new THREE.MeshStandardMaterial({ color : 0xdd0000})
    // let mesh = new THREE.Mesh( geometry, material );

    let top_hem_w = 0.06
    let bottom_hem_w = 0.1
    let left_hem_w = 0.02
    let right_hem_w = 0.02

    let fullness_percent = 100
    let fullness_direction = [0, 0, 0] /**[ 90, 0, 0 ] fullness from top to bottom */
    
    let surfaces = [
        { 
            coords : [ [-4,0,-3], [4,0,-3], [4,0,3], [-4,0,3] ], 
            color: 0xffffff, texture : "texture_path"
        }
    ]
    let finishings = [//**line based */
         //undesided wether finishings should be attached to surfaces or not. sometimes finishings will dissapear inside other finishings with double layering. 
        {},//TOP WEBBING 60 MM
        {}
    ]
    let components = [//**point based,  but can be repeated over a line */
        {_draw_id : "grommet", size:[0.025] ,coords : [[-4, 0, -3], [4, 0,-3]] , snap:"inward", angle:[], repeated_every: 0.25, fix_leftover : true , adhere_fullness : true, penetrate:true},//grommet
        // {_draw_id : "ribbon", size:[0.02, 0.001 ,0.5] ,coords : [[-4, 0, -3], [4, 0,-3]] , snap:"inward" , repeated_every: 0.25, fix_leftover : true , adhere_fullness : true, penetrate:true},//ribbon
    ]



    const apply_face_vertice = (apply_face_fn, apply_vertice_fn, THREE_Geometry)=>{
        return (face)=>{
            let v_a = face.a//vertice indexes
            let v_b = face.b
            let v_c = face.c
    
            let v1 = THREE_Geometry.vertices[ v_a ] //apply y equation by x and return x for color calc
            let v2 = THREE_Geometry.vertices[ v_b ] 
            let v3 = THREE_Geometry.vertices[ v_c ] 

            if(apply_face_fn) apply_face_fn(face)

            if(apply_vertice_fn) apply_vertice_fn(v1)
            if(apply_vertice_fn) apply_vertice_fn(v2)
            if(apply_vertice_fn) apply_vertice_fn(v3)
        }
    }
    const refactor_y_pos_vertice_curry = ()=>{
        const pi_v = 20
        return ( vertice )=>{
            let temp_y = (vertice.y + 0) 
            vertice.y = 0
            // console.log('vertice', vertice.x, Math.sin( vertice.x ))
            let sin_product = Math.sin( pi_v * vertice.x ) / 15
            // vertice.y += Math.sin( vertice.x )
            vertice.y = sin_product + temp_y
        }
    }
    const refactor_y_pos_vertice = refactor_y_pos_vertice_curry()
    

    let drawings = {
        grommet : ({ size, vector, adhere_fullness, penetrate, rotate })=>{
            let shiny_black_material = new THREE.MeshStandardMaterial({  opacity: 1, vertexColors: THREE.VertexColors, roughness : 0 , metalness : 1, side : THREE.DoubleSide, color: new THREE.Color(0x333333) })
            let torus = new THREE.CylinderGeometry(size[0], size[0], size[0], 10, 2, 3)
            let translate_xyz = {x:vector.x, y:vector.y, z:vector.z} 
            refactor_y_pos_vertice( translate_xyz)
            console.log(translate_xyz)

            // torus.translate( vector.x, vector.y, vector.z )
            let torus_mesh = new THREE.Mesh( torus, shiny_black_material)
            torus_mesh.position.set(translate_xyz.x, translate_xyz.y, translate_xyz.z)
            // console.log(vector)
            // refactor_y_pos_mesh(torus_mesh, vector)

            return torus_mesh
        }
    }
    let component_meshes = components.map(({_draw_id, size, coords, snap, repeated_every, fix_leftover, adhere_fullness, penetrate})=>{
        if( coords.length > 1){//repeating
            if(snap === "inward") { 
                // let offset_v = new THREE.Vector3(size[0], 0, 0)
                let v1 = new THREE.Vector3( coords[0][0] , coords[0][1] , coords[0][2]   )
                let v2 = new THREE.Vector3( coords[1][0] , coords[1][1] , coords[1][2]   )
                let distance = v1.distanceTo(v2)
                let iterations = distance / repeated_every
                let alpha_factor = 1 / iterations
                console.log(v1, v2, distance, iterations)
                //LINEAR INTERPOLATION 
                let repeat_vectors = [ v1 ]
                // console.log(v1, v2)
                for(let i = 0; i < iterations; i++){
                    let new_v = new THREE.Vector3()
                    new_v.lerpVectors(v1, v2, alpha_factor * i)

                    
                    //ADJUST FOR FULLNESS HERE?
                    // new_v.y += Math.sin((Math.PI * 5) * new_v.x ) / 70
                    repeat_vectors.push(  new_v )

                    // console.log(repeat_vectors[i])
                }
                console.log(repeat_vectors)
                // let group = new THREE.Group()
                return repeat_vectors.map( vector => drawings[ _draw_id ]( { size, vector, adhere_fullness, penetrate } ) )
                // console.log(repeat_vectors)
                // return group
            }
        }
    })


    let width = 8, width_segs = 250;
    let height = 0.01, height_segs = 2;
    let depth = 6, depth_segs = 100;

    let left_edge = (width / 2) * -1
    let right_edge = (width / 2)

    let top_edge = (depth / 2) * -1
    let bottom_edge = (depth / 2)

    let edges_height = 0.015

    let yellow_color = new THREE.Color(0xffff00)
    let red_color = new THREE.Color(0xff0000)

    let main_cloth_material = new THREE.MeshStandardMaterial({  opacity: 1, vertexColors: THREE.VertexColors, roughness : 0.7 , metalness : 0, side : THREE.DoubleSide })

    let left_hem_material = new THREE.MeshStandardMaterial({ color:yellow_color, opacity: 1, vertexColors: THREE.VertexColors, roughness : 0.7 , metalness : 0.4, side : THREE.DoubleSide })
    let right_hem_material = new THREE.MeshStandardMaterial({ color:yellow_color,  opacity: 1, vertexColors: THREE.VertexColors, roughness : 0.7 , metalness : 0.4, side : THREE.DoubleSide })

    let top_hem_material = new THREE.MeshStandardMaterial({ color:red_color,  opacity: 1, vertexColors: THREE.VertexColors, roughness : 0.7 , metalness : 0.4, side : THREE.DoubleSide })
    let bottom_hem_material = new THREE.MeshStandardMaterial({ color:red_color,  opacity: 1, vertexColors: THREE.VertexColors, roughness : 0.7 , metalness : 0.4, side : THREE.DoubleSide })

    
    let main_cloth =  new THREE.BoxGeometry(
        width ,
        height ,
        depth ,
        width_segs ,
        height_segs ,
        depth_segs
        )
    





    let left_hem = new THREE.BoxGeometry( left_hem_w, edges_height, depth )
    left_hem.translate( left_edge + ( left_hem_w / 2)  , 0, 0 )
    let right_hem = new THREE.BoxGeometry( right_hem_w, edges_height, depth )
    right_hem.translate( right_edge - (right_hem_w / 2) , 0, 0 )


    let top_hem = new THREE.BoxGeometry( width, edges_height, top_hem_w, width_segs )
    top_hem.translate( 0 , 0, top_edge + ( top_hem_w / 2) )
    let bottom_hem = new THREE.BoxGeometry( width, edges_height, bottom_hem_w, width_segs )
    bottom_hem.translate( 0 , 0, bottom_edge - (bottom_hem_w / 2) )
    


    const apply_hemm_left =( vertice ) => {
        let { x } = vertice
        if( x < left_edge ){
            vertice.x += ( left_edge - x )
            // vertice.y += height * 2
        }
    }
    const apply_hemm_right =( vertice ) => {
        let { x } = vertice
        if( x > right_edge ){
            // console.log(x, right_edge, right_edge - x )
            vertice.x -=  ( x - right_edge )
            // vertice.y += height * 2
        }
    }
    const apply_pocket=( vertice ) => {

    }

    const apply_singleband=( vertice ) => {

    }



    const apply_face = (face)=>{

        let v_a = face.a//vertice indexes
        let v_b = face.b
        let v_c = face.c

        let v1 = main_cloth.vertices[ v_a ] //apply y equation by x and return x for color calc
        let v2 = main_cloth.vertices[ v_b ] 
        let v3 = main_cloth.vertices[ v_c ] 
        
        let set_hemm_color = () => new THREE.Color( 0xff0000);
        let set_default_color = () => new THREE.Color( 0x0000bb );

        let v1_color = set_default_color()
        let v2_color = set_default_color()
        let v3_color = set_default_color()

        // if( v1.x < left_edge || v1.x > right_edge ) v1_color = set_hemm_color() 
        // if( v1.x < left_edge || v1.x > right_edge ) console.log(v1_color)
        // if( v2.x < left_edge || v2.x > right_edge ) v2_color = set_hemm_color()
        // if( v2.x < left_edge || v2.x > right_edge ) console.log(v2_color)
        // if( v3.x < left_edge || v3.x > right_edge ) v3_color = set_hemm_color()
        // if( v3.x < left_edge || v3.x > right_edge ) console.log(v3_color)

        // apply_hemm_left( v1 )
        // apply_hemm_right( v1 )
        // apply_pocket( v1 )
        // apply_singleband( v1 )

        // apply_hemm_left( v2 )
        // apply_hemm_right( v2 )
        // apply_pocket( v2 )
        // apply_singleband( v2 )

        // apply_hemm_left( v3 )
        // apply_hemm_right( v3 )
        // apply_pocket( v3 )
        // apply_singleband( v3 )

        refactor_y_pos_vertice( v1 )
        refactor_y_pos_vertice( v2 )
        refactor_y_pos_vertice( v3 )

        face.vertexColors[0] = v1_color
        face.vertexColors[1] = v2_color
        face.vertexColors[2] = v3_color

        // let a_c_255 = `0${Math.floor( (v1.x + (10/2) ) / 10 * 255).toString(16)}`.slice(-2)//calculate b color based on x
        // let b_c_255 = `0${Math.floor( (v2.x + (10/2) ) / 10 * 255).toString(16)}`.slice(-2)//calculate b color based on x
        // let c_c_255 = `0${Math.floor( (v3.x + (10/2) ) / 10 * 255).toString(16)}`.slice(-2)//calculate b color based on x

        // face.vertexColors[0] = new THREE.Color( `#00${a_c_255}00` )
        // face.vertexColors[1] = new THREE.Color( `#00${b_c_255}00` )
        // face.vertexColors[2] = new THREE.Color( `#00${c_c_255}00` )
    
        // let rgb = `rgb(${rgbV3[0]}, ${rgbV3[1]}, ${rgbV3[2]})`
        // rgb.color = new THREE.Color(rgb)


    }
    main_cloth.faces.forEach( apply_face )

    top_hem.faces.forEach( apply_face_vertice(undefined, refactor_y_pos_vertice, top_hem) )
    bottom_hem.faces.forEach( apply_face_vertice(undefined, refactor_y_pos_vertice, bottom_hem) )






    
    // let v_colors = [ 0xff6600, 0x66ff00, 0x0066ff]
    // geometry.faces.forEach( face => [0,1,2].forEach(v_i => face.vertexColors[v_i] = new THREE.Color(v_colors[v_i])) )
    

    console.log( main_cloth.vertices  )
    console.log( main_cloth.faces  )


    //recalculates the shades
    main_cloth.computeVertexNormals()
    top_hem.computeVertexNormals()
    bottom_hem.computeVertexNormals()


    let main_cloth_mesh = new THREE.Mesh( main_cloth, main_cloth_material )

    let left_hem_mesh = new THREE.Mesh( left_hem, left_hem_material )
    let right_hem_mesh = new THREE.Mesh( right_hem, right_hem_material )

    let top_hem_mesh = new THREE.Mesh( top_hem, top_hem_material )
    let bottom_hem_mesh = new THREE.Mesh( bottom_hem, bottom_hem_material )

    let group = new THREE.Group()
    group.add(main_cloth_mesh)

    group.add(left_hem_mesh)
    group.add(right_hem_mesh)

    group.add(top_hem_mesh)
    group.add(bottom_hem_mesh)

    component_meshes.forEach( comp_meshes => {
        comp_meshes.forEach( c_mesh => group.add(c_mesh))
    })

    // mesh.position.set( 3, 0, 4)
    // main_cloth_mesh.position.set(0, -1, 0)
    // mesh.rotation.x += 0.7

    return group

}
export default Curtain

 