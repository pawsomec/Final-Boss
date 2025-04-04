import { gameStage } from "./Stage";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Create stage here, then the rest of the elements (player area, boss area) will stem from the stage
    private stage: gameStage;

    constructor(container: HTMLElement) {
        // Create the canvas element + get CTX
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D

        // Create game objects
        this.stage = new gameStage(this.canvas)

        // Game setup
        container.appendChild(this.canvas) // Append Canvas to the document
        
        const self = this // Allow sizeGame to access this object 
        function sizeGame() {
            self.canvas.width = window.innerWidth
            self.canvas.height = window.innerHeight

            self.stage.calculateSize()
        }
        sizeGame()
        window.addEventListener("resize", sizeGame)
    }

    draw(t: number) {
        // Draw background
        this.ctx.fillStyle = "lightblue"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw stage, which will lead to the rest of the elements being drawn
        this.stage.draw(t)
    }
}