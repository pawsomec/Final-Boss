/*

Contains code for the player
- Setting the utils player variable to this
- Movement
    - Keys to movement
- Drawing the character
    - Calculating damage
    - Drawing (maybe temporary) health indicator

*/

import { GameElement } from "./GameElement"
import { PlayerArea } from "./PlayerArea"
import { keysdown, setPlayer } from "./utils";

export class Player extends GameElement {
    private playerArea: PlayerArea;

    // Player variables
    public x: number = 0;
    public y: number = 0;

    public healthPercent: number = 1;
    public changeHealth: number = 0; // This number will be added to the health percent by a player function that will allow the invincibility frames to work with other objects (most notably the heart attack)

    // Movement
    private xHeldAmount: number = 0; // If a direction is held for long enough, sprint through it
    private yHeldAmount: number = 0;
    private lastDirection: [number, number] = [0,0]; // Store last direction for above variable
    
    // Health
    private invincibilityTime: number = 0; // NOTE: The invincibility frames will end a little before the actual invincibility time ends just to give the player extra leeway 
    private invincibilityFrameAnimationOpacity: number = .2; // Fade the opacity 
    private invincibilityFrameAnimationTime: number = 0; // Keep track of fading the opacity at a constant rate 
    private invincibilityFrameAnimationSpeed: number = 5; // About how much time should pass before changing opacity 
    private invincibilityFrameAnimationDirection: boolean = false; // False = increasing, true = decreasing opacity 
    private static totalInvincibilityTime = 3000;


    constructor(canvas: HTMLCanvasElement, playerArea: PlayerArea) {
        super(canvas)

        this.playerArea = playerArea
        setPlayer(this)
    }

    moveFromKeys(keys: Array<string>) {
        const lastPosition = [this.x, this.y] // Store last position in case we need to go back to it
        // Get user input
        let directions: [number, number] = [0, 0] // What directions to move in

        keys.forEach((k) => {
            const currentKey = k
            switch (currentKey) {
                case "a":
                    directions[0] -= 1
                    break;
                case "d":
                    directions[0] += 1
                    break;
                case "w":
                    directions[1] -= 1
                    break;
                case "s":
                    directions[1] += 1
                    break;
            }

        })
        
        if (directions[0] === this.lastDirection[0]) {
            this.xHeldAmount += 1

            if (this.xHeldAmount > 15 && this.xHeldAmount % 3 === 0) { // Continue moving quickly if key is held
                this.x += directions[0]
            }
        } else {
            this.xHeldAmount = 0
            this.lastDirection[0] = directions[0]

            this.x += directions[0]
        }

        if (directions[1] === this.lastDirection[1]) {
            this.yHeldAmount += 1

            if (this.yHeldAmount > 15 && this.yHeldAmount % 3 === 0) { // Continue moving quickly if key is held
                this.y += directions[1]
            }
        } else {
            this.yHeldAmount = 0
            this.lastDirection[1] = directions[1]

            this.y += directions[1]
        }

        if (this.x > this.playerArea.columns - 1) {
            this.x -= 1
        } else if (this.x < 0) {
            this.x += 1
        }

        if (this.y > this.playerArea.rows - 1) {
            this.y -= 1
        } else if (this.y < 0) {
            this.y += 1
        }

        const currentSpot = this.playerArea.spots[this.x][this.y]
        if (currentSpot.disabled) {
            this.x = lastPosition[0]
            this.y = lastPosition[1]
            
            const newSpot = this.playerArea.spots[this.x][this.y]
            if (newSpot.disabled) { // Go to the first enabled spot
                const spot = this.playerArea.getEnabledSpots()[0]
                this.x = spot.column
                this.y = spot.row
            }
        }
    }

    calculateDamage(t: number): boolean {
        // If invincibility frames, don't take damage
        if (t - this.invincibilityTime < Player.totalInvincibilityTime) { 
            // The player will not take damage
            // Stop the animation a little earlier so the player will have time to react to invincibility ending
            if (t - this.invincibilityTime > Player.totalInvincibilityTime * .6) {
                return false // Don't do animation
            }
            return true // Do animation
        }
        const spotDamageAmount = this.playerArea.spots[this.x][this.y].damage
        // If damage > 0, do invincibility frames
        if (spotDamageAmount > 0 || this.changeHealth > 0) { this.invincibilityTime = t }

        this.healthPercent -= spotDamageAmount + this.changeHealth
        this.changeHealth = 0 // Reset change health
        
        if (this.healthPercent < 0) { this.healthPercent = 0 } // Make sure health percent doesn't go past 0
        if (this.healthPercent > 1) { this.healthPercent = 1 } // Make sure health percent doesn't go past 1
        
        return false
    }

    calculateSize() {
        // Nothing at the moment
        // Keeping the function in case its used in the future
    }

    draw(t: number) {
        // Calculate health first because sometimes moveFromKeys can move the player
        // For example, off from a tile right before it damages from a tile disabling attack
        const doInvincibilityFrames = this.calculateDamage(t)
        this.moveFromKeys(keysdown)

        // Check if standing on a boss damager
        if (this.playerArea.spots[this.x][this.y].bossDamager) {
            this.playerArea.stage.bossArea.boss.damage()
            this.playerArea.spots[this.x][this.y].bossDamager = false
            this.playerArea.selectBossDamagerSpot(t)
        }

        // Background of character is darker blue, and will be revealed as player takes damage
        this.ctx.fillStyle = "rgb(0, 0, 100, .2)"
        this.ctx.fillRect(
            this.playerArea.playerSpotsXOffset + this.playerArea.playerSpotWidth * this.x,
            this.playerArea.playerSpotsYOffset + this.playerArea.playerSpotHeight * this.y,
            this.playerArea.playerSpotWidth,
            this.playerArea.playerSpotHeight,
        )

        this.ctx.fillStyle = "blue"
        this.ctx.fillRect(
            this.playerArea.playerSpotsXOffset + this.playerArea.playerSpotWidth * this.x,
            this.playerArea.playerSpotsYOffset + this.playerArea.playerSpotHeight * this.y + this.playerArea.playerSpotHeight * (1-this.healthPercent), // Offset the character so it will always fill up tghe bottom even when shortened
            this.playerArea.playerSpotWidth,
            this.playerArea.playerSpotHeight * this.healthPercent,
        )

        // Invincibility frames
        if (!doInvincibilityFrames) { return }
        // Swap the on and off of the invincibiity frame animation
        if (t - this.invincibilityFrameAnimationTime >= this.invincibilityFrameAnimationSpeed) {
            // Change opacity if enough time has passed to make smooth fade effect
            let sign = -1
            if (!this.invincibilityFrameAnimationDirection) { sign = 1 }
            this.invincibilityFrameAnimationOpacity += .03 * sign

            // Swap the direction of the animation when 1 or 0 is reached
            if (this.invincibilityFrameAnimationOpacity >= .7 || this.invincibilityFrameAnimationOpacity <= .2) { this.invincibilityFrameAnimationDirection = !this.invincibilityFrameAnimationDirection }
            this.invincibilityFrameAnimationTime = t
        }


        this.ctx.fillStyle = "rgb(255,255,255," + this.invincibilityFrameAnimationOpacity + ")"
        this.ctx.fillRect(
            this.playerArea.playerSpotsXOffset + this.playerArea.playerSpotWidth * this.x,
            this.playerArea.playerSpotsYOffset + this.playerArea.playerSpotHeight * this.y,
            this.playerArea.playerSpotWidth,
            this.playerArea.playerSpotHeight,
        )
    }
}