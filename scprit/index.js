// Selecciona el contenedor HTML para mostrar la puntuación del usuario
const scoreContainer = document.getElementById("score")

// Obtiene el valor actual de "score" y "state" de las cookies
let score = Cookie.get("score")
let state = Cookie.get("state")

// Define una función para actualizar la información de la partida en pantalla
const updateGameInfo = () => {
    scoreContainer.innerText = `Nom: ${Cookie.get("user")} Puntuació: ${score} Estat: ${state}`
}

// Si existe un valor de puntuación en las cookies, actualiza la información del juego en pantalla
if (score) updateGameInfo()

// Obtiene el mejor puntaje de las cookies y lo muestra si existe
const bestScore = Cookie.get("best-score")
if (bestScore) document.getElementById("best-score").innerText = bestScore

// Muestra la versión del navegador en un contenedor específico
const navigatorInfoContainer = document.getElementById("navigator")
navigatorInfoContainer.innerText = navigator.appVersion

// Muestra el origen (URL base) del sitio en un contenedor específico
const urlInfoContainer = document.getElementById("url")
urlInfoContainer.innerText = location.origin

// Selecciona los botones de inicio y borrado de partida
const startGameBtn = document.getElementById("start-game")
const eraseGameBtn = document.getElementById("erase-game")

// Variable para manejar la ventana de juego abierta
let openedWindow

// Configura el evento de clic en el botón de inicio de partida
startGameBtn.addEventListener("click", () => {
    // Obtiene el nombre del jugador introducido en el campo de entrada
    const playerName = document.getElementById("player-name").value
    if (!playerName) {
        alert("Has d'introduir un nom")  // Muestra una alerta si el nombre está vacío
        return
    }
    
    // Evita abrir una nueva partida si ya hay una abierta
    if (openedWindow && !openedWindow.closed) {
        alert("Ja existeix una partida")
        return
    }

    // Abre una nueva ventana para el juego y guarda el estado inicial en cookies
    openedWindow = window.open("/game.html", "game")
    Cookie.create("user", playerName)    // Guarda el nombre de usuario
    Cookie.create("score", 0)            // Inicializa la puntuación en 0
    Cookie.create("state", "En joc")     // Guarda el estado como "En joc" (en juego)
})

// Configura el evento de clic en el botón para borrar la partida
eraseGameBtn.addEventListener("click", () => {
    // Cierra la ventana de juego si está abierta
    if (openedWindow) {
        openedWindow.close()
    }
    // Elimina las cookies relacionadas con el usuario y la partida
    Cookie.delete("user")
    Cookie.delete("score")
    Cookie.delete("state")
    // Muestra en pantalla que no hay ninguna partida en curso
    scoreContainer.innerText = "No hi ha cap partida en joc"
})

// Configura un canal de comunicación para recibir mensajes de actualización de puntuación
const broadcastChannel = new BroadcastChannel("score")
broadcastChannel.onmessage = (e) => {
    // Actualiza la puntuación con el valor recibido
    score = e.data
    // Recupera el estado de la partida de las cookies
    state = Cookie.get("state")
    // Actualiza la información de la partida en pantalla
    updateGameInfo()
}
