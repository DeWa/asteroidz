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
    var flames = [];
    var bullets = [];
    var bAsteroids = [];
    var mAsteroids = [];
    var sAsteroids = [];
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

// Game init
function init() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    gameLogic(); 
    gameLoop();
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
    enemyLogic();
    boundaries(); 
}

function enemyLogic() {
    if(bAsteroids.length < 2) {
        var asteroid = new BigAsteroid();
        bAsteroids.push(asteroid);
    }
}

// Draw flames if throttled
function drawFlames() {
    for(var i = 0; i < flames.length; i++ ) {
        flames[i].move();
        flames[i].draw();

        if(flames[i].life <= 0){
            flames.splice(i, 1);
        }
    }
}

// Draw all asteroids
function drawAsteroids() {
    for(var i = 0; i < bAsteroids.length; i++ ) {
        bAsteroids[i].move();
        bAsteroids[i].draw();
    }
}
// Draw all the bullets
function drawBullets() {
    for(var i = 0; i < bullets.length; i++ ) {
        bullets[i].move();
        bullets[i].draw();

        if(bullets[i].location.x > cw){
            bullets.splice(i, 1);
        }
    }
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

    // Player
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

    // Asteroids
    for(var i = 0; i < bAsteroids.length; i++) {
        if(bAsteroids[i].location.y > ch + bAsteroids[i].buffer) {
            bAsteroids[i].location.y = 0;
        } else if(bAsteroids[i].location.y < 0 - bAsteroids[i].buffer) {
            bAsteroids[i].location.y = ch;
        }
        if(bAsteroids[i].location.x > cw + bAsteroids[i].buffer) {
            bAsteroids[i].location.x = 0;
        } else if(bAsteroids[i].location.x < 0 - bAsteroids[i].buffer) {
            bAsteroids[i].location.x = cw;
        }
    }
}

function gameDraw(){
    starfield.draw();
    drawFlames();
    drawBullets();
    drawAsteroids();
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
    else if (event.keyCode == 17 || event.keyCode == 17) player.shoot();
    }
    
    //and unset it when the key is released
function onKeyUp(event) {
    event.preventDefault();
    if (event.keyCode == 39 || event.keyCode == 68) player.input.right = false;
    else if (event.keyCode == 37 || event.keyCode == 65) player.input.left = false;
    else if (event.keyCode == 38 || event.keyCode == 87) player.input.up = false;
    else if (event.keyCode == 40 || event.keyCode == 83) player.input.down = false;
    else if (event.keyCode == 17 || event.keyCode == 17) player.shoot();
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