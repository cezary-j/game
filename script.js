
var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 12;
var ballY = 50;
var ballSpeedY = 4;
var playerLeftScore = 0;
var playerRightScore = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;


function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
            x:mouseX,
            y:mouseY
    };
}

function handleMouseClick(evt){
    if(showingWinScreen) {
        playerLeftScore = 0;
        playerRightScore = 0;
        (showingWinScreen = false)
    }
}

window.onload = function() {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function() {
            moveEverything();
            drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown',handleMouseClick)

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });
};

function ballReset() {

        if(playerLeftScore >= WINNING_SCORE || playerRightScore >= WINNING_SCORE) {
                playerLeftScore = 0;
                playerRightScore = 0;
                showingWinScreen = true;
                // alert("someone wins!");
        }
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width/2;
        ballY = canvas.height/2;
}

function computerMovement() {
        var paddle2Ycenter = paddle2Y + (PADDLE_HEIGHT/2);
        if(paddle2Ycenter < ballY) {
            paddle2Y += 8;
        } else if(paddle2Ycenter > ballY+35) {
            paddle2Y -= 8;
        }
}

function moveEverything() {
        if(showingWinScreen) {
            return;
        }
        computerMovement();

        ballX += ballSpeedX;
        ballY += ballSpeedY;

            if(ballX < 0) {
            if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY -(paddle1Y+ PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            } else {
                playerRightScore += 1;
                ballReset();
            }
        }

    if(ballX > canvas.width) {

        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY -(paddle2Y+ PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            playerLeftScore += 1;  //must be before ball reset
            ballReset();
        }
    }
        if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for(var i=0; i< canvas.height; i+=40) {
            colorRect(canvas.width/2-1,i,4,30,'white');
    }
}

function drawEverything() {

    //next line blanks out screen with black
    colorRect(0,0,canvas.width,canvas.height, 'grey');

            if(showingWinScreen) {
                canvasContext.fillStyle = 'white';

                if (playerLeftScore >= WINNING_SCORE) {
                    canvasContext.fillText ("Left player won", 400, 500);
                } else if(playerRightScore >= WINNING_SCORE) {
                    canvasContext.fillText("Right player won", 400, 500);
                }

                canvasContext.fillText("Left player won", 400, 500);
                    return;
            }

            drawNet();
    // this is left player paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    // this is right player paddle
    colorRect(canvas.width -PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    // next line draws the ball
    colorCircle(ballX, ballY, 10 ,'white');

    canvasContext.fillText(playerLeftScore, 100, 100);
    canvasContext.fillText(playerRightScore, canvas.width-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX,topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);

}