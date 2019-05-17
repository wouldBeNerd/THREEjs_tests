import * as THREE from 'three';

/**
 * TODO: if you wish to use turn into async await function in the abscence of font
 * TODO: 
 */
const Text3D = ( message, config, cb )=>{

    if(config.font === undefined || config.font === null){
        let loader = new THREE.FontLoader();
        loader.load("lib/three_font/helvetiker_regular.typeface.json", (font)=>{
            this.font = font

            var textMaterial = new THREE.MeshBasicMaterial( 
                { color: 0x00ff00 }
              );    
            let textgeometry = new THREE.TextGeometry(message, {
                font: font,
                size: 0.4,
                height: 0.004,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.004,
                bevelSize: 0.001,
                bevelOffset: 0,
                bevelSegments: 5
            })
            let mesh = new THREE.Mesh( textgeometry, textMaterial)
            // mesh.scale()
            mesh.rotation.x = (Math.PI / 2)*3
            mesh.position.set(-10, 0.5, -10)
            // this.mesh.needsUpdate = true
            this.scene.add(mesh)
            // this.scene.needsUpdate = true
            cb()

        })

    }else{

        // var textMaterial = new THREE.MeshPhongMaterial( 
        //     { color: 0xff0000, specular: 0xffffff }
        //   );    
        // let textgeometry = new THREE.TextGeometry("123.456", {
        //     font: this.font,
        //     size: 80,
        //     height: 5,
        //     curveSegments: 12,
        //     bevelEnabled: true,
        //     bevelThickness: 10,
        //     bevelSize: 8,
        //     bevelOffset: 0,
        //     bevelSegments: 5
        // })
        // let mesh = new THREE.Mesh( textgeometry, textMaterial)

        // mesh.rotation.x = Math.PI / 2
        // mesh.position.set(0, 3, 0)
        // this.scene.add(mesh)


        // cb()
    }


}
export default Text3D