class Utils {
    constructor() {
    }

    getRandomColor() {
        let r = 255 * Math.random() | 0,
            g = 255 * Math.random() | 0,
            b = 255 * Math.random() | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    random(min, max) {
        return Math.round(Math.random() * (max - min) + min)
    }

    pointInCircle(x, y, cx, cy, radius) {
        let distanceSquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distanceSquared <= radius * radius;
    }

    getClickPosition(event) {
        const x = event.clientX - cnv.offsetLeft;
        const y = event.clientY - cnv.offsetTop;
        return {x: x, y: y};
    }

    distance(x1, y1, x2, y2) {
        const xDist = x2 - x1;
        const yDist = y2 - y1;
        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    }

    collisionDetect(v1, v2) {
        return v1.radius + v2.radius >= v2.pos.subtr(v1.pos).mag();
    }
    overlaps(balls, x, y, radius){
        for (let i = 0; i < balls.length; i++) {
            if(this.distance(x, y, balls[i].pos.x, balls[i].pos.y) < radius + balls[i].radius) {
                console.log('overlaps...');
                return true;
            }
        }
        return false;
    }

    detectCollisions2(balls){
        for (let i = 0; i < balls.length; i++) {
            balls[i].isColliding = false;
        }

        for (let i = 0; i < balls.length; i++) {
            const ballA = balls[i];

            if(this.overlaps(balls, ballA.pos.x, ballA.pos.y, ballA.radius)) {
                console.log('overlapping...');
                // this.resolveColl(ballA, ballB);
            }
        }
    }

    detectCollisions(balls){
        for (let i = 0; i < balls.length; i++) {
            balls[i].isColliding = false;
        }

        for (let i = 0; i < balls.length; i++) {
            const ballA = balls[i];
            for (let j = i + 1; j < balls.length; j++) {
                const ballB = balls[j];

                if(this.distance(ballA.pos.x, ballA.pos.y, ballB.pos.x, ballB.pos.y) < ballA.radius + ballB.radius) {
                    this.resolveColl(ballA, ballB);
                }

                // if(this.collisionDetect(ballA, ballB)) {
                //     console.log('overlapping...');
                // }
            }
        }
    }

    resolveColl2(ballA, ballB) {
        let normA = ballA.unit();

        let distA = ballB.pos.x - ballA.pos.x;
        let distB = ballB.pos.y - ballA.pos.y;

        let minDistance = ballA.radius + ballB.radius;
        let distance = this.distance(ballA.pos.x, ballA.pos.y, ballB.pos.x, ballB.pos.y);
        let angle = Math.atan2(distB, distA);
        let spread = minDistance - distance;

        let ax = spread * Math.cos(angle);
        let ay = spread * Math.sin(angle);

        ballA.pos.x -= ax;
        ballA.pos.y -= ay;

        let bounciness = 0.25 / 2;

        ballA.vel.x -= bounciness * Math.cos(angle);
        ballA.vel.y -= bounciness * Math.sin(angle);
        ballB.vel.x += bounciness * Math.cos(angle);
        ballB.vel.y += bounciness * Math.sin(angle);

    }
    resolveColl(ballA, ballB) {
        let distA = ballB.pos.x - ballA.pos.x;
        let distB = ballB.pos.y - ballA.pos.y;

        let minDistance = ballA.radius + ballB.radius;
        let distance = this.distance(ballA.pos.x, ballA.pos.y, ballB.pos.x, ballB.pos.y);
        let angle = Math.atan2(distB, distA);
        let spread = minDistance - distance;

        let ax = spread * Math.cos(angle);
        let ay = spread * Math.sin(angle);

        ballA.pos.x -= ax;
        ballA.pos.y -= ay;

        let bounciness = 0.25 / 2;

        ballA.vel.x -= bounciness * Math.cos(angle);
        ballA.vel.y -= bounciness * Math.sin(angle);
        ballB.vel.x += bounciness * Math.cos(angle);
        ballB.vel.y += bounciness * Math.sin(angle);

    }


}


/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.vel.x - otherParticle.vel.x;
    const yVelocityDiff = particle.vel.y - otherParticle.vel.y;

    const xDist = otherParticle.pos.x - particle.pos.x;
    const yDist = otherParticle.pos.y - particle.pos.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.pos.y - particle.pos.y, otherParticle.pos.x - particle.pos.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.vel, angle);
        const u2 = rotate(otherParticle.vel, angle);

        // Velocity after 1d collision equation
        const v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y };
        const v2 = {
            x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
            y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.vel.x = vFinal1.x;
        particle.vel.y = vFinal1.y;

        otherParticle.vel.x = vFinal2.x;
        otherParticle.vel.y = vFinal2.y;

        console.log(particle);
        console.log(otherParticle);
    }
}