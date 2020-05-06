var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function secureRandomNumber() {
    var array = new Uint32Array(1);
    return window.crypto.getRandomValues(array)[0] / 2147483647 / 2;
}
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    Rectangle.prototype.translate = function (x_vel, y_vel) {
        this.x += x_vel;
        this.y += y_vel;
    };
    Rectangle.prototype.top = function () {
        return this.y;
    };
    Rectangle.prototype.bottom = function () {
        return this.y + this.height;
    };
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
        this.lPaddle = new Rectangle(20, 400, 15, 60);
        this.rPaddle = new Rectangle(470, 400, 15, 60);
        this.ball = new Rectangle(240, 240, 15, 15);
        this.pressed_keys = new Set();
        this.lscore = 0;
        this.rscore = 0;
    }
    return GameData;
}());
var GameInstance = /** @class */ (function () {
    function GameInstance() {
        var _this = this;
        this.gameLoop = function () {
            _this.draw();
            if (_this.running) {
                _this.game_data.ball.translate(_this.ball_x_vel, _this.ball_y_vel);
                if (_this.game_data.ball.x < 0 && _this.ball_x_vel < 0) {
                    _this.game_data.rscore += 1;
                    _this.resetBall();
                }
                if (_this.game_data.ball.x > 500 - _this.game_data.ball.width && _this.ball_x_vel > 0) {
                    _this.game_data.lscore += 1;
                    _this.resetBall();
                }
                if (_this.game_data.ball.y < 0 && _this.ball_y_vel < 0) {
                    _this.game_data.ball.y = 0;
                    _this.ball_y_vel *= -1;
                }
                if (_this.game_data.ball.y > 500 - _this.game_data.ball.height && _this.ball_y_vel > 0) {
                    _this.game_data.ball.y = 500 - _this.game_data.ball.height;
                    _this.ball_y_vel *= -1;
                }
                if ((_this.game_data.ball.overlaps(_this.game_data.lPaddle) && _this.ball_x_vel < 0)
                    || (_this.game_data.ball.overlaps(_this.game_data.rPaddle) && _this.ball_x_vel > 0))
                    _this.ball_x_vel *= -1;
            }
        };
        this.game_data = new GameData();
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.scoreText = document.getElementById("scoreText");
        this.running = false;
        this.ball_x_vel = secureRandomNumber() * 3.0 + 3.0;
        this.ball_y_vel = secureRandomNumber() * 3.0 + 3.0;
        if (secureRandomNumber() > 0.5)
            this.ball_x_vel *= -1;
        if (secureRandomNumber() > 0.5)
            this.ball_y_vel *= -1;
    }
    GameInstance.prototype.draw = function () {
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
        this.scoreText.innerText = "Left: " + this.game_data.lscore + ", Right: " + this.game_data.rscore;
    };
    GameInstance.prototype.drawRect = function (rect) {
        this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
    };
    GameInstance.prototype.resetBall = function () {
        this.game_data.ball = new Rectangle(240, 240, 15, 15);
        this.ball_x_vel = secureRandomNumber() * 3.0 + 3.0;
        this.ball_y_vel = secureRandomNumber() * 3.0 + 3.0;
        if (Math.random() < 0.5) {
            this.ball_x_vel *= -1;
        }
        if (Math.random() < 0.5) {
            this.ball_y_vel *= -1;
        }
    };
    return GameInstance;
}());
var iceServers = [
    'stun:stun.l.google.com:19302',
    'stun:global.stun.twilio.com:3478?transport=udp',
    'stun:stun4.l.google.com:19302',
    'stun:stun.sipnet.net:3478',
].map(function (url) {
    return { urls: url };
});
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
var game_instance = new GameInstance();
document.onkeydown = function (event) {
    game_instance.game_data.pressed_keys.add(event.key);
};
document.onkeyup = function (event) {
    game_instance.game_data.pressed_keys.delete(event.key);
};
// 1. initiator presses start server and sends signal data to server
// 2. server creates a room and stores signal data, initiator sets interval to check server
// 3. client requests room number and recieves signal data
// 4. client sends new signal data to server
// 5. on next check in initiator recieves client's signal data and connection is complete
function setupConnections(p) {
    var _this = this;
    p.on('error', function (err) { return console.log('error', err); });
    /* document.querySelector('#connectForm').addEventListener('submit', (ev: any) => { */
    /*    ev.preventDefault() */
    /*    /1* p.signal((<HTMLInputElement> document.querySelector('#outMessage')).value); *1/ */
    /* }) */
    //async for the Promise
    p.on('connect', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('CONNECTED');
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 2500); })];
                case 1:
                    _a.sent(); //sleep 2500ms
                    game_instance.running = true;
                    return [2 /*return*/];
            }
        });
    }); });
}
function startServer() {
    var p = new SimplePeer({
        initiator: true,
        trickle: false,
        config: { iceServers: iceServers },
    });
    setupConnections(p);
    p.on('signal', function (data) {
        console.log('SIGNAL', JSON.stringify(data));
        // send data to server
        $.ajax('signal', {
            type: 'POST',
            data: { c_info: JSON.stringify(data) },
            success: function (data, status, _xhr) {
                console.log('status: ' + status + ', data: ' + data);
            },
            error: function (_jqXhr, _textStatus, errorMessage) {
                console.log('Error: ' + errorMessage);
            }
        });
    });
    var interval = setInterval(function () {
        $.ajax('getaccept', {
            type: 'GET',
            success: function (data, status, _xhr) {
                console.log('status: ' + status + ', data: ' + data);
                if (data == "null") {
                    console.log("no clients connected");
                }
                else {
                    p.signal(data);
                    clearInterval(interval);
                }
            },
            error: function (_jqXhr, _textStatus, errorMessage) {
                console.log('Error: ' + errorMessage);
            }
        });
    }, 3000);
    var client_keys = new Set();
    p.on('data', function (data) {
        client_keys = new Set(JSON.parse(data));
    });
    var gameLoop = function () {
        game_instance.gameLoop();
        if (game_instance.running) {
            client_keys.forEach(function (key) {
                if (key.toLowerCase() == "w" && game_instance.game_data.lPaddle.top() > 0) {
                    game_instance.game_data.lPaddle.y -= 10;
                }
                else if (key.toLowerCase() == "s" && game_instance.game_data.lPaddle.bottom() < 500) {
                    game_instance.game_data.lPaddle.y += 10;
                }
            });
            game_instance.game_data.pressed_keys.forEach(function (key) {
                if (key == "ArrowUp" && game_instance.game_data.rPaddle.top() > 0) {
                    game_instance.game_data.rPaddle.y -= 10;
                }
                else if (key == "ArrowDown" && game_instance.game_data.rPaddle.bottom() < 500) {
                    game_instance.game_data.rPaddle.y += 10;
                }
            });
            p.send(JSON.stringify(game_instance.game_data));
        }
    };
    setInterval(gameLoop, 16);
}
function startClient() {
    var p = new SimplePeer({
        initiator: false,
        trickle: false,
        config: { iceServers: iceServers },
        reconnectTimer: 15000,
    });
    setupConnections(p);
    $.ajax('getsignal', {
        type: 'GET',
        success: function (data, _status, _xhr) {
            console.log(data);
            p.signal(data);
        },
        error: function (_jqXhr, _textStatus, errorMessage) {
            console.log('Error: ' + errorMessage);
        }
    });
    p.on('signal', function (data) {
        console.log('SIGNAL', JSON.stringify(data));
        // send data to server
        $.ajax('accept', {
            type: 'POST',
            data: { c_info: JSON.stringify(data) },
            success: function (data, status, _xhr) {
                console.log('status: ' + status + ', data: ' + data);
            },
            error: function (_jqXhr, _textStatus, errorMessage) {
                console.log('Error: ' + errorMessage);
            }
        });
    });
    // let initiator signal = (get from server)
    // p.signal(signal)
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
function copyOutgoing() {
    var text = document.querySelector("#outgoing");
    text.select();
    document.execCommand("copy");
}
