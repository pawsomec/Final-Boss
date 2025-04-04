import { AttackIndicatorManager } from "./AttackIndicatorManager";
import { GameElement } from "./GameElement";
import { PlayerArea } from "./PlayerArea";

/*

A player spot makes up the ground of the game
- Controls where player can go
- Includes starting an attack + making attack indicator
*/

export class PlayerSpot extends GameElement {
    public playerArea: PlayerArea; // Public so heart attack can access the playerArea
    private attackIndicatorManager: AttackIndicatorManager;

    public row: number;
    public column: number;
    public xOffset: number = 0;
    public yOffset: number = 0;
    
    public disabled: boolean = false;
    public bossDamager: boolean = false;

    private attackTimes: {time: number, amount: number, disable: boolean}[] = [];
    public damage: number = 0;

    constructor(canvas: HTMLCanvasElement, playerArea: PlayerArea, row: number, column: number, attackIndicatorManager: AttackIndicatorManager) {
        super(canvas)
        this.playerArea = playerArea
        this.attackIndicatorManager = attackIndicatorManager

        this.row = row
        this.column = column
    }

    // Calculate position; size is already defined in the player area object
    calculateSize() {
        this.xOffset = this.playerArea.playerSpotsXOffset + (this.playerArea.playerSpotWidth * this.column) // Player spots x offset + width*column = position
        this.yOffset = this.playerArea.playerSpotsYOffset + (this.playerArea.playerSpotHeight * this.row)
    }

    startAttack(start: number, length: number, damagePercent: number, disable: boolean = false) {
        if (this.disabled) { return } // Don't do attacks if disabled
        this.attackIndicatorManager.createAttackIndicator(this.xOffset, this.yOffset, start, length)
        this.attackTimes.push({time: start + length, amount: damagePercent, disable: disable}) // Add time to attack time array
        this.attackTimes.sort((a, b) => a.time - b.time) // Sort the array so its in numerical order; earlier attacks first
    }
    
    draw(t: number) {  
        if (this.disabled) { // Don't draw + remove any attacks 
            this.attackTimes = []
            if (this.bossDamager) {
                this.bossDamager = false // Get a new boss damager spot since player can no longer access this tile
                this.playerArea.selectBossDamagerSpot(t)
            }
            return 
        } 

        this.damage = 0
        for (let i=0; i<this.attackTimes.length; i++) {
            const attack = this.attackTimes[i]
            if (t >= attack.time) {
                this.damage += attack.amount
                this.disabled = attack.disable
                this.attackTimes.shift() // Remove time from array (attacking for time right now)
            } else {
                break // Exit for loop after one time not being passed because the other times are known to have not been passed
            }
        }  
        
        const fillInColumnGap = ( // Fill in the column gap if:
            this.column !== this.playerArea.columns-1 && // There is a spot to the right
            this.playerArea.spots[this.column+1]?.[this.row]?.disabled === false // The spot to the right of it is not disabled (there is a spot to the right)
        )
        const fillInRowGap = ( // Fill in the row gap if:
            this.row !== this.playerArea.rows-1 || // There is a spot below
            this.playerArea.spots[this.column]?.[this.row+1]?.disabled === false // The spot below is not disabled (there is a spot below)
        )
        
        this.ctx.fillStyle = this.bossDamager ? "purple" : "gray" // Change color if standing on it damages the boss
        this.ctx.fillRect(
            this.xOffset,
            this.yOffset,
            this.playerArea.playerSpotWidth + (fillInColumnGap ? 1 : 0), // Extend the squares to get rid of annoyingly small lines in between the tiles that exist for some reason between
            this.playerArea.playerSpotHeight + (fillInRowGap ? 1 : 0) // It doesn't change the squares on the edges where you would see it extend past the game area.  Could be removed later, or changed to a better method.
        )
    }
}