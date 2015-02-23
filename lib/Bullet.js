/**
 * @Bullet bullet from players ship
 */
function Bullet(pLocation, pHeading) {
    this.location = new Vector(0,0);
    this.velocity = new Vector(0,0);
    this.length = 5;
    this.heading = 0;
    this.speed = 9;
    this.hitbox = {x: this.location.x, y: this.location.y, radius: 5};

    this.init = function(pLocation, pHeading){
        this.heading = pHeading * Math.PI/180;
        // Add a little bit of randomness
        var angle = -this.heading;
        var force = new Vector(Math.cos(angle), Math.sin(angle));
        force.mult(this.speed);
        this.velocity.add(force);

        this.location.add(this.calcLocation(pLocation, pHeading));

        //console.log(JSON.stringify(this.location));
    }

// TODO Calculate better
    this.calcLocation = function(pLocation, pHeading) {
        var temp = new Vector();
        var angle = pHeading * Math.PI/180;
        temp.x = pLocation.x + 10 * Math.cos(angle);
        temp.y = pLocation.y + 10 * Math.sin(angle);

        return temp;

    }

    this.draw = function() {
        var newX = this.location.x + this.length * Math.cos(this.heading);
        var newY = this.location.y - this.length * Math.sin(this.heading);
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(this.location.x,this.location.y);
        ctx.lineTo(newX,newY);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.closePath();

        // IF DEBUG, DRAW ALSO HITBOX
        if(DEBUG) {
            ctx.beginPath();
            ctx.arc(this.hitbox.x, this.hitbox.y, this.hitbox.radius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }    

    }

    this.move = function() {
        this.location.add(this.velocity);

        this.hitbox = {x: this.location.x, y: this.location.y, radius: 5};
    }

    this.init(pLocation, pHeading);
}