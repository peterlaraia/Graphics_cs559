window.onload = function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	drawPicture(context);
};



function Limb(w, h, col){
	this.width = w;
	this.height = h;
	this.color = col;
	this.theta = 0;
}

function Limb(w, h, col, angle){
	this.width = w;
	this.height = h;
	this.color = col;
	this.theta = angle;
}

function Table(w, h, col){
	this.width = w;
	this.height = h;
	this.color = col;
}

function Head(x, y, r){
	this.x = x;
	this.y = y;
	this.r = r;
}

function Person(x, y){
	this.head = new Head(x, y, 20);
}

function drawTable(table, context){

	context.beginPath()
	context.rect(0, 0, table.width, table.height);
	context.fillStyle = table.color;
	context.fill();

}

function drawLimb(leg, context){
	
	context.beginPath();
	context.rect(0, 0, leg.width, leg.height);
	context.fillStyle = leg.color;
	context.fill();

}

function drawPicture(context){
	pptable = new Table(400, 20, 'rgb(25, 25, 25)');
	leg1 = new Limb(10, 100, 'rgb(0, 0, 0)');
	leg2 = new Limb(10, 100, 'rgb(0, 0, 0)');
	net = new Limb(8, 17, 'rgba(25, 25, 25, 0.4)')


	context.save();
	context.translate(250, 400);
	drawTable(pptable, context);
	context.save();
	
	context.translate(0, pptable.height);
	drawLimb(leg1, context);

	context.translate(pptable.width - leg1.width, 0);
	drawLimb(leg2, context);

	context.restore();
	context.translate((pptable.width/2 - net.width/2), -net.height);
	drawLimb(net, context);
}
