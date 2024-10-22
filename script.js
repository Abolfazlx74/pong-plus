const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 15;
let righttPlayerScore = 0 
let leftPlayerScore = 0
let ballSpeed = 3;

let leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: 6
};

let rightPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: 6
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: ballSpeed * (Math.random() > 0.5 ? 1 : -1)
};

function drawPaddle(paddle) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function movePaddle(paddle) {
    paddle.y += paddle.dy;
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddleHeight > canvas.height) paddle.y = canvas.height - paddleHeight;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // hitting the balls with the top and bottom of the ground
    if (ball.y - ballSize / 2 <= 0 || ball.y + ballSize / 2 >= canvas.height) {
        ball.dy *= -1;
    }

    // Dealing with paddles
    if (
        ball.x - ballSize / 2 <= leftPaddle.x + paddleWidth &&
        ball.y >= leftPaddle.y &&
        ball.y <= leftPaddle.y + paddleHeight
    ) {
        ball.dx *= -1;
    }
    if (
        ball.x + ballSize / 2 >= rightPaddle.x &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + paddleHeight
    ) {
        ball.dx *= -1;
    }

    // if the ball goes right or left
    if (ball.x - ballSize / 2 <= 0 ) {
        righttPlayerScore ++;
        resetBall();
    }
    if(ball.x + ballSize / 2 >= canvas.width){
        leftPlayerScore ++;
        resetBall()
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    movePaddle(leftPaddle);
    movePaddle(rightPaddle);
    moveBall();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// control paddles by keys
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            leftPaddle.dy = -leftPaddle.speed;
            break;
        case "s":
            leftPaddle.dy = leftPaddle.speed;
            break;
        case "ArrowUp":
            rightPaddle.dy = -rightPaddle.speed;
            break;
        case "ArrowDown":
            rightPaddle.dy = rightPaddle.speed;
            break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
        case "s":
            leftPaddle.dy = 0;
            break;
        case "ArrowUp":
        case "ArrowDown":
            rightPaddle.dy = 0;
            break;
    }
});

gameLoop();
