/**
 * @Ship Players ship
 */
function Ship() {
    this.location = new Vector(90, 90);
    this.velocity = new Vector(0,0);
    this.acceleration = new Vector(0,0);
    this.drag = 0.98;
    this.turnRate = 3;
    this.mass = 10;
    this.topspeed = 5;
    this.heading = 0;
    this.angle = 0;
    this.thrusting = false;
    this.shooting = false;
    this.lastShot = 0;
    this.hitbox = {x: this.location.x, y: this.location.y, radius: 10};

    // Input booleans
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

        if(this.thrusting) {
            var flame = new Flame(this.location, this.angle);
            flames.push(flame);
        }

        if(this.shooting) {
            this.shoot();
        }

        this.hitbox = {x: this.location.x, y: this.location.y, radius: 10};
        this.thrusting = false;
    }

    this.shoot = function() {
        var newShot = (new Date()).getTime();
        if(newShot - this.lastShot > 300) {
            var bullet = new Bullet(this.location, this.angle);
            bullets.push(bullet);
            this.lastShot = newShot;
        }
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

    // Draw ship into screen
    this.draw = function() {
    
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.moveTo(this.dPoints[0][0],this.dPoints[0][1]);
        for(var i = 0; i < this.dPoints.length; i++) {
            if(i == this.dPoints.length-1)
                ctx.lineTo(this.dPoints[0][0],this.dPoints[0][1]);
            else    
                ctx.lineTo(this.dPoints[i+1][0],this.dPoints[i+1][1]);

        }
        ctx.fillStyle="black";
        ctx.fill();
        ctx.closePath();  
        ctx.stroke(); 

        // IF DEBUG, DRAW ALSO HITBOX
        if(DEBUG) {
            ctx.beginPath();
            ctx.arc(this.hitbox.x, this.hitbox.y, this.hitbox.radius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }  
        
    };

}
