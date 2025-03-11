// ability idea : magnetic paddle(attract the ball and reflect it to any direction)
// when user presses a key it goes to that direction indefinitely
// dark map mode : give box shadow to paddles - same color for game bg and ball color - new setting options 
const bgColor = localStorage.getItem("bgColor") || "#1f1f1f";
const gameColor = localStorage.getItem("gameColor") || "#000";
const paddleColor = localStorage.getItem("paddleColor") || "#fff";
const lightZone = localStorage.getItem("lightZone");
const lightColor = localStorage.getItem("lightColor")  || "#008000"; 
const canvas = document.getElementById("pong-canvas");
const body = document.querySelector("body");
const settingsButton = document.querySelector(".navigate-settings")
const ctx = canvas.getContext("2d");
const playerNameContainer = document.getElementById("player-name")
const gameOverContainer = document.querySelector(".game-over-container")

const screenWidthTh = screen.width / 1000;
canvas.width = screenWidthTh * 650;
canvas.height = screenWidthTh * 320;
let gameSpeedController = localStorage.getItem("gameSpeed")*screenWidthTh/1.5 || screenWidthTh /3;
const pointsLimit = localStorage.getItem("pointsLimit");
const gameMode = localStorage.getItem("gameMode");

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 15;

const lScoreContainer = document.getElementById("left-player-score");
const rScoreContainer = document.getElementById("right-player-score");
let rightPlayerScore = 0;
let leftPlayerScore = 0;
let ballSpeed = gameSpeedController * 4;
let ballSpeedIncreaser = gameSpeedController/2;
let hitTop = 0;
let hitDown = 0;
let hasFinished = 0;

let leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: gameSpeedController * 5.5
};

let rightPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: gameSpeedController * 5.5
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: ballSpeed * (Math.random() > 0.5 ? 1 : -1)
};

function setInitialSettings() {
    body.style.backgroundColor = bgColor;
    canvas.style.backgroundColor = gameColor;   
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("gameColor", gameColor);
    localStorage.setItem("paddleColor", paddleColor);
    localStorage.setItem("lightZone", lightZone);
    localStorage.setItem("lightColor", lightColor);
}
setInitialSettings();

function updateScores() {
    lScoreContainer.innerHTML = rightPlayerScore;
    rScoreContainer.innerHTML = leftPlayerScore;
    setHitsNumber();
    ballSpeed = gameSpeedController * 4;
    hitTop = 0;
    hitDown = 0;
    if (leftPlayerScore >= parseInt(pointsLimit) && !hasFinished) {
        finishGame("rightPlayer");
        hasFinished = 1;
    }
    else if (rightPlayerScore >= parseInt(pointsLimit) && !hasFinished) {
        finishGame("leftPlayer");
        hasFinished = 1;
    }
}

function increaseLeftPlayerScore() {
    leftPlayerScore++;
    updateScores();
}

function increaseRightPlayerScore() {
    rightPlayerScore++;
    updateScores();
}


function hex2rgb(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return [r,g,b];
}

function drawPaddle(paddle) {
    if(gameMode=="invisibleBall"){
        let paddleLC = lightZone || 1.3; //paddle light controller 
        let gradient = ctx.createRadialGradient(
            paddle.x + paddleWidth / 2, paddle.y + paddleHeight / 2, paddleLC * 30,  
            paddle.x + paddleWidth / 2, paddle.y + paddleHeight / 2, paddleLC * 140 
        );
         
        convertedColor = hex2rgb(lightColor);
        gradient.addColorStop(0, `rgba(${convertedColor[0]}, ${convertedColor[1]}, ${convertedColor[2]}, 0.6)`);  
        gradient.addColorStop(1, `rgba(${convertedColor[0]}, ${convertedColor[1]}, ${convertedColor[2]}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(paddle.x + paddleWidth / 2, paddle.y + paddleHeight / 2, paddleLC * 140, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = paddleColor;
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

    ballSpeed += ballSpeedIncreaser;
    ballSpeedIncreaser *= 0.95;
    hitAround = 0;

    const newDx = (ball.dx > 0 ? -1 : 1) * ballSpeed * Math.cos(angle);
    const newDy = ballSpeed * Math.sin(angle);

    ball.dx = newDx;
    ball.dy = newDy;
    hitTop = 0;
    hitDown = 0;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // hitting the balls with the top and bottom of the ground
    if (ball.y - ballSize / 2 <= 0 && !hitTop ) {
        ball.dy *= -1;
        hitTop = 1;
        hitDown = 0;
        console.log("Top")
    }

    if (ball.y + ballSize / 2 >= canvas.height && !hitDown ) {
        ball.dy *= -1;
        hitTop = 0;
        hitDown = 1;
        console.log("Bot")
    }

    // dealing with paddles
    let collided = false;
    if (ball.dx < 0 && ball.x <= leftPaddle.x + paddleWidth) {
        if (ball.y+6 >= leftPaddle.y && ball.y-4 <= leftPaddle.y + paddleHeight) {
            collided = true;
            reverseMovementDirection(leftPaddle);
        }
    }

    if (ball.dx && ball.x-10 >= rightPaddle.x - ballSize) {
        if (ball.y+6 >= rightPaddle.y && ball.y <= rightPaddle.y-4 + paddleHeight) {
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

function finishGame(player){
    gameSpeedController = 1;
    gameOverContainer.style.display = "flex";
    playerNameContainer.innerHTML = `${player.split("Player")[0]}`;
}

function restartGame(){
    location.href = "game.html";
}

function backToMenu(){
    location.href = "index.html";
}

// Navigate to settings page
settingsButton.addEventListener('click', () => {
    window.location = "index.html"
})

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
