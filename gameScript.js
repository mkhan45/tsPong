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
var GameState = /** @class */ (function () {
    function GameState() {
        var _this = this;
        this.gameLoop = function () {
            _this.draw();
            _this.pressed_keys.forEach(function (key) {
                if (key == "w") {
                    _this.lPaddle.y -= 5;
                }
                else if (key == "s") {
                    _this.lPaddle.y += 5;
                }
                if (key == "ArrowUp") {
                    _this.rPaddle.y -= 5;
                }
                else if (key == "ArrowDown") {
                    _this.rPaddle.y += 5;
                }
            });
        };
        this.handleMouseMove = function (event) {
            _this.mouseX = event.pageX;
            _this.mouseY = event.pageY;
        };
        this.handleKeyDown = function (event) {
            _this.pressed_keys.push(event.key);
        };
        this.handleKeyUp = function (event) {
            // remove it from the pressed_keys array
            var index = _this.pressed_keys.indexOf(event.key, 0);
            if (index != -1) {
                _this.pressed_keys.splice(index, 1);
            }
        };
        this.lPaddle = new Rectangle(20, 400, 20, 40);
        this.rPaddle = new Rectangle(470, 400, 20, 40);
        this.ball = new Rectangle(240, 240, 20, 20);
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.mouseX = 0;
        this.mouseY = 0;
        this.pressed_keys = [];
    }
    GameState.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.drawRect(this.lPaddle);
        this.drawRect(this.rPaddle);
        this.drawRect(this.ball);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();
    };
    GameState.prototype.drawRect = function (rect) {
        this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
    };
    return GameState;
}());
var pressed_keys;
var game_state = new GameState();
document.onmousemove = game_state.handleMouseMove;
document.onkeydown = game_state.handleKeyDown;
document.onkeyup = game_state.handleKeyUp;
setInterval(game_state.gameLoop, 16);
