export class Rectangle {
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

export class GameData {
   lPaddle: Rectangle;
   rPaddle: Rectangle;
   ball: Rectangle;

   pressed_keys: Set<string>;

   constructor() {
      this.lPaddle = new Rectangle(20, 400, 20, 40);
      this.rPaddle = new Rectangle(470, 400, 20, 40);
      this.ball = new Rectangle(240, 240, 20, 20);
      this.pressed_keys = new Set();
   }

   public handleKeyDown = (event: KeyboardEvent) => {
      this.pressed_keys.add(event.key);
   }

   public handleKeyUp = (event: KeyboardEvent) => {
      this.pressed_keys.delete(event.key)
   }
}

export class GameInstance {
   game_data: GameData;

   canvas: HTMLCanvasElement;
   ctx: CanvasRenderingContext2D;

   constructor() {
      this.game_data = new GameData();
      this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
      this.ctx = <CanvasRenderingContext2D> this.canvas.getContext("2d");
   }

   public gameLoop = () => {
      this.draw();
   };

   public draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.drawRect(this.game_data.lPaddle);
      this.drawRect(this.game_data.rPaddle);
      this.drawRect(this.game_data.ball);
      this.ctx.fillStyle = "#000000";
      this.ctx.fill();
      this.ctx.closePath();
   }

   public drawRect(rect: Rectangle) {
      this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
   }
}
