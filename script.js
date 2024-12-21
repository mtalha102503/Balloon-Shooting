// Balloon Shooting Game Logic

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const customizeButton = document.getElementById('customize-button');
const customizationModal = document.getElementById('customization-modal');
const applyCustomizationButton = document.getElementById('apply-customization');
const closeModalButton = document.getElementById('close-modal');
const gameNameInput = document.getElementById('game-name');
const backgroundColorInput = document.getElementById('background-color');
const buttonColorInput = document.getElementById('button-color');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

let score = 0;
let level = 1;
let balloons = [];
let gameInterval;

// Initialize Canvas Dimensions
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Balloon Object Constructor
function Balloon(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = Math.random() * 2 + 1;
}

Balloon.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

Balloon.prototype.update = function () {
    this.y -= this.speed;
};

// Generate Random Balloons
function generateBalloons(count) {
    balloons = [];
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height + Math.random() * 100;
        const radius = Math.random() * 20 + 10;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        balloons.push(new Balloon(x, y, radius, color));
    }
}

// Update Game State
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balloons.forEach((balloon, index) => {
        balloon.update();
        balloon.draw();

        // Remove balloons that go off-screen
        if (balloon.y + balloon.radius < 0) {
            balloons.splice(index, 1);
        }
    });

    if (balloons.length === 0) {
        level++;
        levelDisplay.textContent = level;
        generateBalloons(level * 5);
    }
}

// Handle Mouse Clicks
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    balloons.forEach((balloon, index) => {
        const distance = Math.hypot(balloon.x - mouseX, balloon.y - mouseY);
        if (distance < balloon.radius) {
            balloons.splice(index, 1);
            score += 10;
            scoreDisplay.textContent = score;
        }
    });
});

// Start Game
startButton.addEventListener('click', () => {
    score = 0;
    level = 1;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    generateBalloons(5);
    gameInterval = setInterval(updateGame, 20);
});

// Open Customization Modal
customizeButton.addEventListener('click', () => {
    customizationModal.classList.remove('hidden');
});

// Apply Customizations
applyCustomizationButton.addEventListener('click', () => {
    document.getElementById('game-title').textContent = gameNameInput.value || 'Balloon Shooting Game';
    canvas.style.backgroundColor = backgroundColorInput.value;
    document.querySelectorAll('button').forEach((button) => {
        button.style.backgroundColor = buttonColorInput.value;
    });
    customizationModal.classList.add('hidden');
});

// Close Customization Modal
closeModalButton.addEventListener('click', () => {
    customizationModal.classList.add('hidden');
});
