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

   public top(): number {
      return this.y;
   }

   public bottom(): number {
      return this.y + this.height;
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
            || (this.game_data.ball.overlaps(this.game_data.rPaddle) && this.ball_x_vel > 0)) {
               this.ball_x_vel *= -(1 + (Math.random() * 0.5 - 0.25)); //random from -0.5 to 0.5
               this.ball_y_vel *= (Math.random() * 0.5) + 0.75 //random from 0.75 to 1.25
            }
      }
   };

   public draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();

      this.drawRect(this.game_data.lPaddle);
      this.drawRect(this.game_data.rPaddle);
      this.drawRect(this.game_data.ball);

      this.drawRect(new Rectangle(0, 0, 500, 1.5)); //top edge
      this.drawRect(new Rectangle(0, 498.5, 500, 1.5)); //bottom edge
      this.drawRect(new Rectangle(0, 0, 1.5, 500)); //left edge
      this.drawRect(new Rectangle(498.5, 0, 1.5, 500)); //right edge

      this.ctx.fillStyle = "#000000";
      this.ctx.fill();
      this.ctx.closePath();

      this.scoreText.innerText = `Left: ${this.game_data.lscore}, Right: ${this.game_data.rscore}`;
   }

   public drawRect(rect: Rectangle) {
      this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
   }

   public async resetBall() {
      this.game_data.ball = new Rectangle(240, 240, 15, 15);
      this.ball_x_vel = Math.random() * 3.0 + 3.0;
      this.ball_y_vel = Math.random() * 3.0 + 3.0;

      if (Math.random() < 0.5) {
         this.ball_x_vel *= -1;
      }
      if (Math.random() < 0.5) {
         this.ball_y_vel *= -1;
      }
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

   p.on('signal', (data: string | JSON) => {
      console.log('SIGNAL', JSON.stringify(data));
      // send data to server
      $.ajax('signal', {
         type: 'POST',  // http method
         data: { c_info: JSON.stringify(data) },  // data to submit
         success: function (data: string, status: string, _xhr: any) {
            console.log('status: ' + status + ', data: ' + data);
         },
         error: function (_jqXhr: any, _textStatus: string, errorMessage: string) {
            console.log('Error: ' + errorMessage);
         }
      });
   })

   let interval = setInterval(() => {
      $.ajax('getaccept', {
         type: 'GET',  // http method
         success: function (data: string, status: string, _xhr: any) {
            console.log('status: ' + status + ', data: ' + data);
            if (data == "null") {
               console.log("no clients connected");
            } else {
               p.signal(data);
               clearInterval(interval);
            }
         },
         error: function (_jqXhr: any, _textStatus: string, errorMessage: string) {
            console.log('Error: ' + errorMessage);
         }
      });
   }, 3000);

   let client_keys: Set<string> = new Set();
   p.on('data', (data: string) => {
      client_keys = new Set(JSON.parse(data));
   })

   let gameLoop = () => {
      game_instance.gameLoop()

      if (game_instance.running) {
         client_keys.forEach((key: string) => {
            if (key.toLowerCase() == "w" && game_instance.game_data.lPaddle.top() > 0) {
               game_instance.game_data.lPaddle.y -= 10;
            } else if (key.toLowerCase() == "s" && game_instance.game_data.lPaddle.bottom() < 500) {
               game_instance.game_data.lPaddle.y += 10;
            }
         });

         game_instance.game_data.pressed_keys.forEach((key: string) => {
            if (key == "ArrowUp" && game_instance.game_data.rPaddle.top() > 0) {
               game_instance.game_data.rPaddle.y -= 10;
            } else if (key == "ArrowDown" && game_instance.game_data.rPaddle.bottom() < 500) {
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

   $.ajax('getsignal', {
      type: 'GET',  // http method
      success: function (data: string, _status: string, _xhr: any) {
         console.log(data);
         p.signal(data);
      },
      error: function (_jqXhr: any, _textStatus: string, errorMessage: string) {
         console.log('Error: ' + errorMessage);
      }
   });

   p.on('signal', (data: string | JSON) => {
      console.log('SIGNAL', JSON.stringify(data));
      // send data to server
      $.ajax('accept', {
         type: 'POST',  // http method
         data: { c_info: JSON.stringify(data) },  // data to submit
         success: function (data: string, status: string, _xhr: any) {
            console.log('status: ' + status + ', data: ' + data);
         },
         error: function (_jqXhr: any, _textStatus: string, errorMessage: string) {
            console.log('Error: ' + errorMessage);
         }
      });
   })

   // let initiator signal = (get from server)
   // p.signal(signal)

   p.on('data', (data: string) => {
      /* game_instance.game_data = SerializationHelper.toInstance(new GameData(), data); */
      game_instance.game_data = <GameData> JSON.parse(data);
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
