/*var Triangle = function(v1, v2, v3){
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;
	this.centroid = [(v1[0] + v2[0] + v3[0])/3, 
	                 (v1[1] + v2[1] + v3[1])/3, 
	                 (v1[2] + v2[2] + v3[2])/3];
	this.color = [0, 0, 0];
};*/

var Triangle = function(v1, v2, v3, color){
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;
	this.centroid = [(v1[0] + v2[0] + v3[0])/3, 
	                 (v1[1] + v2[1] + v3[1])/3, 
	                 (v1[2] + v2[2] + v3[2])/3];
	this.color = color;
	
};

Triangle.prototype.switchV = function(){
	var tmp = this.v1;
	this.v1 = this.v3;
	this.v3 = tmp;
};

Triangle.prototype.colorStr = function(){
	return "rgb(" + Math.floor(this.color[0]) + ", " + Math.floor(this.color[1]) + ", " + Math.floor(this.color[2]) + ")";
};

Triangle.prototype.getNormal = function() {
	var u = [this.v1[0] - this.v2[0], this.v1[1] - this.v2[1], this.v1[2] - this.v2[2]];
	var w = [this.v3[0] - this.v2[0], this.v3[1] - this.v2[1], this.v3[2] - this.v2[2]];
	return twgl.v3.normalize(twgl.v3.cross(u, w));
	
};

Triangle.prototype.shade = function(normal, light) {
	//var shader = (.5 + .5*(twgl.v3.dot(normal, light)));
	var shader = .5 + Math.abs(twgl.v3.dot(normal, light));
	//var shader = .5 + twgl.v3.dot(normal, light);
	this.color[0] *= shader;
	this.color[1] *= shader;
	this.color[2] *= shader;
};

Triangle.prototype.toString = function() {
	console.log(this.v1[0] + ", " + this.v1[1] + ", " + this.v1[2]);
	console.log(this.v2[0] + ", " + this.v2[1] + ", " + this.v2[2]);
	console.log(this.v3[0] + ", " + this.v3[1] + ", " + this.v3[2]);
	console.log(" ");
};

Triangle.prototype.drawNormal = function(normal, context){
	normal = twgl.v3.mulScalar(normal, 20);
	context.strokeStyle = 'rgb(255, 0, 0)';
	context.beginPath();
	context.moveTo(this.centroid[0], this.centroid[1]);
	context.lineTo(this.centroid[0] + normal[0], this.centroid[1] + normal[1]);
	context.closePath();
	context.stroke();
}

Triangle.prototype.draw = function(context) {
	context.fillStyle = this.colorStr();
	//context.strokeStyle = this.colorStr();
	context.beginPath();
	context.moveTo(this.v1[0], this.v1[1]); context.lineTo(this.v2[0], this.v2[1]); context.lineTo(this.v3[0], this.v3[1]);
	context.lineTo(this.v1[0], this.v1[1]);
	context.closePath();
	context.fill();
	//context.stroke();
};