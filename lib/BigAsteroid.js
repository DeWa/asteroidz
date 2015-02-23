/**
 * @BigAsteroid 
 */
function BigAsteroid() {
    this.location = new Vector(200, 200);
    this.velocity = new Vector(1,1);
    this.turnRate = 1;
    this.heading = 0;
    this.angle = 0;
    this.buffer = 50;
    this.maxspeed = 2;
    this.hitbox = {x: this.location.x, y: this.location.y, radius: 20};

    // Unit Circle coordinates
    this.cPoints = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    // Drawing coordinates
    this.dPoints = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    // Original object drawing
    this.origObject = [[10, 30], [50, 30], [40, 10], [60, 30], [120, 30], [160, 40], [180, 35], [190, 38], [230, 20], [235, 20], [270, 15], [290, 20]];
    // Modified object
    this.object = [[10, 30], [50, 30], [40, 20], [60, 30], [120, 30], [160, 40], [180, 35], [190, 38], [230, 20], [235, 20], [270, 15], [290, 20]];


    this.init = function() {
        // Which side will the new meteor come from
        var rand = (Math.floor((Math.random() * 4) + 1));
        switch(rand){
            //UP
            case 1:
                this.location.y = 0 - this.buffer;
                this.location.x = (Math.floor((Math.random() * cw) + 1));
            break;
            
            //RIGHT
            case 2:
                this.location.y = (Math.floor((Math.random() * ch) + 1));
                this.location.x = cw + this.buffer;
            break;
            
            //BOTTOM
            case 3:
                this.location.y = ch + this.buffer;
                this.location.x = (Math.floor((Math.random() * cw) + 1));
            break;
            
            //LEFT
            case 4:
                this.location.y = (Math.floor((Math.random() * ch) + 1));
                this.location.x = 0 - this.buffer;
            break;
        }

        // Some random values
        var vX = (Math.random() * this.maxspeed - 0.1) + 0.1;
        var vY = (Math.random() * this.maxspeed - 0.1) + 0.1;
        var rotation = (Math.random() * 2 - 0.5) + 0.5;
        this.turnRate -= rotation;
        this.velocity.x -= vX;
        this.velocity.y -= vY;
    };

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

    this.die = function() {

    }

    // Move asteroid
    this.move = function() {
        this.angle += this.turnRate;

        if(this.angle < 0)
            this.angle = 360;
        else if(this.angle > 360)
            this.angle = 0;

        this.reAngle();
        this.calcPoints();
        this.calcDrawPoints();
        this.location.add(this.velocity);
        // Add new hitbox
        var newHitbox = {x: this.location.x-4, y: this.location.y-4, radius: 26};
        this.hitbox = newHitbox;

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

    // Draw the asteroid into screen
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

    this.init();

}