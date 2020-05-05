declare var SimplePeer: any;
declare var $: any;

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

   public translate(x_vel: number, y_vel: number) {
      this.x += x_vel;
      this.y += y_vel;
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

   lscore: number;
   rscore: number;

   pressed_keys: Set<string>;

   constructor() {
      this.lPaddle = new Rectangle(20, 400, 15, 60);
      this.rPaddle = new Rectangle(470, 400, 15, 60);
      this.ball = new Rectangle(240, 240, 15, 15);
      this.pressed_keys = new Set();

      this.lscore = 0;
      this.rscore = 0;
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
   scoreText: HTMLPreElement;

   running: Boolean;

   ball_x_vel: number;
   ball_y_vel: number;

   constructor() {
      this.game_data = new GameData();
      this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
      this.ctx = <CanvasRenderingContext2D> this.canvas.getContext("2d");
      this.scoreText = <HTMLPreElement> document.getElementById("scoreText");
      this.running = false;

      this.ball_x_vel = Math.random() * 3.0 + 3.0;
      this.ball_y_vel = Math.random() * 3.0 + 3.0;

      if (Math.random() > 0.5)
         this.ball_x_vel *= -1;
      if (Math.random() > 0.5)
         this.ball_y_vel *= -1;
   }

   public gameLoop = () => {
      this.draw();

      if (this.running) {
         this.game_data.ball.translate(this.ball_x_vel, this.ball_y_vel);

         if (this.game_data.ball.x < 0 && this.ball_x_vel < 0) {
            this.game_data.rscore += 1;
            this.resetBall();
         }

         if (this.game_data.ball.x > 500 - this.game_data.ball.width && this.ball_x_vel > 0) {
            this.game_data.lscore += 1;
            this.resetBall();
         }

         if (this.game_data.ball.y < 0 && this.ball_y_vel < 0) {
            this.game_data.ball.y = 0;
            this.ball_y_vel *= -1;
         }
         if (this.game_data.ball.y > 500 - this.game_data.ball.height && this.ball_y_vel > 0) {
            this.game_data.ball.y = 500 - this.game_data.ball.height;
            this.ball_y_vel *= -1
         }

         if ((this.game_data.ball.overlaps(this.game_data.lPaddle) && this.ball_x_vel < 0)
            || (this.game_data.ball.overlaps(this.game_data.rPaddle) && this.ball_x_vel > 0))
         this.ball_x_vel *= -1
      }
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

      this.scoreText.innerText = `Left: ${this.game_data.lscore}, Right: ${this.game_data.rscore}`;
   }

   public drawRect(rect: Rectangle) {
      this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
   }

   public resetBall() {
      this.game_data.ball = new Rectangle(240, 240, 15, 15);
      this.ball_x_vel = Math.random() * 3.0 + 3.0;
      this.ball_y_vel = Math.random() * 3.0 + 3.0;
   }
}


let iceServers: {urls : string}[] = [
   'stun:stun.l.google.com:19302',
   'stun:global.stun.twilio.com:3478?transport=udp',
   'stun:stun4.l.google.com:19302',
   'stun:stun.sipnet.net:3478',
].map((url: string) => {
   return { urls: url };
});


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

let game_instance = new GameInstance();
document.onkeydown = (event: KeyboardEvent) => {
   game_instance.game_data.pressed_keys.add(event.key);
}
document.onkeyup = (event: KeyboardEvent) => {
   game_instance.game_data.pressed_keys.delete(event.key);
}

// 1. initiator presses start server and sends signal data to server
// 2. server creates a room and stores signal data, initiator sets interval to check server
// 3. client requests room number and recieves signal data
// 4. client sends new signal data to server
// 5. on next check in initiator recieves client's signal data and connection is complete

function setupConnections(p: any) {
   p.on('error', (err: Error) => console.log('error', err))

   p.on('signal', (data: string | JSON) => {
      console.log('SIGNAL', JSON.stringify(data));
      // send data to server
      $.ajax('signal', {
         type: 'POST',  // http method
         data: { myData: 'This is my data.' },  // data to submit
         success: function (data, status, xhr) {
            console.log('status: ' + status + ', data: ' + data);
         },
         error: function (jqXhr, textStatus, errorMessage) {
            console.log('Error' + errorMessage);
         }
      });
   })

   /* document.querySelector('#connectForm').addEventListener('submit', (ev: any) => { */
   /*    ev.preventDefault() */
   /*    /1* p.signal((<HTMLInputElement> document.querySelector('#outMessage')).value); *1/ */
   /* }) */

   //async for the Promise
   p.on('connect', async () => {
      console.log('CONNECTED')
      await new Promise(r => setTimeout(r, 2500)); //sleep 2500ms
      game_instance.running = true;
   })
}

function startServer() {
   const p = new SimplePeer({
      initiator: true,
      trickle: false,
      config: {iceServers: iceServers},
   });

   setupConnections(p);

   let client_keys: Set<string> = new Set();
   p.on('data', (data: string) => {
      client_keys = new Set(JSON.parse(data));
   })

   let gameLoop = () => {
      game_instance.gameLoop()

      if (game_instance.running) {
         let pressed_keys = new Set([...client_keys, ...game_instance.game_data.pressed_keys]);
         pressed_keys.forEach( (key: string) => {
            if (key == "w") {
               game_instance.game_data.lPaddle.y -= 10;
            } else if (key == "s") {
               game_instance.game_data.lPaddle.y += 10;
            }

            if (key == "ArrowUp") {
               game_instance.game_data.rPaddle.y -= 10;
            } else if (key == "ArrowDown") {
               game_instance.game_data.rPaddle.y += 10;
            }
         });

         p.send(JSON.stringify(game_instance.game_data));
      }
   };

   setInterval(gameLoop, 16);
}

function startClient() {
   const p = new SimplePeer({
      initiator: false,
      trickle: false,
      config: {iceServers: iceServers},
      reconnectTimer: 15000,
   });
   setupConnections(p);

   // let initiator signal = (get from server)
   // p.signal(signal)

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

function copyOutgoing() {
   let text = <HTMLInputElement> document.querySelector("#outgoing");
   text.select();
   document.execCommand("copy");
}
