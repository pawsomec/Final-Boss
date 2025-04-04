import { Player } from "./Player"

export let keysdown: Array<string> = []
export function listenForKeys() {
    window.addEventListener("keydown", (e) => { // Add the key to the keysdown array if it isn't already in the array
        const k = e.key
        if (keysdown.includes(k)) { return }
        keysdown.unshift(e.key) 
    }) 
    window.addEventListener("keyup", (e) => {
        const k = e.key
        const kIndex = keysdown.indexOf(k)
        if (kIndex === -1) { return } // Key isn't in array for some reason
        keysdown.splice(kIndex) // Remove key from array
    })
}
export let playerObject: Player // Store the player object here so other scripts can access it
export function setPlayer(p: Player) { // Allow the player object to set itself to the player variable
    playerObject = p
}