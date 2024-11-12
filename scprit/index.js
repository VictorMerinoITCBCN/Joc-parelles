const scoreContainer = document.getElementById("score")
let score = Cookie.get("score")
let state = Cookie.get("state")
const updateGameInfo = () => {
    scoreContainer.innerText = `Nom: ${Cookie.get("user")} Puntuació: ${score} Estat: ${state}`
}

if (score) updateGameInfo()

const bestScore = Cookie.get("best-score")

if (bestScore) document.getElementById("best-score").innerText = bestScore

const navigatorInfoContainer = document.getElementById("navigator")
navigatorInfoContainer.innerText = navigator.appVersion

const urlInfoContainer = document.getElementById("url")
urlInfoContainer.innerText = location.origin

const startGameBtn = document.getElementById("start-game")
const eraseGameBtn = document.getElementById("erase-game")


let openedWindow
startGameBtn.addEventListener("click", () => {
    const playerName = document.getElementById("player-name").value
    if (!playerName) {
        alert("Has d'introduir un nom")
        return
    }
    
    if (openedWindow && !openedWindow.closed) {
        alert("Ja existeix una partida")
        return
    }

    openedWindow = window.open("/game.html", "game")
    Cookie.create("user", playerName)
    Cookie.create("score", 0)
    Cookie.create("state", "En joc")
})

eraseGameBtn.addEventListener("click", () => {
    if (openedWindow) {
        openedWindow.close()
    }
    Cookie.delete("user")
    Cookie.delete("score")
    Cookie.delete("state")
    scoreContainer.innerText = "No hi ha cap partida en joc"
})

const broadcastChannel = new BroadcastChannel("score")
broadcastChannel.onmessage = (e) => {
    score = e.data
    state = Cookie.get("state")
    updateGameInfo()
}