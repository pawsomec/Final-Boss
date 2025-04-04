import { AttackIndicator } from "./AttackIndicator";
import { PlayerArea } from "./PlayerArea";

export class AttackIndicatorManager {
    public indicators: AttackIndicator[] = [];
    public canvas: HTMLCanvasElement;
    public playerArea: PlayerArea;
    constructor(canvas: HTMLCanvasElement, playerArea: PlayerArea) {
        this.canvas = canvas
        this.playerArea = playerArea
    }
    createAttackIndicator(x: number, y: number, start: number, length: number) {
        const newIndicator = new AttackIndicator(this.canvas, x, y, start, length, this.playerArea)
        this.indicators.push(newIndicator)
    }

    draw(t: number) {
        this.indicators.forEach((indicator, index) => {
            indicator.draw(t)
            if (indicator.completed !== 0 && t - indicator.completed > 80) { // Let the indicator linger for about 250ms just so it looks nicer 
                this.indicators.splice(index, 1) // If indicator is completed, remove it from array
            } 
        })
    }
}