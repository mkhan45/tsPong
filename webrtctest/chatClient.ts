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

document.querySelector('#connectForm').addEventListener('submit', (ev: any) => {
   ev.preventDefault()
   p.signal(JSON.parse((<HTMLInputElement> document.querySelector('#incoming')).value))
})

document.querySelector('#messageForm').addEventListener('submit', (ev: any) => {
   ev.preventDefault()
   let message = <HTMLInputElement> document.querySelector('#outMessage');
   console.log(message.value);
   p.send(message.value)
})

p.on('connect', () => {
   console.log('CONNECT')
   p.send('whatever' + Math.random())
})

p.on('data', (data: string | JSON) => {
   console.log('data: ' + data)
   document.querySelector('#outgoing').textContent = data.toString()
})
