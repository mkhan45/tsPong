class Rectangle {
   x: number;
   y: number;
   width: number;
   height: number;

   constructor(x: number, y: number, w: number, h: number) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
   }

   public overlaps(other: Rectangle) {
      return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y
   }
}

class GameState {
   canvas: HTMLCanvasElement;
   ctx: CanvasRenderingContext2D;
   lPaddle: Rectangle;
   rPaddle: Rectangle;
   ball: Rectangle;

   mouseX: number;
   mouseY: number;
   pressed_keys: string[];

   constructor() {
      this.lPaddle = new Rectangle(20, 400, 20, 40);
      this.rPaddle = new Rectangle(470, 400, 20, 40);
      this.ball = new Rectangle(240, 240, 20, 20);

      this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
      this.ctx = <CanvasRenderingContext2D> this.canvas.getContext("2d");

      this.mouseX = 0;
      this.mouseY = 0;
      this.pressed_keys = [];
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
      this.pressed_keys.push(event.key);
   }

   public handleKeyUp = (event: KeyboardEvent) => {
      // remove it from the pressed_keys array
      let index = this.pressed_keys.indexOf(event.key, 0);
      if (index != -1) {
         this.pressed_keys.splice(index, 1);
      }
   }
}

let pressed_keys: string[];

let game_state = new GameState();

document.onmousemove = game_state.handleMouseMove;
document.onkeydown = game_state.handleKeyDown;
document.onkeyup = game_state.handleKeyUp;
setInterval(game_state.gameLoop, 16);
