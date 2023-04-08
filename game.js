const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png'
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200 //the height of canvas minus 200

//score variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;
let scored = false;
//call a function when the user releases a key
document.body.onkeyup = function(e){
	if(e.code == 'Space') {
		birdVelocity = FLAP_SPEED;
	}
}

document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})

// game logic
function increaseScore(){
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
          birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // reset the flag, if bird passes the pipes
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}
function collisionCheck(){
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Check for collision with upper pipe box
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    // Check for collision with lower pipe box
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }

    // check if bird hits boundaries
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }


    return false;
}
function hideEndMenu(){
	// Hide the end menu
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}
function showEndMenu(){
    document.getElementById("end-menu").style.display = "block";
    gameContainer.classList.add("backdrop-blur");
    document.getElementById("end-score").innerHTML = score;
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}
function resetGame(){
	birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;
    pipeX = 400;
    pipeY = canvas.height - 200;
    score = 0;
}
function endGame(){
	showEndMenu();
}
function loop(){
    // reset the ctx every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw flappy bird
    ctx.drawImage(flappyImg, birdX, birdY);

    // draw pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);
    
    //collision check will return true if we have a collision, and then displaying the end menu
    if(collisionCheck()){
        endGame();
        return;
    }
    //Move the pipe to the left for 1.5 as frame pass by
    pipeX -= 1.5;

    //If pipe moves out the frame, we need to reset the pipe
    if(pipeX < -50){
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    //apply gravity to the bird and let it move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    // to perform an animation by calling loop function again and again
    increaseScore();
    requestAnimationFrame(loop);


}
loop();