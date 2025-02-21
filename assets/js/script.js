const bgColorInput = document.getElementById("bg-color");
const gameColorInput = document.getElementById("game-color");
const paddleColorInput = document.getElementById("paddle-color");
const ballColorInput = document.getElementById("ball-color");
const previewContainer = document.querySelector(".preview-container");
const previewText = document.getElementById("preview-text");

const previewCanvas = document.getElementById("preview-canvas");
const ctx = previewCanvas.getContext("2d");

previewCanvas.width = 200;
previewCanvas.height = 100;

function drawPreview(setTextColor) {
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

    if (setTextColor) {
        previewText.style.color = invertColor(bgColorInput.value);
    }
}

function invertColor(hex) {
    let r = 255 - parseInt(hex.substring(1, 3), 16);
    let g = 255 - parseInt(hex.substring(3, 5), 16);
    let b = 255 - parseInt(hex.substring(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

bgColorInput.addEventListener("input", () => drawPreview(true));
gameColorInput.addEventListener("input", () => drawPreview(false)); 
paddleColorInput.addEventListener("input", () => drawPreview(false));
ballColorInput.addEventListener("input", () => drawPreview(false)); 

document.getElementById("start-game").addEventListener("click", () => {
    localStorage.setItem("bgColor", bgColorInput.value);
    localStorage.setItem("paddleColor", paddleColorInput.value);
    localStorage.setItem("gameColor", gameColorInput.value);
    localStorage.setItem("ballColor", ballColorInput.value);
    window.location = "game.html";
});

drawPreview();
