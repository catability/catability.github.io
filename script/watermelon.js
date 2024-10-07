import { Fruit } from "./fruit.js"
import { Score } from "./score.js"

const canvas = document.createElement("canvas")
document.body.appendChild(canvas)

const ctx = canvas.getContext("2d")
ctxInit()

window.addEventListener("resize", resize)
resize()

const gravity = 0.5
const friction = 0.85
const restitution = 0.8

let tempFruit = new Fruit()
const fruits = []

let highOverTime = 0

let frameInterval = null

function Play() {
    Score.initScoreBoard()
    startFrameInterval()
    startUserInput()
}

function ctxInit() {
    ctx.lineWidth = 2
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
}

function resize() {
    canvas.width = 600
    canvas.height = 800
    canvas.style.margin = `0 ${(window.innerWidth - canvas.width) / 2 - 10}`
}

function highOverCheck() {
    let highOver = false
    for (let i = 0; i < fruits.length; i++) {
        if (fruits[i].y - fruits[i].radius < 100) {
            highOver = true
            break
        }
    }
    if (highOver) {
        highOverTime++
        if (highOverTime >= 60 && highOverTime < 60 * 6) {
            ctx.beginPath()
            ctx.moveTo(0, 100)
            ctx.lineTo(canvas.width, 100)
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

function startUserInput() {
    document.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleMouseMove)
}
function stopUserInput() {
    document.removeEventListener("keydown", handleKeyDown)
    canvas.removeEventListener("mousedown", handleMouseDown)
    canvas.removeEventListener("mousemove", handleMouseMove)
}


window.onload = () => {
    Play()
}
