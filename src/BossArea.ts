import { Boss } from "./Boss";
import { GameArea } from "./GameArea";
import { gameStage } from "./Stage";

/*

Contains code for boss area
- Creating background square
- Calculating sizes
- Create + draw the boss
*/

export class BossArea extends GameArea {

    public boss: Boss;
    constructor(canvas: HTMLCanvasElement, stage: gameStage) {
        super(canvas, stage)

        this.boss = new Boss(this, stage.playerArea, canvas)
    }

    calculateSize() {
        this.width = this.stage.width
        this.height = this.stage.height/2
        this.xOffset = this.stage.xOffset
        this.yOffset = this.stage.yOffset
    }

    draw(t: number) {
        this.ctx.fillStyle = "pink"
        this.ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height)

        this.boss.draw(t)
    }
}