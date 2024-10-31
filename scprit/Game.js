class Game {
    constructor() {
        this.loadHTMLElements()
        this.bestScore = Cookie.get("best-score") ? parseInt(Cookie.get("best-score")) : 0
        this.$bestScore.innerText = this.bestScore

        this.$userName.innerText = Cookie.get("user")

        this.NUM_OF_CARDS = 12
        this.score = 0
        this.$score.innerText = "Punts: " + this.score

        this.createBoard()
    }

    loadHTMLElements() {
        this.$bestScore = document.getElementById("best-score")
        this.$userName = document.getElementById("user-name")
        this.$score = document.getElementById("score")
        this.$board = document.getElementById("board")
    }

    createBoard() {
        this.board = this.generateRandomBoard()
        this.foundCards = 0

        console.log(this.board)
        for (let i=0;i<this.NUM_OF_CARDS;i++) {
            const $card = document.createElement("button")
            const $img = document.createElement("img")
            $img.src = `../img/cards/card-${this.board[i]}.png`

            $card.appendChild($img)

            $card.addEventListener("click", () => {
                console.log(this.board[i])
                
                if (this.selectedCard && this.selectedCard.el != $card) {
                    if (this.board[this.selectedCard.index] == this.board[i]) {
                        this.increaseScore()
                        this.selectedCard.el.disabled = true
                        $card.disabled = true
                    } else this.deceaseScore()

                    this.selectedCard = null
                } else this.selectedCard = {el: $card, index: i}
            })
            
            this.$board.appendChild($card)
        }
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

    increaseScore() {
        if (this.foundCards == this.NUM_OF_CARDS) {
            alert("Has guanyat!!")
            return
        }
        this.$score.innerText = ++this.score
        ++this.foundCards
    }

    deceaseScore() {
        this.$score.innerText = --this.score
    }
}

new Game()