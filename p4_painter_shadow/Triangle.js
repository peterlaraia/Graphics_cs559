var Triangle = function(v1, v2, v3){
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;
	this.centroid = [(v1[0] + v2[0] + v3[0])/3, 
	                 (v1[1] + v2[1] + v3[1])/3, 
	                 (v1[2] + v2[2] + v3[2])/3];
};

Triangle.prototype.toString = function() {
	console.log(this.v1[0] + ", " + this.v1[1] + ", " + this.v1[2]);
	console.log(this.v2[0] + ", " + this.v2[1] + ", " + this.v2[2]);
	console.log(this.v3[0] + ", " + this.v3[1] + ", " + this.v3[2]);
	console.log(" ");
};

Triangle.prototype.draw = function(context) {
	context.beginPath();
	context.moveTo(this.v1[0], this.v1[1]); context.lineTo(this.v2[0], this.v2[1]); context.lineTo(this.v3[0], this.v3[1]);
	context.lineTo(this.v1[0], this.v1[1]);
	/*context.closePath();
	context.fill();*/
	context.stroke();
}