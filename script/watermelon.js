import { Fruit } from "./fruit.js"
import { Score } from "./score.js"

const canvas = document.createElement("canvas")
canvas.width = 600
canvas.height = 800
const ctx = canvas.getContext("2d")
document.body.appendChild(canvas)

function adjustCanvasSize() {
    if (window.innerWidth >= canvas.width && window.innerHeight >= canvas.height) {
        // canvas.style.width = "600px";
        // canvas.style.height = "800px";
    } else {
        const scale = Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height);
        canvas.style.width = `${canvas.width * scale}px`;
        canvas.style.height = `${canvas.height * scale}px`;
    }
}

// adjustCanvasSize();
// window.addEventListener("resize", adjustCanvasSize);

const gravity = 0.5
const friction = 0.85
const restitution = 0.8

let tempFruit = new Fruit()
const fruits = []

let highOverTime = 0

let frameInterval = null

function Play() {
    ctxInit()
    Score.initScoreBoard()
    descript()
    startFrameInterval()
    startUserInput()
}

function ctxInit() {
    ctx.lineWidth = 2
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
}

function descript() {
    let div = document.createElement("div")
    div.innerText = "점수 누르면 새로고침 가능"

    document.body.appendChild(div)
}

function highOverCheck() {
    let highOver = false
    let high = canvas.height / 8
    for (let i = 0; i < fruits.length; i++) {
        if (fruits[i].y - fruits[i].radius < high) {
            highOver = true
            break
        }
    }
    if (highOver) {
        highOverTime++
        if (highOverTime >= 60 && highOverTime < 60 * 6) {
            ctx.beginPath()
            ctx.moveTo(0, high)
            ctx.lineTo(canvas.width, high)
            ctx.stroke()
        } else if (highOverTime >= 60 * 6) {
            gameOver()
        }
    } else {
        highOverTime = 0
    }
}

function gameOver() {
    clearFrameInterval()
    stopUserInput()
    ctx.fillStyle = "white"
    ctx.fillRect(0, canvas.height / 3, canvas.width, canvas.height / 3)
    ctx.strokeRect(0, canvas.height / 3, canvas.width, canvas.height / 3)
    ctx.font = "60px gothic"
    ctx.fillStyle = "black"
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 35)
    ctx.font = "30px gothic"
    ctx.fillText(`Best score: ${Math.floor(Score.bestScore)}점`, canvas.width / 2, canvas.height / 2 + 35)
    ctx.fillText(`Your score: ${Math.floor(Score.score)}점`, canvas.width / 2, canvas.height / 2 + 70)
    Score.setScore()
}

function frame() {
    ctx.fillStyle = "rgb(240, 220, 205)"//"#F0DCCD"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    tempFruit.drawPlusLine(ctx, canvas.height)
    Fruit.collisionCheck(fruits, canvas.width, canvas.height, restitution)
    for (let i = 0; i < fruits.length; i++) {
        fruits[i].update(ctx, gravity, friction, canvas.width, canvas.height)
    }

    highOverCheck()
    Score.mergeCombo = 0
}

function startFrameInterval() {
    frameInterval = setInterval(frame.bind(this), 1000 / 60);
}

function clearFrameInterval() {
    clearInterval(frameInterval)
}

function handleKeyDown(e) {
    if (e.key == "q") {
        clearFrameInterval()
    }
}

function handleMouseDown(e) {
    fruits.push(tempFruit)
    tempFruit = new Fruit(Fruit.randomFruit(fruits), e.offsetX)
}
function handleMouseMove(e) {
    if (e.offsetX >= tempFruit.radius && e.offsetX <= canvas.width - tempFruit.radius) {
        tempFruit.x = e.offsetX
    }
}

function handleTouchEnd(e) {
    fruits.push(tempFruit)
    tempFruit = new Fruit(Fruit.randomFruit(fruits), e.touches[0].clientX)
}
function handleTouchMove(e) {
    if (e.touches[0].clientX >= tempFruit.radius && e.touches[0].clientX <= canvas.width - tempFruit.radius) {
        tempFruit.x = e.touches[0].clientX
    }
}

function startUserInput() {
    document.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchend", handleTouchEnd)
    canvas.addEventListener("touchmove", handleTouchMove)
}
function stopUserInput() {
    document.removeEventListener("keydown", handleKeyDown)
    canvas.removeEventListener("mousedown", handleMouseDown)
    canvas.removeEventListener("mousemove", handleMouseMove)
    canvas.removeEventListener("touchend", handleTouchEnd)
    canvas.removeEventListener("touchmove", handleTouchMove)
}


window.onload = () => {
    Play()
}
