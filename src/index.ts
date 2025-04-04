import { Game } from './Game'
import './index.css'
import { listenForKeys } from './utils'

// Create game
const newGame = new Game(document.body) // Also sets up all other objects

// Start getting keys
listenForKeys()

function renderFrame(t: number) {
    newGame.draw(t)

    window.requestAnimationFrame(renderFrame)
}
renderFrame(0)