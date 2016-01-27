window.onload = function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	context.translate(350,350);

	context.beginPath();
	context.lineWidth=8;
	context.arc(0, 0, 100, 0, 2*Math.PI);
	context.stroke();
	context.closePath();
};
