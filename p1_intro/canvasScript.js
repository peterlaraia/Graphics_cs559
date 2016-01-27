window.onload = function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	context.translate(250,250);

	//drawCircle(context);
	drawPicture(context);
	
};

function drawPicture(context){
	var radius = 100;
	var x = 0;
	var y = 0;
	var xLen = 130;
	var yLen = 50;
	context.beginPath();
	context.lineWidth=10;
	context.arc(x, y, radius, 0, 2*Math.PI);
	context.stroke();
	context.closePath();

	y -= (radius);
	context.beginPath();
	context.strokeStyle="FF0000";
	context.moveTo(x, y);
	x += xLen;
	y += yLen;
	context.lineTo(x, y);
	context.stroke();
	context.closePath();

	y += (2*radius);
	//context.moveTo(x, y);

	context.beginPath();
	context.moveTo(x, y);
	x -= xLen;
	y -= yLen;
	context.lineTo(x, y);
	context.strokeStyle="00FF00"
	context.stroke();
	context.closePath();

	x += xLen;
	y += (yLen - radius);

	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI);
	context.stroke();
	context.closePath();
}

/*
function drawCircle(context){
	context.beginPath();
	context.lineWidth=8;
	context.arc(0, 0, 100, 0, 2*Math.PI);
	context.stroke();
	context.closePath();
}
*/
