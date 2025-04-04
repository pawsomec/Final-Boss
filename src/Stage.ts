import { BossArea } from "./BossArea";
import { GameElement } from "./GameElement";
import { PlayerArea } from "./PlayerArea";

/*

Contains code for the stage
- Drawing stage square
- Managing player and boss area (creating, triggering draw+sizing functions)

*/

export class gameStage extends GameElement {
    public playerArea: PlayerArea;
    public bossArea: BossArea;
    
    // Stage variables
    public width: number = 0;
    public height: number = 0;
    public xOffset: number = 0;
    public yOffset: number = 0;
    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.playerArea = new PlayerArea(canvas, this) // Must come FIRST because bossArea depends on it (for boss attacking squares)
        this.bossArea = new BossArea(canvas, this)
    }

    // Calculated width + height based on which number is smaller
    calculateSize() {
        this.width = this.canvas.width; this.height = this.canvas.height
        if (this.height < this.width) { this.width = this.height }
        if (this.width < this.height) { this.height = this.width }
        this.xOffset = this.canvas.width/2 - this.width/2 // Center of screen - half of width = x pos of stage
        this.yOffset = this.canvas.height/2 - this.height/2 // Center of screen - half of height = y pos of stage

        this.bossArea.calculateSize() // Calculate the size of the boss and player areas, which will then calculate the player, spots, and boss sizes respectively
        this.playerArea.calculateSize()
    }

    // Draw stage, then draw the two areas, which will lead to the everything else being drawn
    draw(t: number) {
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height)

        this.playerArea.draw(t)
        this.bossArea.draw(t)
    }
}