//INITIAL VALUES
const _P1_BICEP_ANGLE = -30;
const _P1_FOREARM_ANGLE=-25;
const _P2_BICEP_ANGLE = 35;
const _P2_FOREARM_ANGLE = -10;

const _PERSON_X = 125;
const _PERSON_Y = 325;
const _TABLE_X = 250;
const _TABLE_Y = 400;

const _BALL_X = 165;
const _BALL_X_VEL = 29.5;
const _BALL_X_VEL_MODIFIER = .8;
const _BALL_Y_VEL = -35;
const _BALL_Y_VEL_SUB = -22;

const _ANGLE_VEL = 3;


window.onload = function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

	//Pieces for the table
	pptable = new Table(400, 20, 'rgb(25, 25, 25)');
	leg1 = new Limb(10, 100, 'rgb(0, 0, 0)');
	leg2 = new Limb(10, 100, 'rgb(0, 0, 0)');
	net = new Limb(8, 17, 'rgba(25, 25, 25, 0.4)');

	//Ping Pong Table
	pptable = new PingPongTable(pptable, leg1, leg2, net);
	ball = new Ball(0, 0, 6, _BALL_X_VEL, _BALL_Y_VEL, 'rgb(0, 220, 220)');

	//2 Players on either side of the table, with initial values for their hitting hand
	person1 = new Person(_P1_BICEP_ANGLE, _P1_FOREARM_ANGLE);
	person2 = new Person(_P2_BICEP_ANGLE, _P2_FOREARM_ANGLE);

	

	drawPicture(context, canvas, person1, person2, _ANGLE_VEL, pptable, ball, 0);
};

/*
 * ################## CLASSES #########################
 */

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

/*
 * ################## DRAW FUNCTIONS #########################
 */

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
	//table translated to top left of table (where table is drawn)
	context.translate(_TABLE_X, _TABLE_Y);
	drawTable(pptable.table, context);
	context.save(); //table nw save
	
	//Draw left table leg, translate to bottom left of table
	context.translate(0, pptable.table.height);
	drawLimb(pptable.leg1, context);

	//Draw right table leg, translate to bottom right of table (minus leg width)
	context.translate(pptable.table.width - pptable.leg1.width, 0);
	drawLimb(pptable.leg2, context);

	//draw net
	context.restore(); //table nw ret
	context.translate((pptable.table.width/2 - pptable.net.width/2), -pptable.net.height);
	drawLimb(pptable.net, context);

	//restore to canvas origin
	context.restore(); //origin ret

}

//function drawLeftPerson(context, luTheta, lfTheta){
function drawPerson(context, person){
	//person = new Person(luTheta, lfTheta);
	
	//draw the head
	context.save(); //origin save
	context.translate(_PERSON_X, _PERSON_Y);
	context.beginPath();
	context.arc(0, 0, person.head.r, 0, 2*Math.PI);
	context.lineWidth=5;
	context.stroke();

	//draw body
	context.translate(0, person.head.r);
	drawLimb(person.body, context);

	//draw right arm
	context.translate(0, person.head.r);
	context.save();//save chest

	/*
	 * This is the piece where the Person objects Upper Arm (luArm) & Forearm (lfArm)
	 * rotate relative to each other
	 */
	context.rotate(a2r(person.rArm.theta));
	drawLimb(person.rArm, context);

	//Upper Arm
	context.restore(); //chest ret
	context.save(); //save chest
	context.rotate(a2r(person.luArm.theta));
	drawLimb(person.luArm, context);

	//Forearm
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

function drawPicture(context, canvas, person1, person2, angleVel, pptable, ball, timer){
	//clear board then redraw for animation
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.beginPath();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();

	//calculate y velocity
	ball.y = ball.y0Vel * timer  + (4.9*timer*timer);

	//If the ball hits the table 
	if(ball.y + ball.r > 7 /*&& (ball.x > (250 -165) && ball.x < (250-165 + 400))*/){
		timer = 0; //reset timer for y vel
		if((ball.xVel > 0 && ball.x > (_TABLE_X - _BALL_X) + pptable.table.width/2) || 
				(ball.xVel < 0 && ball.x < (_TABLE_X - _BALL_X) + pptable.table.width/2)){ //halfway across table
			ball.y0Vel = _BALL_Y_VEL_SUB;//smaller bounce 
			ball.xVel *= _BALL_X_VEL_MODIFIER; //slow down
			ball.y = ball.y0Vel * timer  + (4.9*timer*timer);
		} else ball.y = 0;
	}

	//if the ball reaches either player
	if(ball.x < 0 || ball.x > ((_TABLE_X-_BALL_X)*2 + pptable.table.width) ) {
		ball.x -= ball.xVel; //undo x movement past artificial bounds
		angleVel *= -1; //reverse direction
		timer = 0;
		ball.y0Vel = _BALL_Y_VEL; //back to init y
		ball.xVel = _BALL_X_VEL; //back to init x
		if(angleVel < 0){
			ball.xVel *= -1; 
		}
	}

	//draw table
	drawFullPingPongTable(pptable, context);

	//draw person left of table
	drawPerson(context, person1);

	context.save(); //save origin
	
	//draw person on right of table by translating to other side of canvas (width across)
	//then scale x*-1 to mirror the image
	context.translate(canvas.width,0);
	context.scale(-1, 1);
	drawPerson(context, person2);
	context.restore(); //origin ret

	context.save();//save origin
	context.translate(_BALL_X, 395);
	context.translate(ball.x, ball.y);
	drawBall(ball, context);
	context.restore();//origin ret
	
	ball.x += ball.xVel;
	//Rotate upper arm at angleVel, rotate the forearm at only half of angleVel
	person1.luArm.theta += angleVel;
	person1.lfArm.theta += (angleVel*.5);
	person2.luArm.theta -= angleVel;
	person2.lfArm.theta -= (angleVel*.5);

	setTimeout(drawPicture, 40, context, canvas, person1, person2, angleVel, pptable, ball, timer + 1);
}

function a2r(angle){
	return angle * (Math.PI/180);
}
