class Ball {
    constructor(posX, posY, radius, col) {
        this.radius = radius;
        this.pos = {x: posX, y: posY}
        this.vel = {x: 0.25 / 5, y: 0.20 / 5};
        // let cnv = document.getElementById('canvas');
        this.acc = {x: 0, y:0};
        this.cnvWidth = cnv.width;
        this.cnvHeight = cnv.height;
        this.col = col;
        this.mass = 1;
    }

    getBallScore() {
        return Math.ceil(this.radius / 10) * 10;
        // if (this.radius > 0 && this.radius <= 10) {
        //     return 10;
        // } else if (this.radius > 10 && this.radius <= 20) {
        //     return 20;
        // } else if (this.radius > 20 && this.radius <= 30) {
        //     return 30;
        // } else if (this.radius > 30 && this.radius <= 40) {
        //     return 40;
        // } else if (this.radius > 40 && this.radius <= 50) {
        //     return 50;
        // } else if (this.radius > 50 && this.radius <= 60) {
        //     return 60;
        // }
    }

    update(deltaTime) {
        if (!deltaTime) return;

        let nextX = this.pos.x + this.vel.x * deltaTime;

        if (nextX > (this.cnvWidth - this.radius)) {
            let xDist = nextX - this.pos.x;
            let borderDist = (this.cnvWidth - this.radius) - this.pos.x;

            this.pos.x = this.cnvWidth - this.radius;
            this.vel.x = -Math.abs(this.vel.x)
            this.pos.x += this.vel.x * deltaTime * (1 - borderDist / xDist);

        } else if (nextX < this.radius) {
            let xDist = Math.abs(nextX - this.pos.x);
            let borderDist = this.pos.x - this.radius;

            this.vel.x = Math.abs(this.vel.x);
            this.pos.x = this.radius + this.vel.x * deltaTime * (1 - borderDist / xDist);
        } else {
            this.pos.x += this.vel.x * deltaTime;
        }

        if (this.pos.y > (this.cnvHeight - this.radius)) {
            this.vel.y = -Math.abs(this.vel.y);
            this.pos.y += this.vel.y * deltaTime;
        } else if (this.pos.y < this.radius) {
            this.vel.y = Math.abs(this.vel.y);
            this.pos.y += this.vel.y * deltaTime;
        } else {
            this.pos.y += this.vel.y * deltaTime;
        }

    }

    draw(ctx) {
        // const circle = new Path2D();
        // circle.arc(this.pos.x, this.pos.y, this.radius, Math.PI * 2, 0);
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, Math.PI / 4, 0, 2 * Math.PI);

        ctx.fillStyle = this.col;
        ctx.fill();
        // ctx.strokeStyle = this.col;
        // ctx.stroke();
        ctx.font = "10px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(
            "Vel: " + Math.round(this.vel.x) + ' - ' + Math.round(this.vel.y),
            this.pos.x,
            this.pos.y
        );
        ctx.stroke();
    }

    drawLines(ctx) {
        // console.log('display');
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        // ctx.lineTo(100, 100);

        ctx.lineTo(this.pos.x + this.vel.x * 1000, this.pos.y + this.vel.y * 1000);
        ctx.strokeStyle = 'green';ctx.stroke();
    }
}
