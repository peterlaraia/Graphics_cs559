var ModelPieces = function(triangles) {
	this.triangles = triangles;
}

ModelPieces.prototype.drawPainter = function(context){
	this.triangles.sort(
			function(a, b) {
				return a.centroid[2] > b.centroid[2];
			});
	
	for(var i = 0; i < this.triangles.length; i++){
		this.triangles[i].draw(context);
	}
}