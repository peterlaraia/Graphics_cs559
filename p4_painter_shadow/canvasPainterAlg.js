function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var m4 = twgl.m4;
  
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
	var xAxis = [30, 0, 0];
	var yAxis = [0, 30, 0];
	var zAxis = [0, 0, 30];
	
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
  
  function drawTriangle(vtx1, vtx2, vtx3, Tx) {
	  context.beginPath();
	  moveToTx(vtx1, Tx); lineToTx(vtx2, Tx); lineToTx(vtx3, Tx); lineToTx(vtx1, Tx);
	  context.stroke(); context.closePath();
  }

  function draw() {
    // hack to clear the canvas fast
    canvas.width = canvas.width;
    
    var angleX = sliderX.value*0.01*Math.PI;
    var angleY = sliderY.value*0.01*Math.PI;
    
    
    //model transformation for 2nd pyramid
    var mirror = [-1, -2, -1];
    var Tpyramid2 = m4.scaling(mirror);
    
    //need to determine where to place the eye
    //angle X helps us turn around the target (left -> right & right -> left), 
    //angleY helps us move the eye up and down (birds eye view -> horizon view -> view from down under)
    //imagine the eye can rotate around the edge of a viewing sphere surrounding the scene with radius 300
    var eyeZ = 600*Math.cos(angleX);
    var baseZ = 600*Math.sin(angleX);
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
    var Tmp2 = m4.multiply(Tpyramid2, Tcpv);
    
    drawAxes(Tcpv);
    drawPyramid('rgb(0, 0, 0', Tcpv);
    //drawPyramid('rgb(0, 0, 0', Tmp2);
    
    
    
  }

  sliderX.addEventListener("input",draw);
  sliderY.addEventListener("input",draw);
  zoom.addEventListener("input", draw);
  perspToggle.addEventListener("CheckboxStateChange", draw);
  draw();

}
window.onload = setup;
