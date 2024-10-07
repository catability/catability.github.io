import { Score } from "./score.js"

const Fruits = [
    { name: "체리", color: "#F00A0A", radius: 25 },
    { name: "딸기", color: "#FF6E4B", radius: 31 },
    { name: "포도", color: "#A06EFF", radius: 39 },
    { name: "한라봉", color: "#FAB400", radius: 48 },
    { name: "감", color: "#FF8714", radius: 58 },
    { name: "사과", color: "#F51414", radius: 70 },
    { name: "배", color: "#FAF07D", radius: 85 },
    { name: "복숭아", color: "#FFC8BE", radius: 101 },
    { name: "파인애플", color: "#F0E60A", radius: 119 },
    { name: "멜론", color: "#B9EB82", radius: 139 },
    { name: "수박", color: "#4BB40F", radius: 160 },
]

export class Fruit {
    constructor(id = 0, x = 300, y = 100, dx = 0, dy = 0) {
        this.id = id

        this.name = Fruits[this.id].name
        this.color = Fruits[this.id].color
        this.radius = Fruits[this.id].radius

        this.x = x
        this.y = y

        this.dx = dx
        this.dy = dy

        this.collisionCount = 0
    }

    update(ctx, gravity, friction, canvasWidth, canvasHeight) {
        this.acc(gravity, friction, canvasWidth, canvasHeight)
        this.draw(ctx)
    }

    vector() {
        return Math.sqrt(this.dx * this.dx + this.dy * this.dy)
    }

    theta() {
        return Math.atan2(this.dy, this.dx)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.stroke()

        ctx.font = `${this.radius / 2}px gothic`
        ctx.fillStyle = "black"
        ctx.fillText(this.name, this.x, this.y)
    }

    drawPlusLine(ctx, canvasHeight) {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, canvasHeight)
        ctx.stroke()

        this.draw(ctx)
    }

    acc(gravity, friction, canvasWidth, canvasHeight) {
        if (this.collisionCount <= 2) {
            this.dy += gravity
        } else {
            this.dx = 0
            this.dy = 0
        }

        if (this.dy < 0) {
            this.dy = 0
        }

        let posX = this.x + this.dx
        let posY = this.y + this.dy

        if (posX > canvasWidth - this.radius) {
            this.x = canvasWidth - this.radius
            this.dx = -this.dx
        } else if (posX < this.radius) {
            this.x = this.radius
            this.dx = -this.dx
        }
        if (posY >= canvasHeight - this.radius) {
            this.dx *= friction
            this.y = canvasHeight - this.radius
            this.dy = 0
        }

        this.x += this.dx
        this.y += this.dy

        this.collisionCount = 0
    }

    static randomFruit(fruits) {
        let num = Math.floor(fruits.length / 5)
        let random = Math.min(Math.floor(Math.random() * (num + 2)), 4)
        return random
    }

    static collisionCheck(fruits, canvasWidth, canvasHeight, restitution) {
        for (let i = 0; i < fruits.length - 1; i++) {
            let f1 = fruits[i]
            if (f1.x >= canvasWidth - f1.radius || f1.x <= f1.radius) {
                f1.collisionCount++
            }
            if (f1.y >= canvasHeight - f1.radius) {
                f1.collisionCount++
            }

            for (let j = i + 1; j < fruits.length; j++) {
                let f2 = fruits[j]
                let d2 = Math.pow(f1.x - f2.x, 2) + Math.pow(f1.y - f2.y, 2)

                if (d2 < Math.pow(f1.radius + f2.radius, 2)) {
                    if (f1.id == f2.id) {
                        Fruit.mergeFruits(fruits, i, j)
                        continue
                    }

                    f1.collisionCount++
                    f2.collisionCount++

                    let d = Math.sqrt(d2)
                    let overlap = f1.radius + f2.radius - d
                    let normalX = (f1.x - f2.x) / d
                    let normalY = (f1.y - f2.y) / d

                    f1.x += overlap * normalX * 0.5
                    f1.y += overlap * normalY * 0.5
                    f2.x -= overlap * normalX * 0.5
                    f2.y -= overlap * normalY * 0.5

                    if (f1.x == f2.x) {
                        if (f1.y > f2.y) {
                            f1.x += 0.2
                            f2.x -= 0.2
                        } else {
                            f1.x -= 0.2
                            f2.x += 0.2
                        }
                    }

                    let radian = Math.atan2(f1.y - f2.y, f1.x - f2.x)

                    let v1 = f1.vector()
                    let v2 = f2.vector()
                    let t1 = f1.theta()
                    let t2 = f2.theta()

                    let dx1 = (2 * v2 * Math.cos(t2 - radian)) / 2 * Math.cos(radian) + v1 * Math.sin(t1 - radian) * Math.cos(radian + Math.PI / 2) * restitution
                    let dy1 = (2 * v2 * Math.cos(t2 - radian)) / 2 * Math.sin(radian) + v1 * Math.sin(t1 - radian) * Math.sin(radian + Math.PI / 2) * restitution
                    let dx2 = (2 * v1 * Math.cos(t1 - radian)) / 2 * Math.cos(radian) + v2 * Math.sin(t2 - radian) * Math.cos(radian + Math.PI / 2) * restitution
                    let dy2 = (2 * v1 * Math.cos(t1 - radian)) / 2 * Math.sin(radian) + v2 * Math.sin(t2 - radian) * Math.sin(radian + Math.PI / 2) * restitution

                    f1.dx = dx1
                    f1.dy = dy1
                    f2.dx = dx2
                    f2.dy = dy2
                }
            }
        }
    }

    static mergeFruits(fruits, i, j) {
        let f1 = fruits[i]
        let f2 = fruits[j]

        Score.scoreUpdate(f1.radius / 10)

        let id = Math.min(f1.id + 1, Fruits.length - 1)

        let nx = (f1.x + f2.x) / 2
        let ny = (f1.y + f2.y) / 2
        let ndx = f1.dx + f2.dx
        let ndy = f1.dy + f2.dy

        fruits[i] = new Fruit(id, nx, ny, ndx, ndy)
        fruits.splice(j, 1)
    }
}
