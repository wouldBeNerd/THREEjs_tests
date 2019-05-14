import * as THREE from 'three';
import Line from "./Line"
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
const Grid3D = () => {

    let grid = {
        w: 10,//width
        h: 10,//height
        d: 10,//depth
        V3Start : new THREE.Vector3( -5, 0, -5 ),
        V3Stop : new THREE.Vector3( 5, 10, 5 ),
        space : 1
    }
    grid.xPts = new Array( grid.w / grid.space ).fill(0).map( (und, i) =>{
        return i * grid.space + grid.V3Start.x 
    })
    grid.xPts.push(  grid.V3Start.x + grid.w  )

    grid.yPts = new Array( grid.w / grid.space ).fill(0).map( (und, i) =>{
        return i * grid.space + grid.V3Start.y 
    })
    grid.yPts.push(  grid.V3Start.y + grid.h  )

    grid.zPts = new Array( grid.w / grid.space ).fill(0).map( (und, i) =>{
        return i * grid.space + grid.V3Start.z 
    })
    grid.zPts.push(  grid.V3Start.z + grid.d  )

    console.log(grid.zPts)

    let group = new THREE.Group()
    //compile all line locations
    let xlines = grid.xPts.map( (xP, xi) => {
        return Line({
            Vectors:[
                new THREE.Vector3( xP, grid.V3Start.y, grid.V3Start.z ),
                new THREE.Vector3( xP, grid.V3Stop.y, grid.V3Start.z ),
                new THREE.Vector3( xP, grid.V3Stop.y, grid.V3Stop.z ),
                new THREE.Vector3( xP, grid.V3Start.y, grid.V3Stop.z ),
                new THREE.Vector3( xP, grid.V3Start.y, grid.V3Start.z ),
            ], opacity:0.5, color:0x888888
        })
    } )
    xlines.forEach(line => group.add( line) )


    let ylines = grid.yPts.map( (yP, yi) => {
        return Line({
            Vectors:[
                new THREE.Vector3( grid.V3Start.x, yP, grid.V3Start.z ),
                new THREE.Vector3( grid.V3Stop.x, yP, grid.V3Start.z ),
                new THREE.Vector3( grid.V3Stop.x, yP, grid.V3Stop.z ),
                new THREE.Vector3( grid.V3Start.x, yP, grid.V3Stop.z ),
                new THREE.Vector3( grid.V3Start.x, yP, grid.V3Start.z ),
            ], opacity:0.2
        })
    } )
    ylines.forEach(line => group.add( line) )

    //compile all line locations
    let zlines = grid.zPts.map( (zP, zi) => {
        return Line({
            Vectors:[
                new THREE.Vector3( grid.V3Start.x, grid.V3Start.y, zP ),
                new THREE.Vector3( grid.V3Stop.x, grid.V3Start.y, zP ),
                new THREE.Vector3( grid.V3Stop.x, grid.V3Stop.y, zP ),
                new THREE.Vector3( grid.V3Start.x, grid.V3Stop.y, zP ),
                new THREE.Vector3( grid.V3Start.x, grid.V3Start.y, zP ),
            ], opacity:0.5
        })
    } )
    zlines.forEach(line => group.add( line) )


    // group.add( )
    return group

}
export default Grid3D

 