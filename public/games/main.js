import Ball from "./ball.js";
import Paddle from "./paddle.js";

const ball = new Ball()

const paddlePushoff = 40
const paddleWidth = 20
const playLength = 10

const leftPaddle = new Paddle(paddleWidth)
leftPaddle.setAxis(paddlePushoff)
const rightPaddle = new Paddle(paddleWidth)
rightPaddle.setAxis(window.innerWidth - paddlePushoff)
var activeOffsetX
var activeOffsetY

function calcActiveOffset() {
    activeOffsetX = Math.cos(ball.direction) * ball.velocity
    activeOffsetY = Math.sin(ball.direction) * ball.velocity
}

const shock = (player) => {
    console.log("shock")
    fetch("http://192.168.166.203:5000/player" + player, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error sending POST request");
        }
      })
      .catch((error) => {
        console.error("POST request failed:", error);
      });
  };

const longShock = (player) => {
    console.log("long shock")
    fetch("http://192.168.166.203:5000/player" + player + "Long", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error sending POST request");
        }
      })
      .catch((error) => {
        console.error("POST request failed:", error);
      });
  };

document.addEventListener("keydown", (e) => {
    const paddleVelocity = 20
    switch (e.key) {
        case "w": leftPaddle.velocity = paddleVelocity; break;
        case "s": leftPaddle.velocity = -paddleVelocity; break;
        case "ArrowUp": rightPaddle.velocity = paddleVelocity; break;
        case "ArrowDown": rightPaddle.velocity = -paddleVelocity; break;
    }
})
document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w": leftPaddle.velocity = 0; break;
        case "s": leftPaddle.velocity = 0; break;
        case "ArrowUp": rightPaddle.velocity = 0; break;
        case "ArrowDown": rightPaddle.velocity = 0; break;
    }
})
var rightPlane = window.innerWidth - (paddlePushoff + (paddleWidth / 2))
var leftPlane = paddlePushoff + (paddleWidth / 2)
window.addEventListener("resize", () => {
    rightPaddle.setAxis(window.innerWidth - paddlePushoff)
    rightPlane = window.innerWidth - (paddlePushoff + (paddleWidth / 2))
})

var gameStarted = false

async function startGame() {
gameStarted = true;
var rightTurn = true;
var leftScore = 0;
var rightScore = 0;
while (leftScore < playLength && rightScore < playLength) {
    
    
    ball.velocity = 10
    if (rightTurn) {
        ball.direction = (Math.random() - 0.5) * (Math.PI / 3)
    } else {
        ball.direction = (Math.random() - 0.5) * (Math.PI / 3) + Math.PI
    }
    ball.setPosCenter()
    leftPaddle.center()
    rightPaddle.center()
    
    var inPlay = true
    calcActiveOffset()
    while(inPlay) {
        let candidateX = ball.posX + activeOffsetX
        let candidateY = ball.posY - activeOffsetY
        if (ball.posY + ball.radius > window.innerHeight) {
            candidateY = window.innerHeight - ball.radius
            ball.direction = - ball.direction
            calcActiveOffset()
        } else if (ball.posY - ball.radius < 0) {
            candidateY = ball.radius
            ball.direction = - ball.direction
            calcActiveOffset()
        }
        if (candidateX + ball.radius >= rightPlane && ball.posX + ball.radius < rightPlane) {
            let paddleCheck = rightPaddle.checkY(ball.posY)
            if (paddleCheck != null) {
                ball.direction = Math.PI + paddleCheck
            }
            ball.velocity = ball.velocity + 1
            calcActiveOffset()
        } else if (candidateX - ball.radius <= leftPlane && ball.posX - ball.radius > leftPlane) {
            let paddleCheck = leftPaddle.checkY(ball.posY)
            if (paddleCheck != null) {
                ball.direction = - paddleCheck
            }
            ball.velocity = ball.velocity + 1
            calcActiveOffset()
        }
        ball.setPos(candidateX, candidateY)
        leftPaddle.setY(leftPaddle.posY - leftPaddle.velocity)
        rightPaddle.setY(rightPaddle.posY - rightPaddle.velocity)
        if (ball.posX - ball.radius < 0) {
            inPlay = false
            rightScore++
            rightTurn = false
            if (rightScore != playLength) {
             shock(1
             );
            }
        } else if (ball.posX + ball.radius > window.innerWidth) {
            inPlay = false
            leftScore++
            rightTurn = true
            if (leftScore != playLength) {
             shock(2);
            }
        }
        await new Promise(f => setTimeout(f, 16))
    }
    document.querySelector("#leftScore").innerHTML = leftScore
    document.querySelector("#rightScore").innerHTML = rightScore
}

if (leftScore > rightScore) {
    longShock(2)
} else {
    longShock(1)
}
}
document.addEventListener("keydown", (e) => {
    if (!gameStarted && e.code === "Space") {
        startGame();
    }
});