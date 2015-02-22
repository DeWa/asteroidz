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