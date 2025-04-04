/*

Contains basic game element code
- Canvas variable
- Getting CTX
Almost every element extends off of this

*/

export class GameElement {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    }
}