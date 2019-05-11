import * as THREE from "three"

const SinTest = ()=>{



const refactor_y_pos_vertice = ( vertice )=>{
    vertice.y += Math.sin( Math.PI * vertice.x ) / 2
    return vertice
}


let mat = new THREE.MeshStandardMaterial({  side : THREE.DoubleSide, color: new THREE.Color(0xff0000) })

let geometry = new THREE.BoxGeometry(4, 0.01, 0.2,  30, 4, 4)

geometry.vertices.forEach( refactor_y_pos_vertice )


let new_vectors = geometry.vertices.map( vertice =>{ return vertice;})


let mesh = new THREE.Mesh(geometry, mat)

let group = new THREE.Group()

group.add(mesh)

// console.log(new_vectors)

new_vectors.forEach( v3 => {
    
    let mat = new THREE.MeshStandardMaterial({  side : THREE.DoubleSide, color: new THREE.Color(0x00ff00) })

    let circle_geometrie = new THREE.CylinderGeometry( 0.01, 0.01, 0.01 )

    circle_geometrie.translate( v3.x, v3.y, v3.z )

    let mesh = new THREE.Mesh(circle_geometrie, mat)

    group.add(mesh)

})


const fn_m_rand = ()=>{return Math.random() + 0.1}

let new_x_arr = [-2, -1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6, 2]

let new_vectors_2 = new_x_arr.map(x => new THREE.Vector3(  x, 0, 0))

new_vectors_2.forEach( v3 => {
    
    let mat = new THREE.MeshStandardMaterial({  side : THREE.DoubleSide, color: new THREE.Color(0x0000ff) })

    let circle_geometrie = new THREE.CylinderGeometry( 0.01, 0.01, 0.01 )

    v3.x += 0.2
    v3.y += 0.2

    refactor_y_pos_vertice(v3)

    circle_geometrie.translate( v3.x, v3.y, v3.z )

    let mesh = new THREE.Mesh(circle_geometrie, mat)

    group.add(mesh)

})


return group
}
export default SinTest