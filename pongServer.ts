import { GameInstance } from "./gameData"

class ServerPong extends GameInstance {
   public gameLoop = () => {
      super.gameLoop();

      this.game_data.pressed_keys.forEach( (key: string) => {
         if (key == "w") {
            this.game_data.lPaddle.y -= 5;
         } else if (key == "s") {
            this.game_data.lPaddle.y += 5;
         }

         if (key == "ArrowUp") {
            this.game_data.rPaddle.y -= 5;
         } else if (key == "ArrowDown") {
            this.game_data.rPaddle.y += 5;
         }
      });
   }
}

let game_state = new ServerPong();

document.onkeyup = game_state.game_data.handleKeyUp;
document.onkeydown = game_state.game_data.handleKeyDown;

setInterval(game_state.gameLoop, 16);

declare var SimplePeer: any;
const p = new SimplePeer({
   initiator: location.hash === '#1',
   trickle: false
})

p.on('error', (err: Error) => console.log('error', err))

p.on('signal', (data: string | JSON) => {
   console.log('SIGNAL', JSON.stringify(data))
   document.querySelector('#outgoing').textContent = JSON.stringify(data)
})

p.on('connect', () => {
   console.log('CONNECTED')
})

p.on('data', (data: JSON) => {
   // data should be an array of keys
   let set: Set<string> = Object.assign(data);
   set.forEach((key: string) => game_state.game_data.pressed_keys.add(key));
})
