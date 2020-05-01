import { Rectangle } from "./gameData"

class GameState {
   canvas: HTMLCanvasElement;
   ctx: CanvasRenderingContext2D;
   lPaddle: Rectangle;
   rPaddle: Rectangle;
   ball: Rectangle;

   mouseX: number;
   mouseY: number;
   pressed_keys: Set<string>;

   constructor() {
      this.lPaddle = new Rectangle(20, 400, 20, 40);
      this.rPaddle = new Rectangle(470, 400, 20, 40);
      this.ball = new Rectangle(240, 240, 20, 20);

      this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
      this.ctx = <CanvasRenderingContext2D> this.canvas.getContext("2d");

      this.mouseX = 0;
      this.mouseY = 0;
      this.pressed_keys = new Set();
   }

   public gameLoop = () => {
      this.draw();

      this.pressed_keys.forEach( (key: string) => {
         if (key == "w") {
            this.lPaddle.y -= 5;
         } else if (key == "s") {
            this.lPaddle.y += 5;
         }

         if (key == "ArrowUp") {
            this.rPaddle.y -= 5;
         } else if (key == "ArrowDown") {
            this.rPaddle.y += 5;
         }
      });
   }

   public draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.drawRect(this.lPaddle);
      this.drawRect(this.rPaddle);
      this.drawRect(this.ball);
      this.ctx.fillStyle = "#000000";
      this.ctx.fill();
      this.ctx.closePath();
   }

   public drawRect(rect: Rectangle) {
      this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
   }

   public handleMouseMove = (event: MouseEvent) => {
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
   }

   public handleKeyDown = (event: KeyboardEvent) => {
      this.pressed_keys.add(event.key);
   }

   public handleKeyUp = (event: KeyboardEvent) => {
      this.pressed_keys.delete(event.key)
   }
}

let game_state = new GameState();

document.onmousemove = game_state.handleMouseMove;
document.onkeydown = game_state.handleKeyDown;
document.onkeyup = game_state.handleKeyUp;

setInterval(game_state.gameLoop, 16);
