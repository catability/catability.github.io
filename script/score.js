export const Score = {
    bestScore: 0,
    score: 0,
    mergeCombo: 0,
    scoreBoard: null,

    initScoreBoard() {
        this.scoreBoard = document.createElement("div")
        document.body.prepend(this.scoreBoard)
        this.scoreBoard.innerText = `${Math.floor(this.score)}점`

        this.scoreBoard.addEventListener("click", () => {
            window.location.reload()
        })
    },

    getScore() {
        let temp = localStorage.getItem("watermelon")
        if (temp) {
            this.bestScore = temp
        } else {
            localStorage.setItem("watermelon", 0)
        }
    },

    setScore() {
        if (this.score > this.bestScore) {
            localStorage.setItem("watermelon", this.score)
        }
    },

    scoreUpdate(plusScore) {
        this.mergeCombo++
        this.score += (plusScore * plusScore + this.mergeCombo)
        this.scoreBoard.innerText = `${Math.floor(this.score)}점`
    },
}