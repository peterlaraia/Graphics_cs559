window.onload = function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	context.translate(250,250);

	//drawBackCircle(context);

	drawPicture(context, 0, canvas)
	//drawPicture(context, 0);
	
};

/*
 * draw a cylinder with red and green lines connecting the circles
 */
function drawPicture(context, angle, canvas){
	var radius = 100;
	var x = 0;
	var y = 0;
	var xLen = 130;
	var yLen = 50;
	var radians = toRads(angle);

	//Pulled this redraw code from:
	//http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.beginPath();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();

	//draw back circle
	context.beginPath();
	context.lineWidth=10;
	context.arc(x, y, radius, 0, 2*Math.PI);
	//context.fillStyle='#6e6e6e';
	context.fillStyle='rgb(110, 110, 110)'
	context.fill();
	context.strokeStyle='rgb(0, 0, 0)';
	context.stroke();

	//draw red line
	//(move from center of back circle [origin] to 
	//side of circle.based on angle, where angle 0
	//would indicate going straight down

	x += calcX(radius, radians);
	y += calcY(radius, radians);
	context.lineWidth=8;
	context.beginPath();
	context.moveTo(x, y);
	x += xLen;
	y += yLen;
	context.lineTo(x, y);
	context.strokeStyle='rgb(255, 0, 0)';
	context.stroke();

	//Draw Green Line opposite of red line
	x -= 2*calcX(radius, radians);
	y -= 2*calcY(radius, radians);

	context.beginPath();
	context.moveTo(x, y);
	x -= xLen;
	y -= yLen;
	context.lineTo(x, y);
	context.strokeStyle='rgb(0, 255, 0)';
	context.stroke();

	//Draw front circle
	x += xLen + calcX(radius, radians);
	y += (yLen) + calcY(radius, radians);

	context.lineWidth=10;
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI);
	context.fillStyle='rgba(110, 110, 110, 0.4';
	context.fill();
	context.strokeStyle='rgb(0, 0, 0)';
	context.stroke();


	angle += 2;
	if(angle > 360) angle %= 360;
	setTimeout(drawPicture, 50, context, angle, canvas);
}

//y = rcos(t)
function calcY(r, rads){
	return r*Math.cos(rads);
}

//x=rsin(t)
function calcX(r, rads){
	return r*Math.sin(rads);
}

function toRads(angle){
	return angle*(Math.PI/180)
}
