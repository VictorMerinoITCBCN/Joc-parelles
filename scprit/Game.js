class Game {
    // Constructor de la clase Game: Inicializa los elementos HTML y variables del juego
    constructor() {
        this.loadHTMLElements()  // Carga elementos HTML necesarios para la interfaz
        // Obtiene el mejor puntaje guardado en cookies o lo establece en 0 si no existe
        this.bestScore = Cookie.get("best-score") ? parseInt(Cookie.get("best-score")) : 0
        this.$bestScore.innerText = "Best Score: " + this.bestScore  // Muestra el mejor puntaje

        this.$userName.innerText = Cookie.get("user")  // Muestra el nombre de usuario guardado en cookies

        // Inicializa las variables del juego
        this.NUM_OF_CARDS = 12       // Número de cartas en el tablero
        this.foundCards = 0          // Contador de cartas encontradas
        this.score = 0               // Puntuación inicial
        this.$score.innerText = "Punts: " + this.score  // Muestra la puntuación inicial

        this.scoreBroadcast = new BroadcastChannel("score")  // Canal para enviar la puntuación
        this.createBoard()  // Crea el tablero del juego

        // Abre una nueva ventana con las instrucciones del juego al hacer clic en el botón de información
        this.$info.addEventListener("click", () => window.open("rules.html", "Instruccions", "width=400, height=600"))
    }

    // Carga y guarda referencias a los elementos HTML necesarios
    loadHTMLElements() {
        this.$bestScore = document.getElementById("best-score")  // Elemento de mejor puntaje
        this.$userName = document.getElementById("user-name")    // Elemento de nombre de usuario
        this.$score = document.getElementById("score")           // Elemento de puntaje
        this.$board = document.getElementById("board")           // Elemento del tablero
        this.$info = document.getElementById("info-btn")         // Botón de información
    }

    // Crea el tablero del juego generando y mostrando las cartas
    createBoard() {
        this.board = this.generateRandomBoard()  // Genera una disposición aleatoria de cartas
        // Crea y agrega cada carta al tablero
        this.board.forEach((cardValue, index) => this.createCard(cardValue, index))
    }

    // Crea una carta en el tablero con una imagen y un evento de clic
    createCard(cardValue, index) {
        const $card = document.createElement("button")  // Botón de carta
        const $img = document.createElement("img")      // Imagen de carta
        $img.src = `../img/cards/card-${cardValue}.png` // Establece la imagen de la carta
        
        $card.className = "card"         // Clase CSS para estilizar la carta
        $card.appendChild($img)          // Añade la imagen a la carta
        $card.addEventListener("click", () => this.handleCardClick($card, index))  // Evento para manejar el clic en la carta
        this.$board.appendChild($card)   // Añade la carta al tablero
    }

    // Maneja el evento de clic en una carta
    handleCardClick($card, index) {
        // Si hay una carta seleccionada y es distinta de la actual, compara las cartas
        if (this.selectedCard && this.selectedCard.el !== $card) {
            this.selectCard($card)  // Selecciona la carta actual
            this.compareCards($card, index)  // Compara ambas cartas
            this.selectedCard = null  // Resetea la carta seleccionada
        } else { 
            // Si no hay otra carta seleccionada, selecciona la actual
            this.selectCard($card)
            this.selectedCard = { el: $card, index: index }
        }
    }

    // Compara dos cartas para ver si coinciden
    compareCards($card, index) {
        // Si las cartas coinciden, se desactivan y aumentan la puntuación y cartas encontradas
        if (this.board[this.selectedCard.index] === this.board[index]) {
            this.selectedCard.el.disabled = true  // Desactiva la carta seleccionada
            $card.disabled = true                 // Desactiva la carta actual
            this.foundCards++
            this.increaseScore()
        } else {  
            // Si no coinciden, reduce la puntuación y vuelve a ocultarlas tras un breve retraso
            this.decreaseScore()
            const $secondCard = this.selectedCard.el
            setTimeout(() => {
                this.unselectCard($card)
                this.unselectCard($secondCard)
            }, 1500)
        }
    }

    // Comprueba si el juego ha finalizado cuando se han encontrado todas las cartas
    isGameFinished() {
        return this.foundCards === this.NUM_OF_CARDS
    }

    // Selecciona una carta y agrega animación de "flip"
    selectCard(card) {
        card.classList.add("selected", "flip")
        setTimeout(() => card.classList.remove("flip"), 1000)
    }

    // Deselecciona una carta y agrega animación de "flip"
    unselectCard(card) {
        card.classList.remove("selected")
        card.classList.add("flip")
        setTimeout(() => card.classList.remove("flip"), 1000)
    }

    // Genera un tablero con pares de cartas en posiciones aleatorias
    generateRandomBoard() {
        const board = []
        // Agrega dos veces cada valor de carta (para formar pares)
        for (let i = 1; i <= 6; i++) {
            board.push(i)
            board.push(i)
        }
        // Mezcla el tablero de manera aleatoria
        board.sort(() => Math.random() - 0.5)
        return board
    }

    // Actualiza la puntuación en pantalla, la guarda en cookies y la transmite a través del canal
    updateScore() {
        Cookie.create("score", this.score)            // Guarda la puntuación en cookies
        this.scoreBroadcast.postMessage(this.score)   // Envía la puntuación por el canal de comunicación
        this.$score.innerText = this.score            // Actualiza el texto en el HTML
    }

    // Incrementa la puntuación, aumenta el contador de cartas encontradas y revisa si se ha terminado el juego
    increaseScore() {
        this.score++
        this.foundCards++
        this.updateScore()
        if (this.isGameFinished()) this.win()  // Si todas las cartas están encontradas, se gana el juego
    }

    // Disminuye la puntuación y la actualiza
    decreaseScore() {
        this.score--
        this.updateScore()
    }

    // Función que se ejecuta al ganar: muestra alerta, guarda mejor puntaje y finaliza el juego
    win() {
        alert("Has guanyat!!")  // Muestra alerta de victoria
        if (this.score > this.bestScore) Cookie.create("best-score", this.score)  // Guarda mejor puntaje si es mayor
        Cookie.create("state", "terminat")  // Cambia el estado del juego a "terminado" en cookies
    }
}

// Instancia un nuevo juego
new Game()
