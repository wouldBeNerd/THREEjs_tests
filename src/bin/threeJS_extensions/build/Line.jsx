import * as THREE from 'three';

/**this function returns a THREE.js mesh, draws a line with the Vectors supplied
 * **yet to implement
 *
 * .linejoin : String
Define appearance of line joints. Possible values are 'round', 'bevel' and 'miter'. Default is 'round'. 

This corresponds to the 2D Canvas lineJoin property and it is ignored by the WebGL renderer.
 * 
 * 
 * 
 * .linecap : String
Define appearance of line ends. Possible values are 'butt', 'round' and 'square'. Default is 'round'.
 *
 *
 */
const Line = ({Vectors, color = 0xffffff, linewidth = 1, opacity = 1 }) => {

let material = new THREE.LineBasicMaterial({
    color,
    linewidth ,
    opacity,
});

let geometry = new THREE.Geometry();
Vectors.forEach( Vector => geometry.vertices.push(Vector))

let line = new THREE.Line( geometry, material );
return line


}
export default Line

 