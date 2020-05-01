import { GameInstance } from "./gameData"

let game_state = new GameInstance();

let pressed_keys: Set<string> = new Set();

document.onkeyup = (event: KeyboardEvent) => {
   pressed_keys.delete(event.key);
}

document.onkeydown = (event: KeyboardEvent) => {
   pressed_keys.add(event.key);
}

setInterval(game_state.draw, 16);

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
   Object.assign(game_state, data);
})
