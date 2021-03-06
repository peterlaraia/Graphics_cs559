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
sliderY.value = 10;
var perspToggle = document.getElementById('projToggle');
var zoom = document.getElementById('zoom');
zoom.value = (zoom.max/2 + zoom.min/2) - 200;


/**
 * draw a pyramid with base square having width == 100, height of 100, and closest corner to origin is 
 * 100, 100, 100
 */
function setupPyramid() {

	var sz = 100;
	var corner1 = [-sz, -sz, -sz];
	var corner2 = [sz, -sz, -sz];
	var corner3 = [sz, -sz, sz];
	var corner4 = [-sz, -sz, sz];
	var peak    = [0, 3*sz, 0];
	var tri = [];
	//draw base
	tri.push(new Triangle(corner1, corner2, corner3));
	tri.push(new Triangle(corner1, corner4, corner3));

	//draw lines to top
	tri.push(new Triangle(corner1, corner2, peak));
	tri.push(new Triangle(corner2, corner3, peak));
	tri.push(new Triangle(corner3, corner4, peak));
	tri.push(new Triangle(corner4, corner1, peak));

	return tri;
	//context.restore();
}

function getTxPyramid(Txm, Txc){
	var pyr = setupPyramid();
	var txPyr = [];
	var color = [105, 105, 105];
	for(var i = 0; i < pyr.length; i++){
		var tri = new Triangle(m4.transformPoint(Txm, pyr[i].v1),
				m4.transformPoint(Txm, pyr[i].v2),
				m4.transformPoint(Txm, pyr[i].v3),
				color
		);
		tri.normal = tri.getNormal();
		
		tri.v1 = m4.transformPoint(Txc, tri.v1);
		tri.v2 = m4.transformPoint(Txc, tri.v2);
		tri.v3 = m4.transformPoint(Txc, tri.v3);
		tri.calcCentroid();
		
		txPyr.push(tri);
	}
	return txPyr;
}

function getFullFish(Txm, Txc){

	var mirrorY = [1, -1, 1];
	var mirrorZ = [1, 1, -1];
	var mirrorYZ = [1, -1, -1];
	var Tfishbot = m4.scaling(mirrorY);
	var Tfishtopm = m4.scaling(mirrorZ);
	var Tfishbotm = m4.scaling(mirrorYZ);

	var Tmf2 = m4.multiply(Tfishbot, Txm);
	var Tmf3 = m4.multiply(Tfishtopm, Txm);
	var Tmf4 = m4.multiply(Tfishbotm, Txm);

	var fish = txFishQuarter(Txm, Txc, false).concat(
			txFishQuarter(Tmf2, Txc, true), 
			txFishQuarter(Tmf3, Txc, true), 
			txFishQuarter(Tmf4, Txc, false));
	return fish;
}

function setupFishQuarter(){
	var fullWidth = 80;

	var v1 = [0, 0, fullWidth];
	var v2 = [280, 0, 0];
	var v3 = [0, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v1 = [330, 30, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [90, 70, fullWidth*.5];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v3 = [280, 70, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [110, 110, 0];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v3 = [-10, 110, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [-110, 70, fullWidth*.5];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v2 = [-150, 110, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [-320, 70, 0];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v2 = [-290, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v3 = [0, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v2 = [90, 70, fullWidth*.5];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [-175, 0, fullWidth]
	v1 = [0, 0, fullWidth];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [-290, 30, fullWidth*.6];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v3 = [-430, 0, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v2 = [-400, 50, fullWidth*.4];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v3 = [-320, 70, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));

	v1 = [-470, 110, 0];
	fishTriangles.push(new Triangle(v3, v2, v1));

	v3 = [-430, 0, 0];
	fishTriangles.push(new Triangle(v1, v2, v3));
}

function txFishQuarter(Txm, Txc, switchV){
	//transform points
	var txPoints = [];
	var color = [0, 155, 155];
	for(var i = 0; i < fishTriangles.length; i++){
		var tri = new Triangle(
				m4.transformPoint(Txm, fishTriangles[i].v1),
				m4.transformPoint(Txm, fishTriangles[i].v2),
				m4.transformPoint(Txm, fishTriangles[i].v3),
				color
		);
		if(switchV){
			tri.switchV();
		}
		tri.normal = tri.getNormal();
		
		tri.v1 = m4.transformPoint(Txc, tri.v1);
		tri.v2 = m4.transformPoint(Txc, tri.v2);
		tri.v3 = m4.transformPoint(Txc, tri.v3);
		tri.calcCentroid();
		
		txPoints.push(tri);
	}

	return txPoints;
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
		//half = 300;
		Tp = m4.ortho(-1*half, half, -1*half, half, -1*half, 1*half);
	}

	//setup viewport transformation
	var scale = m4.scaling([100, -100, 100]);
	var trans = m4.translation([300, 300, 0]);
	var Tv = m4.multiply(scale, trans);

	var Tcpv = m4.multiply(m4.multiply(Tc, Tp), Tv);

	var Tmcpv = m4.multiply(Tspin, Tcpv);

	//drawAxes(Tcpv);
	//drawPyramid('rgb(0, 0, 0', Tcpv);
	var pyr = getTxPyramid(m4.identity(), Tcpv);
	var fish = getFullFish(Tspin, Tcpv);
	var light = twgl.v3.normalize([1, 3, 2]);
	//var light = twgl.v3.normalize([1, 1, 1]);
	//var light = [1, 3, 2];
	//var light = m4.transformPoint(Tcpv, twgl.v3.normalize([1, 3, 2]));
	
	var models = new ModelPieces(fish.concat(pyr), light, Tcpv);
	//var models = new ModelPieces(fish, light);
	models.drawPainter(context);
	spinBy = (spinBy + 1) % 200;
	window.requestAnimationFrame(draw);
}

/*  sliderX.addEventListener("input",draw);
  sliderY.addEventListener("input",draw);
  zoom.addEventListener("input", draw);
  perspToggle.addEventListener("CheckboxStateChange", draw);*/
//draw();
setupFishQuarter();
window.requestAnimationFrame(draw);

};
window.onload = setup;
