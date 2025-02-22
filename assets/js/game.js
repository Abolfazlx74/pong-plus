const canvas = document.getElementById("pong-canvas");
const body = document.querySelector("body");
const ctx = canvas.getContext("2d");

const screenWidthTh = screen.width / 1000;
canvas.width = screenWidthTh * 650;
canvas.height = screenWidthTh * 320;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 15;

const lScoreContainer = document.getElementById("left-player-score");
let rightPlayerScore = 0;
const rScoreContainer = document.getElementById("right-player-score");
let leftPlayerScore = 0;
let ballSpeed = parseInt(screenWidthTh) * 4;

let leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: screenWidthTh * 5
};

let rightPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: screenWidthTh * 5
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: ballSpeed * (Math.random() > 0.5 ? 1 : -1)
};

function setInitialSettings() {
    const bgColor = localStorage.getItem("bgColor") || "#1f1f1f";
    const gameColor = localStorage.getItem("gameColor") || "#000";
    const paddleColor = localStorage.getItem("paddleColor") || "#fff";
    body.style.backgroundColor = bgColor;
    canvas.style.backgroundColor = gameColor;   
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("gameColor", gameColor);
    localStorage.setItem("paddleColor", paddleColor);
}
setInitialSettings();

function updateScores() {
    lScoreContainer.innerHTML = rightPlayerScore;
    rScoreContainer.innerHTML = leftPlayerScore;
    setHitsNumber();
    ballSpeed = screenWidthTh * 4;
}

function increaseLeftPlayerScore() {
    leftPlayerScore++;
    updateScores();
}

function increaseRightPlayerScore() {
    rightPlayerScore++;
    updateScores();
}

function drawPaddle(paddle) {
    ctx.fillStyle = localStorage.getItem("paddleColor");
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.fillStyle = localStorage.getItem("ballColor") || "#fff";
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

let hittingRightNumber = 1;
let hittingLefttNumber = 1;

function setHitsNumber() {
    hittingRightNumber = 1;
    hittingLefttNumber = 1;
}

function reverseMovementDirection(paddle) {
    const impactPoint = (ball.y - paddle.y) / paddleHeight - 0.5;
    const angle = impactPoint * Math.PI / 4;

    ballSpeed += screenWidthTh;

    const newDx = (ball.dx > 0 ? -1 : 1) * ballSpeed * Math.cos(angle);
    const newDy = ballSpeed * Math.sin(angle);

    ball.dx = newDx;
    ball.dy = newDy;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // hitting the balls with the top and bottom of the ground
    if (ball.y - ballSize / 2 <= 0 || ball.y + ballSize / 2 >= canvas.height) {
        ball.dy *= -1;
    }

    // dealing with paddles
    let collided = false;
    if (ball.dx < 0 && ball.x <= leftPaddle.x + paddleWidth) {
        if (ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + paddleHeight) {
            collided = true;
            reverseMovementDirection(leftPaddle);
        }
    }

    if (ball.dx > 0 && ball.x >= rightPaddle.x - ballSize) {
        if (ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + paddleHeight) {
            collided = true;
            reverseMovementDirection(rightPaddle);
        }
    }

    if (collided) {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }

    if (ball.x - ballSize / 2 <= 0) {
        increaseLeftPlayerScore();
        resetBall();
    }

    if (ball.x + ballSize / 2 >= canvas.width) {
        increaseRightPlayerScore();
        resetBall();
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
updateScores();
