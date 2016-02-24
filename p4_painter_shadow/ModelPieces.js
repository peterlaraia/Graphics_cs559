var ModelPieces = function(triangles, light) {
	this.triangles = triangles;
	this.light = light;
	
	this.drawPainter = function(context){
		var normals = document.getElementById('normalToggle');
		this.triangles.sort(
				function(a, b) {
					return a.centroid[2] < b.centroid[2];
				});
		
		for(var i = 0; i < this.triangles.length; i++){
			var tri = this.triangles[i];
			var n = tri.getNormal();
			//tri.toString();
			//console.log(tri.centroid[2]);
			
			tri.shade(n, this.light);
			if(normals.checked){
				tri.drawNormal(n, context);
			}
			tri.draw(context);
		}
	};
};

