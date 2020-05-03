var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var iceServers = [
    'stun:stun.l.google.com:19302',
    'stun:global.stun.twilio.com:3478?transport=udp',
    'stun:stun2.l.google.com:19302',
    'stun:stun3.l.google.com:19302',
    'stun:stun4.l.google.com:19302',
].map(function (url) {
    return { urls: url };
});
function copyOutgoing() {
    var text = document.querySelector("#outgoing");
    text.select();
    document.execCommand("copy");
}
var SerializationHelper = /** @class */ (function () {
    function SerializationHelper() {
    }
    SerializationHelper.toInstance = function (obj, json) {
        var jsonObj = JSON.parse(json);
        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName];
            }
        }
        return obj;
    };
    return SerializationHelper;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    Rectangle.prototype.overlaps = function (other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    };
    return Rectangle;
}());
var GameData = /** @class */ (function () {
    function GameData() {
        var _this = this;
        this.handleKeyDown = function (event) {
            _this.pressed_keys.add(event.key);
        };
        this.handleKeyUp = function (event) {
            _this.pressed_keys.delete(event.key);
        };
        this.lPaddle = new Rectangle(20, 400, 20, 40);
        this.rPaddle = new Rectangle(470, 400, 20, 40);
        this.ball = new Rectangle(240, 240, 20, 20);
        this.pressed_keys = new Set();
    }
    return GameData;
}());
var GameInstance = /** @class */ (function () {
    function GameInstance() {
        var _this = this;
        this.gameLoop = function () {
            _this.draw();
        };
        this.game_data = new GameData();
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
    }
    GameInstance.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.drawRect(this.game_data.lPaddle);
        this.drawRect(this.game_data.rPaddle);
        this.drawRect(this.game_data.ball);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
    };
    GameInstance.prototype.drawRect = function (rect) {
        this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
    };
    return GameInstance;
}());
var game_instance = new GameInstance();
document.onkeydown = function (event) {
    game_instance.game_data.pressed_keys.add(event.key);
};
document.onkeyup = function (event) {
    game_instance.game_data.pressed_keys.delete(event.key);
};
function setupConnections(p) {
    p.on('error', function (err) { return console.log('error', err); });
    p.on('signal', function (data) {
        console.log('SIGNAL', JSON.stringify(data));
        document.querySelector('#outgoing').value = JSON.stringify(data);
    });
    document.querySelector('#connectForm').addEventListener('submit', function (ev) {
        ev.preventDefault();
        p.signal(document.querySelector('#outMessage').value);
    });
    p.on('connect', function () {
        console.log('CONNECTED');
    });
}
function startServer() {
    var p = new SimplePeer({
        initiator: true,
        trickle: false,
        config: { iceServers: iceServers },
    });
    setupConnections(p);
    var client_keys = new Set();
    p.on('data', function (data) {
        client_keys = new Set(JSON.parse(data));
    });
    var gameLoop = function () {
        game_instance.draw();
        var pressed_keys = new Set(__spread(client_keys, game_instance.game_data.pressed_keys));
        pressed_keys.forEach(function (key) {
            if (key == "w") {
                game_instance.game_data.lPaddle.y -= 5;
            }
            else if (key == "s") {
                game_instance.game_data.lPaddle.y += 5;
            }
            if (key == "ArrowUp") {
                game_instance.game_data.rPaddle.y -= 5;
            }
            else if (key == "ArrowDown") {
                game_instance.game_data.rPaddle.y += 5;
            }
        });
        p.send(JSON.stringify(game_instance.game_data));
    };
    setInterval(gameLoop, 16);
}
function startClient() {
    var p = new SimplePeer({
        initiator: false,
        trickle: false,
        config: { iceServers: iceServers },
    });
    setupConnections(p);
    p.on('data', function (data) {
        game_instance.game_data = SerializationHelper.toInstance(new GameData(), data);
    });
    var pressed_keys = new Set();
    document.onkeydown = function (event) {
        pressed_keys.add(event.key);
    };
    document.onkeyup = function (event) {
        pressed_keys.delete(event.key);
    };
    var gameLoop = function () {
        game_instance.draw();
        p.send(JSON.stringify(Array.from(pressed_keys)));
    };
    setInterval(gameLoop, 16);
}
