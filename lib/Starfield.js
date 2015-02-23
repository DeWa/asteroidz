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
            ctx.fillStyle = '#9dd4ff';
            ctx.fill();
            ctx.strokeStyle = '#9dd4ff';
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
