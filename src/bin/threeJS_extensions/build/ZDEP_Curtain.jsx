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

    let segs = 4 //faces per side

    let width = 4
    let height = 2
    let depth = 8

    let material = new THREE.MeshStandardMaterial({  opacity: 1, vertexColors: THREE.VertexColors})
    let geometry = new THREE.Geometry();


    //TOP SIDE
    let x_pts = new Array(segs).fill( width / segs ).map( (_inc, i) => _inc * i).reverse(); x_pts.unshift(width)//fill arr with all incremental poitns of x
    let y_pts = new Array(segs).fill( height / segs ).map( (_inc, i) => _inc * i).reverse(); y_pts.unshift(height)//fill arr with all incremental poitns of x
    let z_pts = new Array(segs).fill( depth / segs ).map( (_inc, i) => _inc * i).reverse(); z_pts.unshift(depth)//fill arr with all incremental poitns of x

    console.log(x_pts, y_pts, z_pts)
    
    let normal = new THREE.Vector3( 0 , 1, 0)// reflect light from the top (0,1,0) provided face is pointingin the right direction

    // let x_len = x_pts.length;
    let y = y_pts[ y_pts.length - 1 ]

    let Vectors = []
    let V_count = 0
    let Faces = []

    for( let zi = 0; zi < z_pts.length - 1 ; zi++){ //max reduces by one object finished by then
        console.log(zi, z_pts[ zi ], z_pts[ zi + 1 ])
        let z1 = z_pts[ zi ]
        let z2 = z_pts[ zi + 1 ]
        let x1 = x_pts[ 0 ]
        let x2 = x_pts[ 0 + 1 ]
        
        if(zi === 0){
            Vectors = [
                new THREE.Vector3( x1, y,  z1 ), //Fi_1
                new THREE.Vector3( x2, y,  z1 ), //Fi_2
                new THREE.Vector3( x1, y,  z2 )  //Fi_3
            ]
            V_count++;
            V_count++;
        }
        let V3 = new THREE.Vector3( x1, y,  z2 ) // Fi_3
        let V4 = new THREE.Vector3( x2, y,  z2 ) // Fi_4
        Vectors.push(V3)
        Vectors.push(V4)
        V_count++;
        V_count++;

        let Fi_1 = V_count - 4
        let Fi_2 = V_count - 3
        let Fi_3 = V_count - 2
        let Fi_4 = V_count - 1

        console.log( "Fi_1", Fi_1, Vectors[Fi_1] )
        console.log( "Fi_2", Fi_2, Vectors[Fi_2] )
        console.log( "Fi_3", Fi_3, Vectors[Fi_3] )
        console.log( "Fi_4", Fi_4, Vectors[Fi_4] )


        Faces.push( new THREE.Face3( Fi_3, Fi_1, Fi_2, normal, undefined, 0 ) )
        Faces.push( new THREE.Face3( Fi_3, Fi_2, Fi_4, normal, undefined, 0 ) )

    }
    
    let Fi_2 = V_count - 2
    let Fi_3 = V_count - 1
    let Fi_4 = V_count
    console.log( "Fi_2", Fi_2, Vectors[Fi_2] )
    console.log( "Fi_3", Fi_3, Vectors[Fi_3] )
    console.log( "Fi_4", Fi_4, Vectors[Fi_4] )

    Faces.push( new THREE.Face3( Fi_3, Fi_2, Fi_4, normal, undefined, 0 ) )



    
    geometry.vertices = Vectors
    geometry.faces = Faces
    
    let v_colors = [ 0xff6600, 0x66ff00, 0x0066ff]
    geometry.faces.forEach( face => [0,1,2].forEach(v_i => face.vertexColors[v_i] = new THREE.Color(v_colors[v_i])) )
    

    console.log( geometry.vertices  )
    console.log( geometry.faces  )

    let mesh = new THREE.Mesh( geometry, material )
    // mesh.position.set(0, 0.5, 0)
    // mesh.rotation.x += 0.7

    return mesh

}
export default Curtain

