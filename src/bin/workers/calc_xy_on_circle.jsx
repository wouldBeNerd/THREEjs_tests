import * as THREE from "three"
/**calculate a new XY use radius and angle to calculate point on circumference by x and y
 * 
 * uses THREE methods to calculate the equivalen of this.
```
    let radians = a * Math.PI / 180 
    let x = Math.cos(radians) * (cx + r)
    let y = Math.sin(radians) * (cy + r)
    return [x,y]
```
    * 
    * @param {number} r radius
    * @param {number} a angle in degrees
    * @param {number} cx x coord of center of circle
    * @param {number} cy y coord of center of circle
    * @returns {[x,y]} returns array, [0] = x, [1] = y
    */
const calc_xy_on_circle = (r/**radius */, a/*angle in degrees*/, cx /*angle */, cy) =>{
    //! angle converted to radians
    let radians = THREE.Math.degToRad(a)
    let V3 = new THREE.Vector3( cx , cy, 0)
    let c = new THREE.Cylindrical( r, radians, cy)
    let new_V3 = V3.setFromCylindrical( c )
    return [V3.z, V3.x]
}
export default calc_xy_on_circle