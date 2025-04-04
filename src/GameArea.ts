import { GameElement } from "./GameElement";
import { gameStage } from "./Stage";

/*

Contains basic game area code (player and boss areas)
- Assigns the stage to a variable
- Creates temporary position + size variables

*/

export class GameArea extends GameElement{
    public stage: gameStage;

    // Variables
    public width: number = 0;
    public height: number = 0;
    public xOffset: number = 0;
    public yOffset: number = 0;
    constructor(canvas: HTMLCanvasElement, stage: gameStage) {
        super(canvas)
        this.stage = stage
    }
}