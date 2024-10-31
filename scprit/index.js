const scoreContainer = document.getElementById("score")
const score = Cookie.get("score")

if (score) {
    scoreContainer.innerText = `Nom: ${Cookie.get("user")} Puntuació: ${score} Estat: ${Cookie.get("state")}`
}

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
        Cookie.delete("user")
        Cookie.delete("score")
        Cookie.delete("state")
    }
})