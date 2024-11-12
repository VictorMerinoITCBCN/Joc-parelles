class Game {
    constructor() {
        this.loadHTMLElements()
        this.bestScore = Cookie.get("best-score") ? parseInt(Cookie.get("best-score")) : 0
        this.$bestScore.innerText = "Best Score: " + this.bestScore

        this.$userName.innerText = Cookie.get("user")

        this.NUM_OF_CARDS = 12
        this.foundCards = 0
        this.score = 0
        this.$score.innerText = "Punts: " + this.score

        this.scoreBroadcast = new BroadcastChannel("score")
        this.createBoard()
        this.$info.addEventListener("click", () => window.open("rules.html", "Instruccions", "width=400, height=600"))
    }

    loadHTMLElements() {
        this.$bestScore = document.getElementById("best-score")
        this.$userName = document.getElementById("user-name")
        this.$score = document.getElementById("score")
        this.$board = document.getElementById("board")
        this.$info = document.getElementById("info-btn")
    }

    createBoard() {
        this.board = this.generateRandomBoard()
        this.board.forEach((cardValue, index) => this.createCard(cardValue, index))
    }

    createCard(cardValue, index) {
        const $card = document.createElement("button")
        const $img = document.createElement("img")
        $img.src = `../img/cards/card-${cardValue}.png`
        
        $card.className = "card"
        $card.appendChild($img)
        $card.addEventListener("click", () => this.handleCardClick($card, index))
        this.$board.appendChild($card)
    }

    handleCardClick($card, index) {
        if (this.selectedCard && this.selectedCard.el !== $card) {
            this.selectCard($card)
            this.compareCards($card, index)
            this.selectedCard = null
        } else {
            this.selectCard($card)
            this.selectedCard = { el: $card, index: index }
        }
    }

    compareCards($card, index) {
        if (this.board[this.selectedCard.index] === this.board[index]) {
            this.selectedCard.el.disabled = true
            $card.disabled = true
            this.foundCards++
            this.increaseScore()
        } else {
            this.decreaseScore()
            const $secondCard = this.selectedCard.el
            setTimeout(() => {
                this.unselectCard($card, false)
                this.unselectCard($secondCard, false)
            }, 1500)
        }
    }

    isGameFinished() {
        return this.foundCards === this.NUM_OF_CARDS
    }

    selectCard(card) {
        card.classList.add("selected", "flip")
        setTimeout(() => card.classList.remove("flip"), 1000)
    }
    unselectCard(card) {
        card.classList.remove("selected")
        card.classList.add("flip")
        setTimeout(() => card.classList.remove("flip"), 1000)
    }

    generateRandomBoard() {
        const board = []

        for (let i=1; i<=6;i++) {
            board.push(i)
            board.push(i)
        }

        board.sort(() => Math.random() - 0.5)

        return board
    }

    updateScore() {
        Cookie.create("score", this.score)
        this.scoreBroadcast.postMessage(this.score)
        this.$score.innerText = this.score
    }

    increaseScore() {
        this.score++
        this.foundCards++
        
        this.updateScore()
        if (this.isGameFinished()) this.win()
    }

    decreaseScore() {
        this.score--
        this.updateScore()
    }

    win() {
        alert("Has guanyat!!")
        if (this.score > this.bestScore) Cookie.create("best-score", this.score)
        Cookie.create("state", "terminat")
        
    }
}

new Game()