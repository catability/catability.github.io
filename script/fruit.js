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
    constructor(id, x = 300, y = 100) {
        this.id = id

        this.name = Fruits[this.id].name
        this.color = Fruits[this.id].color
        this.radius = Fruits[this.id].radius

        this.x = x
        this.y = y

        this.dx = 0
        this.dy = 0

        this.collisionCount = 0
    }

    update(ctx, gravity, friction, restitution, canvasWidth, canvasHeight) {
        this.acc(gravity, friction, restitution, canvasWidth, canvasHeight)
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

    acc(gravity, friction, restitution, canvasWidth, canvasHeight) {

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

        if (posX > canvasWidth - this.r) {
            this.x = canvasWidth - this.r
            this.dx = -this.dx
        } else if (posX < this.r) {
            this.x = this.r
            this.dx = -this.dx
        }
        if (posY >= canvasHeight - this.r) {
            this.dx *= friction
            this.y = canvasHeight - this.r
            this.dy = 0
        }

        this.x += this.dx
        this.y += this.dy

        this.collisionCount = 0
    }
}
