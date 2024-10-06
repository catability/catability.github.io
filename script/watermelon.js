import { Fruit } from "./fruit"

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

        this.fruits = []
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

    getScore() {

    }
}

window.onload = () => {
    new App()
}
