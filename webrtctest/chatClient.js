var p = new SimplePeer({
    initiator: location.hash === '#1',
    trickle: false
});
p.on('error', function (err) { return console.log('error', err); });
p.on('signal', function (data) {
    console.log('SIGNAL', JSON.stringify(data));
    document.querySelector('#outgoing').textContent = JSON.stringify(data);
});
document.querySelector('#connectForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    p.signal(JSON.parse(document.querySelector('#incoming').value));
});
document.querySelector('#messageForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var message = document.querySelector('#outMessage');
    console.log(message.value);
    p.send(message.value);
});
p.on('connect', function () {
    console.log('CONNECT');
    p.send('whatever' + Math.random());
});
p.on('data', function (data) {
    console.log('data: ' + data);
    document.querySelector('#outgoing').textContent = data.toString();
});
