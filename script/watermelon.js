import { Fruit } from "./fruit.js"
import { Score } from "./score.js"

export class App {
    constructor() {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.ctxInit()

        document.body.appendChild(this.canvas)

        window.addEventListener("resize", this.resize.bind(this))
        this.resize()

        this.gravity = 0.5
        this.friction = 0.85
        this.restitution = 0.8

        this.tempFruit = new Fruit()
        this.fruits = []
        this.highOverTime = 0

        this.frameInterval = null

        this.startFrameInterval()
        this.startUserInput()
    }

    ctxInit() {
        this.ctx.lineWidth = 2
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
    }

    resize() {
        this.canvas.width = 600
        this.canvas.height = 800
        this.canvas.style.margin = ` 10 ${(window.innerWidth - this.canvas.width) / 2 - 10}`
    }

    highOverCheck() {
        let highOver = false
        for (let i = 0; i < this.fruits.length; i++) {
            if (this.fruits[i].y - this.fruits[i].r < 100) {
                highOver = true
                break
            }
        }
        if (highOver) {
            this.highOverTime++
            if (this.highOverTime >= 60 && this.highOverTime < 60 * 6) {
                this.ctx.beginPath()
                this.ctx.moveTo(0, 100)
                this.ctx.lineTo(this.canvas.width, 100)
                this.ctx.stroke()
            } else if (this.highOverTime >= 60 * 6) {
                this.gameOver()
            }
        } else {
            this.highOverTime = 0
        }
    }

    gameOver() {
        this.clearFrameInterval()
        this.stopUserInput()
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(0, this.canvas.height / 3, this.canvas.width, this.canvas.height / 3)
        this.ctx.strokeRect(0, this.canvas.height / 3, this.canvas.width, this.canvas.height / 3)
        this.ctx.font = "60px gothic"
        this.ctx.fillStyle = "black"
        this.ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2 - 35)
        this.ctx.font = "30px gothic"
        this.ctx.fillText(`Best score: ${Math.floor(Score.bestScore)}점`, this.canvas.width / 2, this.canvas.height / 2 + 35)
        this.ctx.fillText(`Your score: ${Math.floor(Score.score)}점`, this.canvas.width / 2, this.canvas.height / 2 + 70)
        Score.setScore()
    }

    frame() {
        this.ctx.fillStyle = "#F0DCCD"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.tempFruit.drawPlusLine()
        Fruit.collisionCheck(this.fruits, this.canvas.width, this.canvas.height)
        for (let i = 0; i < this.fruits.length; i++) {
            this.fruits[i].update(this.ctx, this.gravity, this.friction, this.restitution, this.canvas.width, this.canvas.height)
        }

        this.highOverCheck()
        Score.mergeCombo = 0
    }

    startFrameInterval() {
        this.frameInterval = setInterval(this.frame, 1000 / 60);
    }

    clearFrameInterval() {
        clearInterval(this.frameInterval)
    }

    handleMouseDown(e) {
        this.fruits.push(this.tempFruit)
        this.tempFruit = new Fruit(Fruit.randomFruit(this.fruits), e.offsetX)
    }
    handleMouseMove(e) {
        if (e.offsetX >= this.tempFruit.r && e.offsetX <= this.canvas.width - this.tempFruit.r) {
            this.tempFruit.x = e.offsetX
        }
    }

    startUserInput() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown)
        this.canvas.addEventListener("mousemove", this.handleMouseMove)
    }
    stopUserInput() {
        this.canvas.removeEventListener("mousedown", this.handleMouseDown)
        this.canvas.removeEventListener("mousemove", this.handleMouseMove)
    }
}

window.onload = () => {
    new App()
}
