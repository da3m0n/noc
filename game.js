const UTILS = new Utils();
let score = 0;

// how to do base class?
class GameBase {
    constructor(game) {

    }
    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, cnv.width, cnv.height);
    }
}
class GamePendingState extends GameBase {
    constructor(game) {
        super(game);

        this.game = game;
    }

    draw(ctx) {
        this.game.drawText(ctx);
        ctx.font = "30px Arial";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";

        ctx.fillText(
            "Pending",
            this.game.width / 2,
            this.game.height / 2
        );
    }

    update(deltaTime) {
    }

    event(e) {}
    // display(){}
}

class GameOverState {
    constructor(game) {
        this.game = game;
    }

    draw(ctx) {
        this.game.drawText(ctx);
        ctx.font = "30px Arial";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";

        ctx.fillText(
            "Game Over",
            this.game.width / 2,
            this.game.height / 2
        );
        ctx.font = "14px Arial";
        ctx.fillText('Press Spacebar to restart',
            this.game.width / 2,
            this.game.height / 2 + 20);
    }

    update(deltaTime) {
    }

    event(e) {
        if(e.key === ' ' || e.code === 'space' || e.keyCode === 32) {
            this.game.startGame();
        }
    }
    // display(){}
}

class GamePlayingState extends GameBase {
    constructor(game) {
        super();
        this.game = game;
    }

    draw(ctx) {
        for (let i = 0; i < this.game.balls.length; i++) {
            const ball = this.game.balls[i];
            ball.draw(this.game.ctx);
            // ball.drawLines(this.game.ctx);
        }
        this.game.drawText(ctx)
    }

    update(deltaTime) {
        for (let i = 0; i < this.game.balls.length; i++) {
            const ball = this.game.balls[i];
            ball.update(deltaTime);
        }

        UTILS.detectCollisions(this.game.balls);
    }

    event(e) {}
}


class Game {
    constructor(width, height, ctx) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        let me = this;
        // this.gameState = new GamePendingState(this);
        let v1 = new Vector(3,4);
        let v2 = new Vector(3,5);
        console.log(v1.add(v2));
        console.log(v1.subtr(v2));
        console.log(v1.mag());
        console.log(v1.mult(2));
        console.log(v1.unit());
        console.log(Vector.dot(v1, v2));


        cnv.addEventListener('mousedown', ballClickHandler);

        function ballClickHandler(event) {
            let clickPos = UTILS.getClickPosition(event);
            // for (let i = 0; i < me.balls.length; i++) {
            for(let i = me.balls.length - 1; i >= 0; i--) {
                let ball = me.balls[i];
                if (UTILS.pointInCircle(ball.pos.x, ball.pos.y, clickPos.x, clickPos.y, ball.radius)) {
                    score += ball.getBallScore();
                    me.balls.splice(i, 1);
                    break;
                }

                if (me.balls.length === 0) {
                    me.gameState = new GameOverState(me);
                }
            }
        }

        document.addEventListener('keydown', (e) => {
            score = 0;
            me.gameState.event(e);
        });

        this.startGame();
    }

    startGame(){
        let me = this;
        this.gameState = new GamePlayingState(this);
        this.balls= [];
        let breakout = 0;

        for (let i = 0; i < 10; i++) {
            let ballRadius = 10 + UTILS.random(10, 40);
            let x = UTILS.random(ballRadius, this.width - ballRadius);
            let y = UTILS.random(ballRadius, this.height - ballRadius);

            while (UTILS.overlaps(this.balls, x, y, ballRadius)) {
                x = UTILS.random(ballRadius, this.width - ballRadius);
                y = UTILS.random(ballRadius, this.height - ballRadius);
                breakout++;
                if(breakout === 3500) {
                    break;
                }
            }

            this.balls.push(new Ball2(x, y, ballRadius, UTILS.getRandomColor()));
        }
    }

    update(deltaTime) {
        this.gameState.update(deltaTime);
    }

    drawText(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.font = '12px Arial';
        ctx.fillText(
            "Score:",
            20,
            20
        );
        ctx.fillText(
            score,
            50,
            20
        );

        ctx.fillText(
            "Total Time:",
            32,
            34
        );
    }

    draw(ctx) {
        this.gameState.draw(ctx);
    }

}