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
const config = {
    components :[
        {
            name: "Molton",
            color: 0x000099,
            type: "surface",
            thickness: 0.01,
            points : [
                [-4, 0, -3],
                [4, 0, -3],
                [4, 0, 3],
                [-4, 0, 3],
            ]
        },
        {
            type: "surface",
            thickness: 0.02
        },
        {
            type : "point"
        }        
    ]

}

    // let points = [
    //     [0, 0, 0],
    //     [0, 0, 6],
    //     [8, 0, 6],
    //     [8, 0, 0],
    // ]

    let points = [
        // [4, 0, 0],
        [3, 0, 0],// ! PROBLEMS
        // [4, 0, 0],
        [4, 0, -3],
        [-4, 0, -3],
        // [-4, 0, 0],
        [-7, 0, 0],// ! PROBLEMS
        // [-4, 0, 0],
        [-4, 0, 3],
        [4, 0, 3],
    ]

    console.log(points)

    // let geometry = new THREE.Geometry()
    // let v2_arr = []
    // geometry.vertices = points.map( p3 => {
    //     v2_arr.push(new THREE.Vector2(p3[0], p3[2]))
    //     let v3 = new THREE.Vector3()
    //     v3.fromArray(p3)
    //     return v3
    // })

    // let face_arr = new Array( points.length - 2).fill(0)
    // //FACES must be assigned in a clockwise fashion (center of clock = 0,0,0)
    // geometry.faces = face_arr.map( (nothing, n_i )=> {
    //     console.log(n_i)
    //     return new THREE.Face3( 0, n_i+1, n_i+2)
    // })
    // geometry.faces.push( new THREE.Face3( geometry.faces.length, geometry.faces.length +1 , 0  ) )
    
    // geometry.computeBoundingSphere();
    // geometry.mergeVertices()

    // // let material = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe:true })
    // let material = new THREE.MeshStandardMaterial({ color: 0x0000ff })
    // let mesh = new THREE.Mesh( geometry, material)
    




    let geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    let vertices = new Float32Array( [
         0.0,  0.0,  1.0,
         1.0,  0.0,  1.0,
         1.0,  1.0,  1.0,
    
         1.0,  1.0,  1.0,
         0.0,  1.0,  1.0,
         0.0,  0.0,  1.0,
//-----------------------------

         1.0,  0.0,  1.0,
         2.0,  0.0,  1.0,
         2.0,  1.0,  1.0,

         2.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  0.0,  1.0,

//-----------------------------
         0.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  2.0,  1.0,
    
         1.0,  2.0,  1.0,
         0.0,  2.0,  1.0,
         0.0,  1.0,  1.0,
//-----------------------------

         1.0,  1.0,  1.0,
         2.0,  1.0,  1.0,
         2.0,  2.0,  1.0,

         2.0,  2.0,  1.0,
         1.0,  2.0,  1.0,
         1.0,  1.0,  1.0,


    ] );
    
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3,  ) );
    let wireframe = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } );
    let material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );



    let mesh = new THREE.Mesh( geometry, wireframe );

    let mesh_2 = new THREE.Mesh( geometry, material ); 

    mesh_2.position.z = -3

    let group = new THREE.Group()
    group.add(mesh)
    group.add(mesh_2)
    return group

}
export default Curtain

 