import { AttackIndicatorManager } from "./AttackIndicatorManager";
import { GameArea } from "./GameArea";
import { Player } from "./Player";
import { PlayerSpot } from "./PlayerSpot";
import { gameStage } from "./Stage";

/*

Creates and controls the player area (bottom half of stage)
- Creates and draws spots
- Creates and draws player
- Draws attack indicators (above player)
*/

export class PlayerArea extends GameArea {
    //
    public player: Player;

    private needToSelectDamagerSpot: number = 0 // -1 = don't need too, anything else = tValue to select it
    // Spots variables
    public spots: PlayerSpot[][] = [];
    public rows: number = 4;
    public columns: number = 9;
    public playerSpotWidth: number = 0;
    public playerSpotHeight: number = 0;
    public playerSpotsXOffset: number = 0;
    public playerSpotsYOffset: number = 0;

    public attackIndicatorManager: AttackIndicatorManager;

    constructor(canvas: HTMLCanvasElement, stage: gameStage) {
        super(canvas, stage)

        this.player = new Player(canvas, this)
        
        this.attackIndicatorManager = new AttackIndicatorManager(canvas, this)

        this.createSpots()
    }
    
    createSpots() {
        this.spots = []
        for (let c=0; c<this.columns; c++) { // Format the spots array to be [column][row], also like saying [x][y]
            this.spots[c] = []
            for (let r=0; r<this.rows; r++) {
                this.spots[c][r] = new PlayerSpot(this.canvas, this, r, c, this.attackIndicatorManager)
            }
        }
    }

    getEnabledSpots(ignorePlayerOccupiedSpots: boolean = false): PlayerSpot[] {
        let list: PlayerSpot[] = []
        for (let c=0; c<this.spots.length; c++) { // Format the spots array to be [column][row], also like saying [x][y]
            let column = this.spots[c]
            for (let r=0; r<column.length; r++) {
                let spot = this.spots[c][r]
                if (!spot.disabled &&
                    ( // If should ignore player occupied spots, if the player is on a spot don't include it
                        !ignorePlayerOccupiedSpots || (spot.column !== this.player.x && spot.row !== this.player.y)
                    )
                ) {
                    list.push(spot)
                }
            }
        }
        return list
    }

    getRandomEnabledSpot(ignorePlayerOccupiedSpots: boolean = false) {
        const possibleSpots = this.getEnabledSpots(ignorePlayerOccupiedSpots)
        return possibleSpots[Math.floor(Math.random() * possibleSpots.length)]
    }

    selectBossDamagerSpot(t: number) {
        this.needToSelectDamagerSpot = t + 2000 // Wait a couple seconds before appearing again
    }

    calculateSize() {
        this.width = this.stage.width
        this.height = this.stage.height/2
        this.xOffset = this.stage.xOffset
        this.yOffset = this.stage.yOffset + this.stage.height/2 // Player area is on the bottom half of the stage

        // Calculate spots sizing and position
        this.playerSpotWidth = this.width/this.columns // Spots are in square grid pattern, find out whether using the row or column max size is smaller and won't overflow
        this.playerSpotHeight = this.height/this.rows
        if (this.playerSpotHeight < this.playerSpotWidth) { this.playerSpotWidth = this.playerSpotHeight }
        if (this.playerSpotWidth < this.playerSpotHeight) { this.playerSpotHeight = this.playerSpotWidth }
        this.playerSpotsXOffset = this.xOffset + this.width/2 - (this.playerSpotWidth * this.columns)/2 // Center of stage - column size = offset
        this.playerSpotsYOffset = this.yOffset + this.height/2 - (this.playerSpotHeight * this.rows)/2

        for (let c=0; c<this.spots.length; c++) {
            for (let r=0; r<this.spots[c].length; r++) {
                const currentSpot = this.spots[c][r]
                currentSpot.calculateSize()
            }
        }

        // Tell the player to calculate size
        this.player.calculateSize()
    }

    // Draw stage and spots
    draw(t: number) {
        this.ctx.fillStyle = "green"
        this.ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height)

        // Spots
        // Select new damager spot if needed
        if (this.needToSelectDamagerSpot !== -1 && t > this.needToSelectDamagerSpot) {
            const spot = this.getRandomEnabledSpot(true)
            spot.bossDamager = true
            this.needToSelectDamagerSpot = -1
        }

        for (let c=0; c<this.spots.length; c++) {
            for (let r=0; r<this.spots[c].length; r++) {
                const currentSpot = this.spots[c][r]
                currentSpot.draw(t)
            }
        }

        // Player
        this.player.draw(t)

        // Attack indicators
        this.attackIndicatorManager.draw(t)
    }
}