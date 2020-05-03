declare var SimplePeer: any;

function copyOutgoing() {
   let text = <HTMLInputElement> document.querySelector("#outgoing");
   text.select();
   document.execCommand("copy");
}

class SerializationHelper {
    static toInstance<T>(obj: T, json: string) : T {
        var jsonObj = JSON.parse(json);

        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }
}

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

class GameData {
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

class GameInstance {
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

let game_instance = new GameInstance();

document.onkeydown = (event: KeyboardEvent) => {
   game_instance.game_data.pressed_keys.add(event.key);
}

document.onkeyup = (event: KeyboardEvent) => {
   game_instance.game_data.pressed_keys.delete(event.key);
}

function setupConnections(p: any) {
   p.on('error', (err: Error) => console.log('error', err))
   p.on('signal', (data: string | JSON) => {
      console.log('SIGNAL', JSON.stringify(data));
      (<HTMLInputElement> document.querySelector('#outgoing')).value = JSON.stringify(data)
   })
   document.querySelector('#connectForm').addEventListener('submit', (ev: any) => {
      ev.preventDefault()
      p.signal((<HTMLInputElement> document.querySelector('#outMessage')).value);
   })
   p.on('connect', () => {
      console.log('CONNECTED')
   })
}

function startServer() {
   const p = new SimplePeer({
      initiator: true,
      trickle: false,
   });

   setupConnections(p);

   let client_keys: Set<string> = new Set();
   p.on('data', (data: string) => {
      client_keys = new Set(JSON.parse(data));
      console.log(client_keys);
   })

   let gameLoop = () => {
      game_instance.draw()

      let pressed_keys = new Set([...client_keys, ...game_instance.game_data.pressed_keys]);
      pressed_keys.forEach( (key: string) => {
         if (key == "w") {
            game_instance.game_data.lPaddle.y -= 5;
         } else if (key == "s") {
            game_instance.game_data.lPaddle.y += 5;
         }

         if (key == "ArrowUp") {
            game_instance.game_data.rPaddle.y -= 5;
         } else if (key == "ArrowDown") {
            game_instance.game_data.rPaddle.y += 5;
         }
      });

      p.send(JSON.stringify(game_instance.game_data));
   };

   setInterval(gameLoop, 16);
}

function startClient() {
   const p = new SimplePeer({
      initiator: false,
      trickle: false,
   });
   setupConnections(p);

   p.on('data', (data: string) => {
      game_instance.game_data = SerializationHelper.toInstance(new GameData(), data);
   })

   let pressed_keys: Set<string> = new Set();
   document.onkeydown = (event: KeyboardEvent) => {
      pressed_keys.add(event.key);
   }

   document.onkeyup = (event: KeyboardEvent) => {
      pressed_keys.delete(event.key);
   }

   let gameLoop = () => {
      game_instance.draw();
      p.send(JSON.stringify(Array.from(pressed_keys)));
   }

   setInterval(gameLoop, 16);
}
