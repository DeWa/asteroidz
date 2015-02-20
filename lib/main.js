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
    player = new Ship();
    starfield = new Starfield();

/* +-+-+-++-+-+-+-+-+-+-+-+-+-GAME LOOP +-+-+-+-+-+-+-+-+-+-+-+-+-+-+- */
function gameLoop() {
    window.requestAnimationFrame(gameLoop);

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;
    clear();
    gameLogic();
    gameDraw(); 
    lastTime = currentTime;
}

init();

function init() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    gameLogic(); 
    gameLoop();
}

function Ship() {
    this.location = new Vector(90, 90);
    this.velocity = new Vector(0,0);
    this.acceleration = new Vector(0,0);
    this.drag = 0.98;
    this.turnRate = 5;
    this.mass = 10;
    this.topspeed = 5;
    this.heading = 0;
    this.angle = 0;
    this.thrusting = false;

    this.input = {left:false, right:false, up:false, down:false};

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

    this.addForce = function(force) {
        f = deepCopy(force);
        //f = force
        f.div(this.mass);
        this.acceleration.add(f);
    }

    // Thrust player
    this.thrust = function() {
        var angle = -this.heading;
        var force = new Vector(Math.cos(angle), Math.sin(angle));
        force.mult(4);
        this.addForce(force);
        this.thrusting = true;
    }

    // Turn the ship left
    this.turnLeft = function() {
        this.angle += this.turnRate;
        
        if(this.angle > 360)
            this.angle = 0;

        this.heading = this.angle * Math.PI/180;

        this.reAngle();
    }

    // Turn the ship right
    this.turnRight = function() {
        this.angle -= this.turnRate;
        
        if(this.angle < 0)
            this.angle = 360;
        this.heading = this.angle * Math.PI/180;
        
        this.reAngle();
    }

    this.move = function() {
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.drag);
        this.velocity.limit(this.topspeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
        this.thrusting = false;
        //console.log(JSON.stringify(this.acceleration));
    }

    this.calcPoints = function() {
        for(var i = 0; i < this.object.length; i++) {
            this.cPoints[i][0] = this.object[i][1] * Math.cos((this.object[i][0] * (Math.PI/180)));
            this.cPoints[i][1] = this.object[i][1] * Math.sin((this.object[i][0] * (Math.PI/180)));
        }
    };

    this.calcDrawPoints = function() {
        for(var i = 0; i < this.object.length; i++) {
            this.dPoints[i][0] = this.location.x + this.cPoints[i][0];
            this.dPoints[i][1] = this.location.y - this.cPoints[i][1];
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

}

function Starfield() {
    this.nroStars = 80;
    this.stars = [];

    this.init = function() {
        for(var i = 0; i < this.nroStars; i++) {
            var x = Math.floor((Math.random() * cw) + 1);
            var y = Math.floor((Math.random() * ch) + 1);
            var radius = Math.random() * (2 - 0.1) + 0.1;
            var speed = radius - (radius/1.3);
            this.stars.push({x: x, y: y, radius: radius, speed: speed});
        }
    }

    this.draw = function() {
        for(var i = 0; i < this.stars.length; i++) {
            ctx.beginPath();
            ctx.arc(this.stars[i].x,this.stars[i].y,this.stars[i].radius,0,2*Math.PI);
            ctx.fillStyle = '#33CCFF';
            ctx.fill();
            ctx.stroke();
            ctx.closePath(); 
        }
    }

    this.move = function() {
        for(var i = 0; i < this.stars.length; i++) {
            this.stars[i].x -= this.stars[i].speed;

            // If out of the screen
            if(this.stars[i].x < -2) {
                this.stars.splice(i, 1);
                this.newStar();
            }
        }
    }

    this.newStar = function() {
        var x = cw;
        var y = Math.floor((Math.random() * ch) + 1);
        var radius = Math.random() * (2 - 0.1) + 0.1;
        var speed = radius - (radius/1.3);
        this.stars.push({x: x, y: y, radius: radius, speed: speed});
    }

    this.init();


}

function clear(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLogic(){
    player.calcPoints();
    player.calcDrawPoints();
    getKeys();
    player.move();
    starfield.move();
    boundaries(); 
}

function getKeys() {
    if(player.input.up) {
        player.thrust();
    }

    if(player.input.left){
        player.turnLeft();
    }

    if(player.input.right){
        player.turnRight();
    }
}

function boundaries(){
    if(player.location.x > cw) {
        player.location.x = 0;
    } else if(player.location.x < 0) {
        player.location.x = cw;
    }

    if(player.location.y > ch) {
        player.location.y = 0;
    } else if(player.location.y < 0) {
        player.location.y = ch;
    }
}

function gameDraw(){
    starfield.draw();
    player.draw();
}
//------------
//Key Handlers
//------------
function onKeyDown(event) {
    event.preventDefault();
    if (event.keyCode == 39 || event.keyCode == 68) player.input.right = true;
    else if (event.keyCode == 37 || event.keyCode == 65) player.input.left = true;
    else if (event.keyCode == 38 || event.keyCode == 87) player.input.up = true;
    else if (event.keyCode == 40 || event.keyCode == 83) player.input.down = true;
    }
    
    //and unset it when the key is released
function onKeyUp(event) {
    event.preventDefault();
    if (event.keyCode == 39 || event.keyCode == 68) player.input.right = false;
    else if (event.keyCode == 37 || event.keyCode == 65) player.input.left = false;
    else if (event.keyCode == 38 || event.keyCode == 87) player.input.up = false;
    else if (event.keyCode == 40 || event.keyCode == 83) player.input.down = false;
 }

// Vector class
 function Vector(x,y) {
    this.x = x;
    this.y = y;

    // Add vector
    this.add = function(vector) {
        this.y += vector.y;
        this.x += vector.x;
    } 

    // Subtraction
    this.sub = function(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    // Multiplication
    this.mult = function(m) {
        this.x *= m;
        this.y *= m;
    }

    // Divide
    this.div = function(d) {
        this.x /= d;
        this.y /= d;
    }

    // Length
    this.len = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    // Normalize vector
    this.normalize = function() {
        m = this.len();

        if (m != 0)
            this.div(m);
    }

    // Set length
    this.setLen = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    // Limit the length
    this.limit = function(limit) {
        if(this.len() > limit){
            this.normalize();
            this.mult(limit);
        }
    }

 }

// Object copying
var object_create = Object.create;
if (typeof object_create !== 'function') {
    object_create = function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

function deepCopy(obj) {
    if(obj == null || typeof(obj) !== 'object'){
        return obj;
    }
    //make sure the returned object has the same prototype as the original
    var ret = object_create(obj.constructor.prototype);
    for(var key in obj){
        ret[key] = deepCopy(obj[key]);
    }
    return ret;
}