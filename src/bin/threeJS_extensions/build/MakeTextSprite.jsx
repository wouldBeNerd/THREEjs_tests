import * as THREE from 'three';

function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

/**render sprite like numbers on screen
 * 
 * @param {string} message 
 * @param {{fontsize:number, fontface:string, border:boolean borderThickness:number, textColor:{r:number, g:number, b:number, a:number }, borderColor:{r:number, g:number, b:number, a:number }, backgroundColor:{r:number, g:number, b:number, a:number }}} opts 
 */

function MakeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 50;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 0;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:255, b:0, a:0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:0, g:0, b:0, a:0 };
	// var spriteAlignment = THREE.SpriteAlignment.topLeft;
		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";
	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + ","
                                + textColor.b + "," + textColor.a + ")";
	context.fillText( message, borderThickness, fontsize + borderThickness);
    // context.width = textWidth + borderThickness
    // context.height = fontsize * 1.4 + borderThickness
    // canvas.width = (textWidth + borderThickness) * 1.1
    // canvas.height = (fontsize * 1.4 + borderThickness) * 1.1
    // context.top = 0
    // context.left = 0

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture } );
	var sprite = new THREE.Sprite( spriteMaterial );
    // sprite.scale.set(  textWidth + borderThickness ,  fontsize * 1.4 + borderThickness , 0.1);
    // sprite.center = new THREE.Vector2( 0, 1)
    console.log(  textWidth + borderThickness  ,  fontsize * 1.4 + borderThickness  )
	return sprite;	
}
export default MakeTextSprite