import * as THREE from 'three';

/**calculates and returns an array of arrays of xy coordinates,
 * feed into ExtrudeGeometry.jsx to render
 * 
 * @param {number} inner_r inner radius of cogwheel
 * @param {number} outer_r outer radius of cogwheel
 */
const CogWheel2D = ( inner_r = 10, outer_r = 15)=>{
    let cx = 0, cy = 0 
    /**CALCULATE COG COORDS FOR EXTRUDE SHAPE */
    const calc_xy_on_circle = (r/**radius */, a/*angle in degrees*/, cx /*angle */, cy) =>{
        //! angle converted to radians
        // let radians = a * Math.PI / 180 
        let radians = THREE.Math.degToRad(a)
        let x = Math.cos(radians) * (cx + r)
        let y = Math.sin(radians) * (cy + r)
        return [x, y]
    }
    const calc_tooth = (r, angle, cx, cy)=>{
        /* angle = 360 / 8 = 40 - 10 for gap size = 30 / 2 = 15 */
        let p_l = calc_xy_on_circle(r, angle - 10 , cx, cy) /**point left from center XY */
        let p_m = calc_xy_on_circle(r, angle , cx, cy) /**point center XY*/
        let p_r = calc_xy_on_circle(r, angle + 10, cx, cy) /**point right of center XY*/
        // console.log([ p_l[0], p_l[1], p_m[0], p_m[1], p_r[0], p_r[1]])
        return [ p_l[0], p_l[1], p_m[0], p_m[1], p_r[0], p_r[1]]
    } 
    const calc_tooth_invert = (r, angle, cx, cy)=>{
        /**10 degrees left */
        let p_u_l = calc_xy_on_circle( r ,angle + 20 , cx, cy)
        let p_u_m = calc_xy_on_circle( r ,angle + 22.5, cx, cy)
        let p_u_r = calc_xy_on_circle( r ,angle + 25, cx, cy)
        return [ p_u_l[0], p_u_l[1], p_u_m[0], p_u_m[1], p_u_r[0], p_u_r[1]]
    }
    let points = []
    new Array(8).fill(360 / 8).map( ( degrees, i ) =>{ return i * degrees } ).forEach(( a, i )/**angle */=>{ 
        console.log(cx, cy)
        let tooth = calc_tooth(outer_r, a, cx, cy)  /**apex curve */
        let tooth_invert =  calc_tooth_invert(inner_r, a, cx, cy)/*right side*/ 
        if( i === 0) points.push([ tooth[0], tooth[1] ])
        points.push(tooth)
        points.push([tooth_invert[0], tooth_invert[1]]) /**connect with straight light */
        points.push(tooth_invert)
        points.push( calc_xy_on_circle( outer_r, a + 35, cx, cy ))/**connecting line form inner to outer curve of next  */
    })
    return points
}
export default CogWheel2D