import * as THREE from "three"
//taken as example from youtube clip #21 THREE.js Create Custom Geometry(2)

//       v4----- v1     the basic cube has 6 vertices
//      / |     / |     the bottom face has vertices (2 3 5 7)
//     v5----- v0 |     the top face has vertices ( 0 1 4 5)
//     |  |    |  |     the front face has vetices ( 0 3 7 6 )
//     |  |v6--|--|v3   the back face has vertices ( 1 3 4 5 )
//     | /     | /      the right face has vertices ( 0 1 3 2 )
//     v7------v2       the left face hasv vertices ( 4 5 7 6 ) 


// ALSO CHECK https://dustinpfister.github.io/2018/04/15/threejs-vector3/
const CustomBox = ()=>{

    let geometry = new THREE.Geometry();
 
    // create vertices with Vector3
    geometry.vertices.push(
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(1, 1, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 1, -1),
        new THREE.Vector3(-1, 1, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1));
     
    // faces are made with the index
    // values of from the vertices array
    geometry.faces.push(
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4));
     
    geometry.normalize();
    geometry.computeFlatVertexNormals();
    

}
export default CustomBox