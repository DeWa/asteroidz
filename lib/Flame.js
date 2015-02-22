/**
 * @Flame Flames from players ship
 */
function Flame(pLocation, pHeading) {
    this.location = new Vector(0,0);
    this.velocity = new Vector(0,0);
    this.length = (Math.random() * 10 - 1) + 1;
    this.heading = 0;
    this.life = 0;

    this.init = function(pLocation, pHeading){
        this.heading = (pHeading - 180) * Math.PI/180;
        // Add a little bit of randomness
        var rand = (Math.random() * 1 - 0.1) + 0.1;
        this.life = (Math.random() * 10 - 1) + 1;
        this.heading += 0.5;
        this.heading -= rand;

        var angle = -this.heading;
        var force = new Vector(Math.cos(angle), Math.sin(angle));
        force.mult(4);
        this.velocity.add(force);

        this.location.add(this.calcLocation(pLocation, pHeading));

        //console.log(JSON.stringify(this.location));
    }

    this.calcLocation = function(pLocation, pHeading) {
        var temp = new Vector();
        var angle = (pHeading - 180) * Math.PI/180;
        temp.x = pLocation.x + 10 * Math.cos(angle);
        temp.y = pLocation.y - 10 * Math.sin(angle);

        return temp;

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