function setup() { "use strict";
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var m4 = twgl.m4;
var spinBy = 60;
var spinR = 400;
var fishTriangles = [];

var sliderX = document.getElementById('leftright');
sliderX.value = 0;
var sliderY = document.getElementById('updown');
sliderY.value = 0;
var perspToggle = document.getElementById('projToggle');
var zoom = document.getElementById('zoom');
zoom.value = (zoom.max/2 + zoom.min/2);

function moveToTx(vtx,Tx) {
	if(vtx.length == 3){
		var locTx = m4.transformPoint(Tx,vtx);
		context.moveTo(locTx[0],locTx[1]);
	}

}

function lineToTx(vtx,Tx) {
	if(vtx.length == 3){
		var locTx = m4.transformPoint(Tx,vtx);
		context.lineTo(locTx[0],locTx[1]);
	}

}

/**
 * draw a set of axis indicating origin & base vectors of world
 */
function drawAxes(Tx) {
	// A little cross on the front face, for identification
	var red = 'rgb(255, 0, 0)';
	var green = 'rgb(0, 255, 0)';
	var blue = 'rgb(0, 0, 255)';
	var origin = [0, 0, 0];
	var xAxis = [100, 0, 0];
	var yAxis = [0, 100, 0];
	var zAxis = [0, 0, 100];

	//context.save();
	context.beginPath();
	moveToTx(origin,Tx);lineToTx(xAxis,Tx);context.strokeStyle=red;context.stroke(); context.closePath();
	context.beginPath();
	moveToTx(origin,Tx);lineToTx(yAxis,Tx);context.strokeStyle=green;context.stroke(); context.closePath();
	context.beginPath();
	moveToTx(origin,Tx);lineToTx(zAxis,Tx);context.strokeStyle=blue;context.stroke(); context.closePath();
	//context.restore();
}

/**
 * draw a pyramid with base square having width == 100, height of 100, and closest corner to origin is 
 * 100, 100, 100
 */
function drawPyramid(xCol, Tx) {
	//context.save();
	context.strokeStyle = xCol;

	var corner1 = [-50, -50, -50];
	var corner2 = [50, -50, -50];
	var corner3 = [50, -50, 50];
	var corner4 = [-50, -50, 50];
	var peak    = [0, 150, 0];

	//draw base
	drawTriangle(corner1, corner2, corner3, Tx);
	drawTriangle(corner1, corner4, corner3, Tx);

	//draw lines to top
	drawTriangle(corner1, corner2, peak, Tx);
	drawTriangle(corner2, corner3, peak, Tx);
	drawTriangle(corner3, corner4, peak, Tx);
	drawTriangle(corner4, corner1, peak, Tx);

	//context.restore();
}

function drawFullFish(Tx){

	var mirrorY = [1, -1, 1];
	var mirrorZ = [1, 1, -1];
	var mirrorYZ = [1, -1, -1];
	var Tfishbot = m4.scaling(mirrorY);
	var Tfishtopm = m4.scaling(mirrorZ);
	var Tfishbotm = m4.scaling(mirrorYZ);

	var Tmf2 = m4.multiply(Tfishbot, Tx);
	var Tmf3 = m4.multiply(Tfishtopm, Tx);
	var Tmf4 = m4.multiply(Tfishbotm, Tx);

	drawFishQuarter(Tx);
	drawFishQuarter(Tmf2);
	drawFishQuarter(Tmf3);
	drawFishQuarter(Tmf4);
}

function setupFish(){
	var fullWidth = 50;

	var v1 = [0, 0, fullWidth];
	var v2 = [280, 0, 0];
	var v3 = [0, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [330, 30, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [90, 70, fullWidth*.3];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [280, 70, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [110, 110, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [-10, 110, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [-110, 70, fullWidth*.3];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [-150, 110, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [-320, 70, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [-290, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [0, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [90, 70, fullWidth*.3];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [-175, 0, fullWidth]
	v1 = [0, 0, fullWidth];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [-290, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [-430, 0, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [-400, 50, fullWidth*.4];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [-320, 70, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [-470, 110, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [-430, 0, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	/*for(var i = 0; i < fishTriangles.length; i++){
		fishTriangles[i].toString();
	}*/
}

function drawFishQuarter(Tx){
	//transform points
	var txPoints = [];
	for(var i = 0; i < fishTriangles.length; i++){
		txPoints.push(new Triangle(
				m4.transformPoint(Tx, fishTriangles[i].v1),
				m4.transformPoint(Tx, fishTriangles[i].v2),
				m4.transformPoint(Tx, fishTriangles[i].v3)
		));
	}

	for(var j = 0; j < txPoints.length; j++){
		txPoints[j].draw(context);
	}
}



function draw() {
	// hack to clear the canvas fast
	canvas.width = canvas.width;

	var angleX = sliderX.value*0.01*Math.PI;
	var angleY = sliderY.value*0.01*Math.PI;
	var angleSpin = spinBy*0.01*Math.PI;

	var Tspin = m4.multiply(m4.translation([0, 0, spinR]), m4.axisRotation([0, 1, 0], angleSpin));

	//model transformation for 2nd pyramid


	/*var eyeX = 800*Math.cos(angleX);
     var eyeY = sliderY.value;
     var eyeZ = 800*Math.sin(angleX);*/

	//need to determine where to place the eye
	//angle X helps us turn around the target (left -> right & right -> left), 
	//angleY helps us move the eye up and down (birds eye view -> horizon view -> view from down under)
	//imagine the eye can rotate around the edge of a viewing sphere surrounding the scene with radius 300
	var eyeZ = 800*Math.cos(angleX);
	var baseZ = 800*Math.sin(angleX);
	var baseR = Math.sqrt((eyeZ*eyeZ) + (baseZ*baseZ));

	var eyeY = baseR*Math.sin(angleY);
	var lowR = baseR*Math.cos(angleY);
	eyeZ = lowR*Math.cos(angleX);
	var eyeX = lowR*Math.sin(angleX); 

	//camera transform setup
	var eye = [eyeX, eyeY, eyeZ];
	var target = [0, 0, 0]; //center of axes
	var up = [0, 1, 0]; //y axis is up

	//camera transformation
	var Tc = m4.inverse(m4.lookAt(eye, target, up));

	//projection transformation
	//var Tp = m4.ortho(-100, 100, -100, 100, -2, 2);
	//var Tp = m4.perspective(Math.PI/2, 1, 100, 900);
	var Tp;
	if(perspToggle.checked){
		var divideBy = zoom.value/100;
		Tp = m4.perspective(Math.PI/divideBy, 1, 100, 900);
	} else {
		var inv = (zoom.max - (zoom.value - zoom.min));
		var half = inv/2;
		Tp = m4.ortho(-1*half, half, -1*half, half, -2, 2);
	}

	//setup viewport transformation
	var scale = m4.scaling([100, -100, 100]);
	var trans = m4.translation([300, 300, 0]);
	var Tv = m4.multiply(scale, trans);

	var Tcpv = m4.multiply(m4.multiply(Tc, Tp), Tv);

	var Tmcpv = m4.multiply(Tspin, Tcpv);

	drawAxes(Tcpv);
	//drawPyramid('rgb(0, 0, 0', Tcpv);
	drawFullFish(Tmcpv);
	//drawPyramid('rgb(0, 0, 0', Tmp2);
	spinBy = (spinBy + 1) % 200;
	//console.log(spinBy);
	window.requestAnimationFrame(draw);
}

/*sliderX.addEventListener("input",draw);
  sliderY.addEventListener("input",draw);
  zoom.addEventListener("input", draw);
  perspToggle.addEventListener("CheckboxStateChange", draw);*/
//draw();
setupFish();
window.requestAnimationFrame(draw);

};
window.onload = setup;
