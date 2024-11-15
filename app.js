// Declaring variables
let board;
let boardWidth = 360;
let boardHeight = 640;
let context; 

// Bird
let birdWidth = 34; 
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

// Pipes
let pipeArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Game control variables
let speedX = -2;
let speedY = 0;
let moveDown = 0.4;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameStarted = false; // New variable to track game state

// Bird object
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load Images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Display the "Start" message initially
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText("START GAME", 37, 300 );

    document.addEventListener("keydown", startGame);//Start game on key Press
    document.addEventListener("click", startGame); // Start game on click
}

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        document.addEventListener("keydown", moveBird); // Enable bird movement on key press
        document.addEventListener("click", moveBird); // Enable bird movement on click
        requestAnimationFrame(update); // Start the game loop
        setInterval(placePipes, 1500); // Start placing pipes
    }
}

// Function for updating the canvas frame
function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight);

    // Bird
    speedY += moveDown;
    bird.y = Math.max(bird.y += speedY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 

    if (bird.y > board.height) {
        gameOver = true;
        updateHighScore();
    }

    // Pipes
    for (let i = 0; i < pipeArr.length; i++) {
        let pipe = pipeArr[i];
        pipe.x += speedX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            updateHighScore();
        }

        while (pipeArr.length > 0 && pipeArr[0].x < -pipeWidth) {
            pipeArr.shift();
        }
    }

    // Displaying scores
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    context.fillText(`High Score: ${highScore}`, 5, 90);

    if (gameOver) {
        context.fillText("GAME OVER!", 37, 300);
    }
}

// Function for placing pipes
function placePipes() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArr.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArr.push(bottomPipe);
}

// Function for moving the bird
function moveBird(e) {
    if (e.type === "click" || e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        speedY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArr = [];
            score = 0;
            gameOver = false;
        }
    }
}

// Function to detect collision
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Function to update high score
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}
