
/*

Contains code for the goblin boss heart attack 

*/

import { BossArea } from "./BossArea";
import { GameElement } from "./GameElement";
import { PlayerSpot } from "./PlayerSpot";
import { playerObject } from "./utils";

export class HeartAttack extends GameElement {
    public spot: PlayerSpot;
    
    private damage: number;
    public static length: number = 3000;//7500;
    private startTime: number;
    public collected: boolean = false; // Let the boss object know when to remove this from the array

    public startX: number = 0;
    public startY: number = 0;
    
    constructor(canvas: HTMLCanvasElement, bossArea: BossArea, startTime: number, spot: PlayerSpot, damage: number) {
        super(canvas)
        this.spot = spot
        this.damage = damage
        this.startTime = startTime

        this.startX = bossArea.xOffset + bossArea.width/2
        this.startY = bossArea.yOffset + bossArea.height/2
    }

    drawHeart(x: number, y: number, width: number, height: number, color: string) {
        const topCurveHeight = height * .3
        this.ctx.fillStyle = color; // Temporary code to make the heart change color if will hurt.  Will be in an animation later

        // The following code was copy+pasted from stack overflow, but it should be removed before release as an image will eventually replace this
        // Draw a heart
        this.ctx.beginPath();
        // top left curve
        this.ctx.bezierCurveTo(
            x, y, 
            x - width / 2, y, 
            x - width / 2, y + topCurveHeight
        );

        // bottom left curve
        this.ctx.bezierCurveTo(
            x - width / 2, y + (height + topCurveHeight) / 2, 
            x, y + (height + topCurveHeight) / 2, 
            x, y + height
        );

        // bottom right curve
        this.ctx.bezierCurveTo(
            x, y + (height + topCurveHeight) / 2, 
            x + width / 2, y + (height + topCurveHeight) / 2, 
            x + width / 2, y + topCurveHeight
        );

        // top right curve
        this.ctx.bezierCurveTo(
            x + width / 2, y, 
            x, y, 
            x, y + topCurveHeight
        );

        this.ctx.fill();
        this.ctx.closePath();
    }

    draw(t: number) { // Damage the player object if they are on the tile
        if (this.collected) { return }
        if (!playerObject) { return }
        if (this.spot.disabled) {
            this.collected = true // If the spot the heart is attatched to is disabled, get rid of the heart
        }

        // The heart will start in the middle of the boss area and float to a tile
        // Calculate the new position after floating
        let percentCompleted = (t-this.startTime)/HeartAttack.length
        if (percentCompleted > 1) { percentCompleted = 1 }

        const width = this.spot.playerArea.playerSpotWidth // Width is needed to be defined here for calculating the x and y
        const height = this.spot.playerArea.playerSpotHeight

        const finalXValue = this.spot.xOffset + width/2
        const finalYValue = this.spot.yOffset

        const xDifference = this.startX - finalXValue
        const yDifference = this.startY - finalYValue

        const x = this.startX - xDifference*percentCompleted
        const y = this.startY - yDifference*percentCompleted
        
        if (percentCompleted === 1 && playerObject.x === this.spot.column && playerObject.y === this.spot.row) {
            // If the heart heals the player, then directly change the players health so the negative damage won't be affected by invincibility frames 
            if (this.damage < 0) { 
                playerObject.healthPercent -= this.damage 
            } else {
                playerObject.changeHealth -= this.damage
            }
            this.collected = true
        }

        const shadowSize = 20 * (1-percentCompleted)
        this.drawHeart(x, y + shadowSize / 2, width + shadowSize, height + shadowSize, `rgb(0, 0, 0, .5)`) // Draw a heart shadow to indicate where it will land
        this.drawHeart(x, y, width, height, `rgb(${255-25+this.damage*-100}, 0, 0)`)

    }
}