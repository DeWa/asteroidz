// requestAnimationFrame polyfill by Erik Moeller
var lastTime = 0;
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

var canvas = document.getElementById('mainCanvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

var cw = canvas.width,
    ch = canvas.height,
    ctx = canvas.getContext("2d"),
    fps = 60,
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    delta = 0;
    // Game objects
    var player = new Ship();
    player.input = { left: false, right: false};

function gameLoop() {
    window.requestAnimationFrame(gameLoop);

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;

    clear();
    player.draw();
    gameLogic(); 
    //console.log(player.angle);

    lastTime = currentTime;
}

init();

function init() {
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    gameLogic(); 
    gameLoop();
}

function Ship() {
    this.x = 90;
    this.y = 90;
    this.speed = 0;
    this.throttle = 0;
    this.angle = 0;
    this.vAngle = 0;
    this.vx = this.x + Math.cos(this.angle * (Math.PI/180)) * this.speed;
    this.vy = this.y - Math.sin(this.angle * (Math.PI/180)) * this.speed; 

    // Unit Circle coordinates
    this.cPoints = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    // Drawing coordinates
    this.dPoints = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    // Original object drawing
    this.origObject = [[0, 15], [45, 5], [135, 13], [180, 7], [225, 13], [315, 5]];
    // Modified object
    this.object = [[0, 15], [45, 5], [135, 13], [180, 7], [225, 13], [315, 5]];


    this.reAngle = function() {
        for(var i = 0; i < this.object.length; i++) {
            this.object[i][0] = this.origObject[i][0] + this.angle;
            if(this.object[i][0] > 360){
                this.object[i][0] = this.object[i][0] - 360;
            } else if(this.object[i][0] < 0)  {
                this.object[i][0] = 360 - this.object[i][0];
            }
        }
    };

    // Move player
    this.move = function() {
        // Add throttle to the speed
        this.speed = this.speed + this.throttle;
        if(this.speed > 10)
            this.speed = 10;
        
        // Removes throttle
        if(this.throttle > 0)
            this.throttle = this.throttle - 0.25;
        
        // Remove speed
        if(this.speed > 0)
            this.speed = this.speed - 0.005;

        this.vx = this.x + Math.cos(this.vAngle * (Math.PI/180)) * this.speed;
        this.vy = this.y - Math.sin(this.vAngle * (Math.PI/180)) * this.speed; 
        this.x = this.vx;
        this.y = this.vy;
    }

    this.calcPoints = function() {
        for(var i = 0; i < this.object.length; i++) {
            this.cPoints[i][0] = this.object[i][1] * Math.cos((this.object[i][0] * (Math.PI/180)));
            this.cPoints[i][1] = this.object[i][1] * Math.sin((this.object[i][0] * (Math.PI/180)));
        }
    };

    this.calcDrawPoints = function() {
        for(var i = 0; i < this.object.length; i++) {
            this.dPoints[i][0] = this.x + this.cPoints[i][0];
            this.dPoints[i][1] = this.y - this.cPoints[i][1];
        }
    };

    this.draw = function() {
    
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        // #1
        ctx.moveTo(this.dPoints[0][0],this.dPoints[0][1]);
        ctx.lineTo(this.dPoints[1][0],this.dPoints[1][1]);
        ctx.stroke();
        // #2
        ctx.beginPath();
        ctx.moveTo(this.dPoints[1][0],this.dPoints[1][1]);
        ctx.lineTo(this.dPoints[2][0],this.dPoints[2][1]);
        ctx.stroke();
        // #3
        ctx.beginPath();
        ctx.moveTo(this.dPoints[2][0],this.dPoints[2][1]);
        ctx.lineTo(this.dPoints[3][0],this.dPoints[3][1]);
        ctx.stroke();
        // #4
        ctx.beginPath();
        ctx.moveTo(this.dPoints[3][0],this.dPoints[3][1]);
        ctx.lineTo(this.dPoints[4][0],this.dPoints[4][1]);
        ctx.stroke();
        // #5
        ctx.beginPath();
        ctx.moveTo(this.dPoints[4][0],this.dPoints[4][1]);
        ctx.lineTo(this.dPoints[5][0],this.dPoints[5][1]);
        ctx.stroke();
        // #6
        ctx.beginPath();
        ctx.moveTo(this.dPoints[5][0],this.dPoints[5][1]);
        ctx.lineTo(this.dPoints[0][0],this.dPoints[0][1]);
        ctx.stroke();
        ctx.closePath();   
        
    };

    // TODO this sucks
    this.throttleUp = function() {
        if(player.angle > player.vAngle) {
            player.vAngle--;
        } else if(player.angle < player.vAngle) {
            player.vAngle++;
        }

        this.throttle = this.throttle + 0.5;

        if(player.throttle > 2){
            player.throttle = 2;
        }
    }
}

function clear(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLogic(){
    player.calcPoints();
    player.calcDrawPoints();
    player.move();
    boundaries(); 
}

function boundaries(){
    if(player.x > cw) {
        player.x = 0;
    } else if(player.x < 0) {
        player.x = cw;
    }

    if(player.y > ch) {
        player.y = 0;
    } else if(player.y < 0) {
        player.y = ch;
    }
}

//------------
//Key Handlers
//------------
function keyDownHandler(event)
{
    var keyPressed = String.fromCharCode(event.keyCode);
 
    if (keyPressed == "D")
    {       
        player.angle = player.angle - 3;

        if(player.angle > 360){
            player.angle = 0;
        } else if(player.angle < 0)  {
            player.angle = 360;
        }

        player.reAngle();
    }

    if (keyPressed == "W")
    {       
        player.throttleUp(); 
    }

    if (keyPressed == "S")
    {       
        player.speed = player.speed - 0.5;

        if(player.speed < 0){
            player.speed = 0;
        } 
    }

    if (keyPressed == "A")
    {       
        player.angle = player.angle + 3;

        if(player.angle > 360){
            player.angle = 0;
        } else if(player.angle < 0)  {
            player.angle = 360;
        } 

        player.reAngle();
    }
}

function keyUpHandler(event)
{
    var keyPressed = String.fromCharCode(event.keyCode);
 
  
}
