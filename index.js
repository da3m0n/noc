let cnv = document.getElementById('canvas');
let ctx = cnv.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;

cnv.width = GAME_WIDTH;
cnv.height = GAME_HEIGHT;

let game = new Game(GAME_WIDTH, GAME_HEIGHT, ctx);
let lastTime = 0;

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);