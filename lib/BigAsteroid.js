/**
 * @BigAsteroid 
 */
function BigAsteroid() {
    this.location = new Vector(200, 200);
    this.velocity = new Vector(1,1);
    this.turnRate = 5;
    this.heading = 0;
    this.angle = 0;
    this.buffer = 40;

    // Unit Circle coordinates
    this.cPoints = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    // Drawing coordinates
    this.dPoints = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    // Original object drawing
    this.origObject = [[10, 30], [50, 30], [40, 10], [60, 30], [120, 30], [160, 40], [180, 35], [190, 38], [230, 20], [235, 20], [270, 15], [290, 20]];
    // Modified object
    this.object = [[10, 30], [50, 30], [40, 10], [60, 30], [120, 30], [160, 40], [180, 35], [190, 38], [230, 20], [235, 20], [270, 15], [290, 20]];


    this.init = function() {
        var vX = (Math.random() * 2 - 0.1) + 0.1;
        var vY = (Math.random() * 2 - 0.1) + 0.1;
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

    // Turn the asteroid left
    this.turnLeft = function() {
        this.angle += this.turnRate;
        
        if(this.angle > 360)
            this.angle = 0;

        this.heading = this.angle * Math.PI/180;

        this.reAngle();
    };

    // Turn the asteroid right
    this.turnRight = function() {
        this.angle -= this.turnRate;
        
        if(this.angle < 0)
            this.angle = 360;
        this.heading = this.angle * Math.PI/180;
        
        this.reAngle();
    }

    this.move = function() {
        this.calcPoints();
        this.calcDrawPoints();
        this.location.add(this.velocity);

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

    };

    this.init();

}