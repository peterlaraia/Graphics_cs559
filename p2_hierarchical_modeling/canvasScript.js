window.onload = function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	pptable = new Table(400, 20, 'rgb(25, 25, 25)');
	leg1 = new Limb(10, 100, 'rgb(0, 0, 0)');
	leg2 = new Limb(10, 100, 'rgb(0, 0, 0)');
	net = new Limb(8, 17, 'rgba(25, 25, 25, 0.4)')

	pptable = new PingPongTable(pptable, leg1, leg2, net);
	ball = new Ball(0, 0, 6, 29.5, -35, 'rgb(0, 220, 220)');

	drawPicture(context, canvas, -30, -25, 30, -15, 3, pptable, ball, 0);
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

function Head(r){
	this.r = r;
}

function Ball(x, y, r, xVel, y0Vel, color){
	this.x = x;
	this.y = y;
	this.r = r;
	this.xVel = xVel;
	this.y0Vel = y0Vel;
	this.color = color;
}

/*
* theta0 rotate left upper arm
* theta1 rotate left lower arm
*/
function Person(theta0, theta1){
	this.head = new Head(20);
	this.body = new Limb(5, 100, 'rgb(0, 0, 0');
	this.lLeg = new Limb(5, 70, 'rgb(0, 0, 0)', 20);
	this.rLeg = new Limb(5, 70, 'rgb(0, 0, 0)', -20);
	this.luArm = new Limb(5, 30, 'rgb(255, 0, 0)', theta0);
	this.lfArm = new Limb(5, 25, 'rgb(255, 0, 0)', theta1);
	this.rArm = new Limb(5, 53, 'rgb(0, 0, 0)', -20);

}

function PingPongTable(table, leg1, leg2, net){
	this.table = table;
	this.leg1 = leg1;
	this.leg2 = leg2;
	this.net = net;
}

function drawBall(ball, context){
	context.beginPath();
	context.arc(0, 0, ball.r, 0, 2*Math.PI);
	context.fillStyle = ball.color;
	context.fill();
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

function drawFullPingPongTable(pptable, context){
	


	context.save(); //origin save
	context.translate(250, 400);
	drawTable(pptable.table, context);
	context.save(); //table nw save
	
	context.translate(0, pptable.table.height);
	drawLimb(pptable.leg1, context);

	context.translate(pptable.table.width - pptable.leg1.width, 0);
	drawLimb(pptable.leg2, context);

	context.restore(); //table nw ret
	context.translate((pptable.table.width/2 - pptable.net.width/2), -pptable.net.height);
	drawLimb(pptable.net, context);

	context.restore(); //origin ret

}

function drawLeftPerson(context, luTheta, lfTheta){
	person = new Person(luTheta, lfTheta);
	
	//draw the head
	context.save(); //origin save
	context.translate(125, 325);
	context.beginPath();
	context.arc(0, 0, person.head.r, 0, 2*Math.PI);
	context.lineWidth=5;
	context.stroke();

	//draw body
	context.translate(0, person.head.r);
	drawLimb(person.body, context);

	//draw right 
	context.translate(0, person.head.r);
	context.save();//save chest

	context.rotate(a2r(person.rArm.theta));
	drawLimb(person.rArm, context);

	context.restore(); //chest ret
	context.save(); //save chest
	context.rotate(a2r(person.luArm.theta));
	drawLimb(person.luArm, context);

	context.translate(0, person.luArm.height);
	context.rotate(a2r(person.lfArm.theta));
	drawLimb(person.lfArm, context);

	context.restore(); //restore chest
	context.translate(0, person.body.height - person.head.r);
	context.save(); //save pelvis

	context.rotate(a2r(person.rLeg.theta));
	drawLimb(person.rLeg, context);
	context.restore(); //restore pelvis
	
	context.rotate(a2r(person.lLeg.theta));
	drawLimb(person.lLeg, context);
	context.restore();
}

function drawPicture(context, canvas, p1Upper, p1Fore, p2Upper, p2Fore, angleVel, pptable, ball, timer){
	//clear board then redraw for animation
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.beginPath();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();

	ball.y = ball.y0Vel * timer  + (4.9*timer*timer);

	//If the ball hits the table 
	if(ball.y + ball.r > 7 /*&& (ball.x > (250 -165) && ball.x < (250-165 + 400))*/){
		timer = 0;
		if((ball.xVel > 0 && ball.x > (250 - 165) + pptable.table.width/2) || (ball.xVel < 0 && ball.x < (250 - 165) + pptable.table.width/2)){ //halfway across table
			ball.y0Vel = -22;
			ball.xVel *= .8;
			ball.y = ball.y0Vel * timer  + (4.9*timer*timer);
		} else ball.y = 0;
		//ball.y = 0;
		//timer = 0;
	}

	//if the ball reaches either player
	if(ball.x < 0 || ball.x > ((250-165)*2 + pptable.table.width) ) {
		ball.x -= ball.xVel;
		angleVel *= -1;
		timer = 0;
		ball.y0Vel = -35;
		ball.xVel = 29.5;
		if(angleVel < 0){
			ball.xVel *= -1;
		}
	}

	
	//-30.20
	//-25.-15
	drawFullPingPongTable(pptable, context);
	drawLeftPerson(context, p1Upper, p1Fore);

	context.save(); //save origin
	
	context.translate(canvas.width,0);
	context.scale(-1, 1);
	drawLeftPerson(context, p2Upper, p2Fore);
	context.restore(); //origin ret

	context.save();//save origin
	context.translate(165, 395);
	context.translate(ball.x, ball.y);
	drawBall(ball, context);
	context.restore();//origin ret
	
	ball.x += ball.xVel;

	setTimeout(drawPicture, 40, context, canvas, p1Upper + angleVel, p1Fore + (angleVel/2),
			p2Upper - angleVel, p2Fore -(angleVel/2), angleVel, pptable, ball, timer + 1);
}

function a2r(angle){
	return angle * (Math.PI/180);
}
