import { GameElement } from "./GameElement";
import { PlayerArea } from "./PlayerArea";

/*

An attack indicator attatched to a spot that signals when an attack will occur
- One draw function

*/

export class AttackIndicator extends GameElement {

    public completed: number = 0;

    private x: number;
    private y: number;
    private start: number;
    private length: number;
    private totalTime: number = 0;

    private playerArea: PlayerArea; // Used to get the width of a spot
    constructor(canvas: HTMLCanvasElement, x: number, y:number, start: number, length: number, playerArea: PlayerArea) {
        super(canvas)
        this.x = x
        this.y = y
        this.start = start
        this.length = length
        this.playerArea = playerArea
    }

    draw(t: number) {
        this.totalTime = t-this.start
        let percentCompleted = this.totalTime/this.length

        // Set the time when completed, then the indicator manager will know when its been a second after the indicator has been completed to allow it time to linger
        if (percentCompleted < 0) { percentCompleted = 0 } // If the attack indicator hasn't passed the started time yet, set the percent completed to 0 to avoid errors 
        if (percentCompleted >= 1 && this.completed === 0) { this.completed = t } // If the time has already been set, don't set it again
        if (percentCompleted > 1) { percentCompleted = 1 } // Make it so the circles won't exceed their space, even when lingering

        const width = this.playerArea.playerSpotWidth * percentCompleted
        const height = this.playerArea.playerSpotHeight * percentCompleted

        this.ctx.fillStyle = `rgba(131, 2, 2, ${.5 * percentCompleted})`
        this.ctx.beginPath()
        this.ctx.ellipse(
            this.x + this.playerArea.playerSpotWidth/2, // Center circles in  
            this.y + this.playerArea.playerSpotHeight/2,
            width/2,
            height/2,
            0,
            0,
            Math.PI * 2
        )
        this.ctx.fill()
    }
}