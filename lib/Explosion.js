/**
 * @Explosion Creates explosion 
 */
function Explosion(x, y) {
    this.location = new Vector(x,y);
    this.pieces = [];

    this.init = function(pLocation, pHeading){

        // Add a little bit of randomness
        var rand = (Math.random() * 1 - 0.1) + 0.1;
        this.life = (Math.random() * 10 - 1) + 1;

        var angle = -this.heading;
        var force = new Vector(Math.cos(angle), Math.sin(angle));
        force.mult(4);
        this.velocity.add(force);

        this.location.add(this.calcLocation(pLocation, pHeading));

        //console.log(JSON.stringify(this.location));
    }

    this.draw = function() {
        var newX = this.location.x + this.length * Math.cos(this.heading);
        var newY = this.location.y - this.length * Math.sin(this.heading);
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(this.location.x,this.location.y);
        ctx.lineTo(newX,newY);
        ctx.stroke();
        ctx.closePath();
    }

    this.move = function() {
        this.location.add(this.velocity);
        this.life--;
    }

    this.init(pLocation, pHeading);
}