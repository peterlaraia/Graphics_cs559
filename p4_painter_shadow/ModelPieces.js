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
			/*tri.v1 = twgl.m4.transformPoint(this.cpvTx, tri.v1);
			tri.v2 = twgl.m4.transformPoint(this.cpvTx, tri.v2);
			tri.v3 = twgl.m4.transformPoint(this.cpvTx, tri.v3);*/
			//var n = tri.getNormal();
			//tri.toString();
			//console.log(tri.centroid[2]);
			
			tri.shade(tri.normal, this.light);
			if(normals.checked){
				tri.drawNormal(tri.normal, context);
			}
			tri.draw(context);
		}
	};
};

