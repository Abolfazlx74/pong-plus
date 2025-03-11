const bgColorInput = document.getElementById("bg-color");
const gameColorInput = document.getElementById("game-color");
const paddleColorInput = document.getElementById("paddle-color");
const ballColorInput = document.getElementById("ball-color");
const gameSpeedInput = document.getElementById("game-speed");
const lightColorInput = document.getElementById("light-color");
const lightZoneInput = document.getElementById("light-zone");
const previewContainer = document.querySelector(".preview-container");
const previewText = document.getElementById("preview-text");
const pointsLimit = document.getElementById("points-limit");


const previewCanvas = document.getElementById("preview-canvas");
const ctx = previewCanvas.getContext("2d");
const gameMode = document.getElementById("game-mode");
const moreSettings = document.querySelectorAll("#more-settings input")
let isInvisible;

previewCanvas.width = 200;
previewCanvas.height = 100;
function setInitialSettings(){
    bgColorInput.value = localStorage.getItem("bgColor") || bgColorInput.value;
    paddleColorInput.value = localStorage.getItem("paddleColor") || paddleColorInput.value;
    gameColorInput.value = localStorage.getItem("gameColor") || gameColorInput.value;
    ballColorInput.value = localStorage.getItem("ballColor") || ballColorInput.value;
    gameSpeedInput.value = localStorage.getItem("gameSpeed") || gameSpeedInput.value;
    lightColorInput.value = localStorage.getItem("lightColor") || lightColorInput.value;
    lightZoneInput.value = localStorage.getItem("lightZone") || lightZoneInput.value;
    pointsLimit.value = localStorage.getItem("pointsLimit") ||  pointsLimit.value;
    gameMode.value = localStorage.getItem("gameMode") ||  gameMode.value;
}

function drawPreview(setTextColor,isInvisible) {
    if (isInvisible) ballColorInput.value = gameColorInput.value;
    ctx.fillStyle = gameColorInput.value; 
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    previewContainer.style.backgroundColor = bgColorInput.value; 

    ctx.fillStyle = paddleColorInput.value; 
    ctx.fillRect(10, 40, 5, 20);  // Paddle 1
    ctx.fillRect(185, 40, 5, 20); // Paddle 2

    ctx.fillStyle = ballColorInput.value;
    ctx.beginPath();
    ctx.arc(previewCanvas.width / 2, previewCanvas.height / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    if (setTextColor) previewText.style.color = invertColor(bgColorInput.value);
}

function invertColor(hex) {
    let r = 255 - parseInt(hex.substring(1, 3), 16);
    let g = 255 - parseInt(hex.substring(3, 5), 16);
    let b = 255 - parseInt(hex.substring(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

function setGameMode(){
    if (gameMode.value == "invisibleBall") {
        ballColorInput.value = gameColorInput.value;
        ballColorInput.disabled = true;
        isInvisible = true;
        moreSettings.forEach(element => {element.disabled = false});
    } else {
        ballColorInput.disabled = false;
        isInvisible = false;
        moreSettings.forEach(element => {element.disabled = true});
    }
    
    drawPreview(false)
}


bgColorInput.addEventListener("input", () => drawPreview(true));
gameColorInput.addEventListener("input", () => drawPreview(false,isInvisible)); 
paddleColorInput.addEventListener("input", () => drawPreview(false));
ballColorInput.addEventListener("input", () => drawPreview(false)); 

function startGame () {
    localStorage.setItem("bgColor", bgColorInput.value);
    localStorage.setItem("paddleColor", paddleColorInput.value);
    localStorage.setItem("gameColor", gameColorInput.value);
    localStorage.setItem("ballColor", ballColorInput.value);
    localStorage.setItem("gameSpeed", gameSpeedInput.value);
    localStorage.setItem("lightColor", lightColorInput.value);
    localStorage.setItem("lightZone", lightZoneInput.value);
    localStorage.setItem("pointsLimit", pointsLimit.value);
    localStorage.setItem("gameMode", gameMode.value);
    window.location = "game.html";
};

setInitialSettings();
setGameMode();
drawPreview();