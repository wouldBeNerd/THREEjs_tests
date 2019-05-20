import * as THREE from 'three';
/**
 * points should be supplied like this
 * 
```
    let points = [
        [ 0, 0], // shape.moveTo(p[0], p[1]);
        [ 0, 0, 12, 0, 12, 8], //shape.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5])
        [ 0, 8 ], //shape.lineTo(p[0], p[1]);
        [ 0, 8, -12, 8, -12, 0],
        [-12, 0],
    ]
```
 *
 * ![result of points](./ZZ_code_doc_assets/ExtrudeGeometry.png)

 * #### how bezierCurve works pass array of 6 numbers
```
[ 
    x, y //starting point,
    x, y //curve along/towards,
    x, y //ending point
]
```
 * 
 * Bare in mind you are always drawing the shape along a X and Y dimension.
 * If you want the shape to look upwards you need to rotate on X by 90°  `mesh.rotateX(Math.PI / 2)` 
 * 
 * 
 * first 2 points are start location(previous point), 
 * 2nd to points are the arc creation, * think of it as a point  you are skipping but arcing towards
 * last 2 points are destination off curve(end location)
 ```
   shape.bezierCurveTo(length, width, length, 0, 0, 0)
 ```
 *
 * 
 * @param {[[number]]} points 
 * @param {new THREE.MeshBasicMaterial} material 
 * @param {{ steps: number, depth: number, bevelEnabled:boolean, bevelSize:number, bevelOffset:number, bevelSegments:number }} extrudeSettings 
 * @param {{x:number, y:number, z:number}} scale_geometry scale the geometry OPTIONAL
 */
const ExtrudeGeometry = (points, 
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00, /*wireframe:true */} ),  
    extrudeSettings = {
        steps: 2,
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelOffset: 0,
        bevelSegments: 4
    },
    scale_geometry 
) => {

    let shape = new THREE.Shape()
    points.forEach(( p, i)=>{
        if(i === 0) shape.moveTo(p[0], p[1]); //always indicate starter point
        if(p.length === 6) shape.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5])//curve also added if i === 0
        else if( i !== 0) shape.lineTo(p[0], p[1]);
    })
    
    let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    if(scale_geometry) geometry.scale( scale_geometry.x, scale_geometry.y, scale_geometry.z)
    let mesh = new THREE.Mesh( geometry, material ) ;
    return mesh

}
export default ExtrudeGeometry
//
/**USUAL shape creation example
 * 
 * ```
    let length = 12, width = 8;

    let shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.bezierCurveTo(length, width, length, 0, 0, 0)
 * ```
 */