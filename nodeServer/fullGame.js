class food {
    constructor(game, size, x, y) {
        this.game = game;
        this.size = size;
        this.value = this.size;
        this.x = x;
        this.y = y;
        this.ArrColor = [
            "#FF0000",
            "#FFFF00",
            "#00FF00",
            "#FF00FF",
            "#FFFFFF",
            "#00FFFF",
            "#7FFF00",
            "#FFCC00",
        ];
        this.init();
    }

    init() {
        this.color =
            this.ArrColor[
                Math.floor(Math.random() * 99999) % this.ArrColor.length
            ];
    }

    draw() {
        if (this.game.isPoint(this.x, this.y)) {
            // this.game.context.beginPath();
            // this.game.context.arc(this.x - this.size / 4 - this.game.XX, this.y - this.size / 4 - this.game.YY, this.size / 2, 0, Math.PI * 2, false);
            // this.game.context.fillStyle = this.color;
            // this.game.context.fill();
            // this.game.context.closePath()
        }
    }

    toJSON() {
        return {
            size: this.size,
            x: this.x,
            y: this.y,
            color: this.color,
        };
    }
}

class snake {
    constructor(name, game, score, x, y) {
        this.name = name;
        this.game = game;
        this.score = score;
        this.x = x;
        this.y = y;
        this.init();
    }

    init() {
        this.time = Math.floor(20 + Math.random() * 100);
        this.speed = 1;
        this.size = this.game.getSize() * 1;
        this.angle = 0;
        this.dx =
            Math.random() * this.game.MaxSpeed -
            Math.random() * this.game.MaxSpeed;
        this.dy =
            Math.random() * this.game.MaxSpeed -
            Math.random() * this.game.MaxSpeed;

        this.v = [];
        for (let i = 0; i < 50; i++) this.v[i] = { x: this.x, y: this.y };
        // this.sn_im = new Image();
        // this.sn_im.src = "images/head.png";
        // this.bd_im = new Image();
        // this.bd_im.src = "images/body/" + Math.floor(Math.random() * 999999) % 13 + ".png";
    }

    update() {
        this.time--;
        this.angle = this.getAngle(this.dx, this.dy);
        if (this.name != "HaiZuka") {
            if (this.time > 90) this.speed = 2;
            else this.speed = 1;
            if (this.time <= 0) {
                this.time = Math.floor(10 + Math.random() * 20);
                this.dx =
                    Math.random() * this.game.MaxSpeed -
                    Math.random() * this.game.MaxSpeed;
                this.dy =
                    Math.random() * this.game.MaxSpeed -
                    Math.random() * this.game.MaxSpeed;
                
                let minRange = Math.sqrt(
                    this.game.game_W * this.game.game_W +
                        this.game.game_H * this.game.game_H,
                );

                for (let i = 0; i < this.game.FOOD.length; i++) {
                    if (
                        this.game.FOOD[i].size > this.game.getSize() / 10 &&
                        this.range(this.v[0], this.game.FOOD[i]) < minRange
                    ) {
                        minRange = this.range(this.v[0], this.game.FOOD[i]);
                        this.dx = this.game.FOOD[i].x - this.v[0].x;
                        this.dy = this.game.FOOD[i].y - this.v[0].y;
                    }
                }
                if (
                    minRange <
                    Math.sqrt(
                        this.game.game_W * this.game.game_W +
                            this.game.game_H * this.game.game_H,
                    )
                )
                    this.time = 0;
                // console.log(minRange);

                while (
                    Math.abs(this.dy) * Math.abs(this.dy) +
                        Math.abs(this.dx) * Math.abs(this.dx) >
                        this.game.MaxSpeed * this.game.MaxSpeed &&
                    this.dx * this.dy != 0
                ) {
                    this.dx /= 1.1;
                    this.dy /= 1.1;
                }
                while (
                    Math.abs(this.dy) * Math.abs(this.dy) +
                        Math.abs(this.dx) * Math.abs(this.dx) <
                        this.game.MaxSpeed * this.game.MaxSpeed &&
                    this.dx * this.dy != 0
                ) {
                    this.dx *= 1.1;
                    this.dy *= 1.1;
                }
            }
            this.score += this.score / 666;
        }

        this.v[0].x += this.dx * this.speed;
        this.v[0].y += this.dy * this.speed;

        for (let i = 1; i < this.v.length; i++) {
            if (this.range(this.v[i], this.v[i - 1]) > this.size / 5) {
                this.v[i].x = (this.v[i].x + this.v[i - 1].x) / 2;
                this.v[i].y = (this.v[i].y + this.v[i - 1].y) / 2;
                this.v[i].x = (this.v[i].x + this.v[i - 1].x) / 2;
                this.v[i].y = (this.v[i].y + this.v[i - 1].y) / 2;
            }
        }
        if (this.score < 200) return;
        if (this.speed == 2) this.score -= this.score / 2000;
        let csUp = Math.pow(this.score / 1000, 1 / 5);
        this.size = (this.game.getSize() / 2) * csUp;
        let N = 3 * Math.floor(50 * Math.pow(this.score / 1000, 1 / 1));
        if (N > this.v.length) {
            this.v[this.v.length] = {
                x: this.v[this.v.length - 1].x,
                y: this.v[this.v.length - 1].y,
            };
        } else this.v = this.v.slice(0, N);
    }

    draw() {
        this.update();

        // for (let i = this.v.length - 1; i >= 1; i--)
        //     if (this.game.isPoint(this.v[i].x, this.v[i].y))
        //         // this.game.context.drawImage(this.bd_im, this.v[i].x - this.game.XX - (this.size) / 2, this.v[i].y - this.game.YY - (this.size) / 2, this.size, this.size);

        // this.game.context.save();
        // this.game.context.translate(this.v[0].x - this.game.XX, this.v[0].y - this.game.YY);
        // this.game.context.rotate(this.angle - Math.PI / 2);
        // this.game.context.drawImage(this.sn_im, -this.size / 2, -this.size / 2, this.size, this.size);
        // this.game.context.restore();
    }

    getAngle(a, b) {
        let c = Math.sqrt(a * a + b * b);
        let al = Math.acos(a / c);
        if (b < 0) al += 2 * (Math.PI - al);
        return al;
    }

    range(v1, v2) {
        return Math.sqrt(
            (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y),
        );
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            Nball: this.Nball,
            v: this.v,
            snake_length: this.v.length,
            score: this.score,
            size: this.size,
            speed: this.speed,
            angle: this.angle,
            sn_im: this.sn_im,
            bd_im: this.bd_im,
        };
    }
}

class Game {
    constructor() {
        this.name = "HaiZuka";
        this.game_W = 698;
        this.game_H = 788;
        // this.bg_im = new Image();
        // this.bg_im.src = "images/Map2.png";
        this.SPEED = 10000;
        this.MaxSpeed = 0;
        this.chX = 1;
        this.chY = 1;
        this.mySnake = [];
        this.FOOD = [];
        this.NFood = 2000;
        this.Nsnake = 20;
        this.sizeMap = 2000;
        this.index = 0;
        this.minScore = 200;
        this.die = false;
        this.Xfocus = 0;
        this.Yfocus = 0;
        this.XX = 0;
        this.YY = 0;
        this.names = [
            "ab",
            "cd",
            "ef",
            "gh",
            "ij",
            "kl",
            "mn",
            "op",
            "qr",
            "st",
            "uv",
            "wx",
            "yz",
        ];
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        // this.canvas = document.createElement("canvas");
        // this.context = this.canvas.getContext("2d");
        // document.body.appendChild(this.canvas);
        this.render();
        this.stepCount = 0
        this.die = false;
        for (let i = 0; i < this.Nsnake; i++) {
            console.log("making mysnake", i);
            this.mySnake[i] = new snake(
                this.names[Math.floor(Math.random() * this.names.length)],
                this,
                Math.floor(
                    2 * this.minScore + Math.random() * 2 * this.minScore,
                ),
                (Math.random() - Math.random()) * this.sizeMap,
                (Math.random() - Math.random()) * this.sizeMap,
            );
        }
        this.mySnake[0] = new snake(
            "HaiZuka",
            this,
            this.minScore,
            this.game_W / 2,
            this.game_H / 2,
        );

        for (let i = 0; i < this.NFood; i++) {
            this.FOOD[i] = new food(
                this,
                this.getSize() / (7 + Math.random() * 10),
                (Math.random() - Math.random()) * this.sizeMap,
                (Math.random() - Math.random()) * this.sizeMap,
            );
        }

        // this.loop();
        this.listenMouse();
        this.listenTouch();
    }

    listenTouch() {
        // document.addEventListener("touchmove", evt => {
        //     const touch = evt.touches[0];
        //     this.chX = (touch.pageX - this.game_W / 2) / 15;
        //     this.chY = (touch.pageY - this.game_H / 2) / 15;
        // });
        // document.addEventListener("touchstart", evt => {
        //     const touch = evt.touches[0];
        //     this.chX = (touch.pageX - this.game_W / 2) / 15;
        //     this.chY = (touch.pageY - this.game_H / 2) / 15;
        //     this.mySnake[0].speed = 2;
        // });
        // document.addEventListener("touchend", () => {
        //     this.mySnake[0].speed = 1;
        // });
    }

    listenMouse() {
        // document.addEventListener("mousedown", evt => {
        //     this.update();
        //     this.draw();
        // });
        // document.addEventListener("mousemove", evt => {
        //     const x = evt.offsetX ?? evt.layerX;
        //     const y = evt.offsetY ?? evt.layerY;
        //     this.chX = (x - this.game_W / 2) / 15;
        //     this.chY = (y - this.game_H / 2) / 15;
        // });
        // document.addEventListener("mouseup", () => {
        //     this.mySnake[0].speed = 1;
        // });
    }

    loop() {
        if (this.die) return;
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 30);
    }
    stepGame(x, y) {
        this.chX = (x - this.game_W / 2) / 15;
        this.chY = (y - this.game_H / 2) / 15;
        this.update();
        this.draw();
        this.stepCount+=1
    }

    update() {
        this.render();
        this.unFood();
        this.changeFood();
        this.changeSnake();
        this.updateChXY();
        this.checkDie();

        this.mySnake[0].dx = this.chX;
        this.mySnake[0].dy = this.chY;
        this.XX += this.chX * this.mySnake[0].speed;
        this.YY += this.chY * this.mySnake[0].speed;
        this.mySnake[0].v[0].x = this.XX + this.game_W / 2;
        this.mySnake[0].v[0].y = this.YY + this.game_H / 2;
    }

    updateChXY() {
        while (
            Math.abs(this.chY) * Math.abs(this.chY) +
                Math.abs(this.chX) * Math.abs(this.chX) >
                this.MaxSpeed * this.MaxSpeed &&
            this.chY * this.chX != 0
        ) {
            this.chX /= 1.1;
            this.chY /= 1.1;
        }
        while (
            Math.abs(this.chY) * Math.abs(this.chY) +
                Math.abs(this.chX) * Math.abs(this.chX) <
                this.MaxSpeed * this.MaxSpeed &&
            this.chY * this.chX != 0
        ) {
            this.chX *= 1.1;
            this.chY *= 1.1;
        }

        // this.Xfocus += 1.5 * this.chX * this.mySnake[0].speed;
        // this.Yfocus += 1.5 * this.chY * this.mySnake[0].speed;
        // if (this.Xfocus < 0)
        //     this.Xfocus = this.bg_im.width / 2 + 22;
        // if (this.Xfocus > this.bg_im.width / 2 + 22)
        //     this.Xfocus = 0;
        // if (this.Yfocus < 0)
        //     this.Yfocus = this.bg_im.height / 2 + 60;
        // if (this.Yfocus > this.bg_im.height / 2 + 60)
        //     this.Yfocus = 0;
    }

    changeFood() {
        for (let i = 0; i < this.FOOD.length; i++)
            if (
                Math.sqrt(
                    (this.mySnake[0].v[0].x - this.FOOD[i].x) *
                        (this.mySnake[0].v[0].x - this.FOOD[i].x) +
                        (this.mySnake[0].v[0].y - this.FOOD[i].y) *
                            (this.mySnake[0].v[0].y - this.FOOD[i].y),
                ) > this.sizeMap
            ) {
                this.FOOD[i] = new food(
                    this,
                    this.getSize() / (10 + Math.random() * 10),
                    (Math.random() - Math.random()) * this.sizeMap +
                        this.mySnake[0].v[0].x,
                    (Math.random() - Math.random()) * this.sizeMap +
                        this.mySnake[0].v[0].y,
                );
                // console.log(FOOD[i]);
            }
    }

    changeSnake() {
        // ... existing logic using this.mySnake, etc.
    }

    unFood() {
        if (this.mySnake.length <= 0) return;
        for (let i = 0; i < this.mySnake.length; i++)
            for (let j = 0; j < this.FOOD.length; j++) {
                if (
                    (this.mySnake[i].v[0].x - this.FOOD[j].x) *
                        (this.mySnake[i].v[0].x - this.FOOD[j].x) +
                        (this.mySnake[i].v[0].y - this.FOOD[j].y) *
                            (this.mySnake[i].v[0].y - this.FOOD[j].y) <
                    1.5 * this.mySnake[i].size * this.mySnake[i].size
                ) {
                    this.mySnake[i].score += Math.floor(this.FOOD[j].value);
                    this.FOOD[j] = new food(
                        this,
                        this.getSize() / (5 + Math.random() * 10),
                        (Math.random() - Math.random()) * 5000 + this.XX,
                        (Math.random() - Math.random()) * 5000 + this.YY,
                    );
                }
            }
    }

    checkDie() {
        for (let i = 0; i < this.mySnake.length; i++)
            for (let j = 0; j < this.mySnake.length; j++)
                if (i != j) {
                    let kt = true;
                    for (let k = 0; k < this.mySnake[j].v.length; k++)
                        if (
                            this.range(
                                this.mySnake[i].v[0].x,
                                this.mySnake[i].v[0].y,
                                this.mySnake[j].v[k].x,
                                this.mySnake[j].v[k].y,
                            ) < this.mySnake[i].size
                        )
                            kt = false;
                    if (!kt) {
                        for (let k = 0; k < this.mySnake[i].v.length; k += 5) {
                            this.FOOD[this.index] = new food(
                                this,
                                this.getSize() / (2 + Math.random() * 2),
                                this.mySnake[i].v[k].x +
                                    (Math.random() * this.mySnake[i].size) / 2,
                                this.mySnake[i].v[k].y +
                                    (Math.random() * this.mySnake[i].size) / 2,
                            );
                            this.FOOD[this.index++].value =
                                (0.4 * this.mySnake[i].score) /
                                (this.mySnake[i].v.length / 5);
                            if (this.index >= this.FOOD.length) this.index = 0;
                        }
                        if (i != 0)
                            this.mySnake[i] = new snake(
                                this.names[
                                    Math.floor(Math.random() * 99999) %
                                        this.names.length
                                ],
                                this,
                                Math.max(
                                    Math.floor(
                                        this.mySnake[0].score >
                                            10 * this.minScore
                                            ? this.mySnake[0].score / 10
                                            : this.minScore,
                                    ),
                                    this.mySnake[i].score / 10,
                                ),
                                this.randomXY(this.XX),
                                this.randomXY(this.YY),
                            );
                        else {
                            // window.alert("Your Score: " + Math.floor(mySnake[i].score));
                            this.die = true;
                            // window.location.href = ".";
                        }
                    }
                }
    }

    render() {
        // if (this.canvas.width !== document.documentElement.clientWidth || this.canvas.height !== document.documentElement.clientHeight) {
        //     this.canvas.width = document.documentElement.clientWidth;
        //     this.canvas.height = document.documentElement.clientHeight;
        // this.game_W = this.canvas.width;
        // this.game_H = this.canvas.height;
        this.SPEED = this.getSize() / 7;
        this.MaxSpeed = this.getSize() / 7;
        if (this.mySnake.length == 0) return;
        if (this.mySnake[0].v) {
            this.mySnake[0].v[0].x = this.XX + this.game_W / 2;
            this.mySnake[0].v[0].y = this.YY + this.game_H / 2;
        }
        // }
    }

    draw() {
        this.clearScreen();
        this.FOOD.forEach((food) => food.draw());
        this.mySnake.forEach((snake) => snake.draw());
        this.drawScore();
    }

    drawScore() {
        // ... existing score drawing logic using this.context
    }

    clearScreen() {
        // this.context.clearRect(0, 0, this.game_W, this.game_H);
        // this.context.drawImage(this.bg_im, this.Xfocus, this.Yfocus, 1.5 * this.game_W, 1.5 * this.game_H, 0, 0, this.game_W, this.game_H);
    }

    getSize() {
        const area = this.game_W * this.game_H;
        return Math.sqrt(area / 300);
    }

    range(a, b, c, d) {
        return Math.sqrt((a - c) ** 2 + (b - d) ** 2);
    }

    randomXY(n) {
        return (Math.random() - Math.random()) * this.sizeMap + n;
    }

    isPoint(x, y) {
        return !(
            x - this.XX < -3 * this.getSize() ||
            y - this.YY < -3 * this.getSize() ||
            x - this.XX > this.game_W + 3 * this.getSize() ||
            y - this.YY > this.game_H + 3 * this.getSize()
        );
    }

    updateCanvasSize(width, height) {
        this.game_H = height;
        this.game_W = width;

        for (let i = 0; i < this.Nsnake; i++) {
            this.mySnake[i].game_H = height;
            this.mySnake[i].game_W = width;
        }
        console.log("Canvas size updated to", width, "x", height);
    }

    toJSON() {
        return {
            game_W: this.game_W,
            game_H: this.game_H,
            speed: this.speed,
            MaxSpeed: this.MaxSpeed,
            mySnake: this.mySnake.map((snake) => snake.toJSON()), // Serialize snake objects
            Food: this.FOOD.map((food) => food.toJSON()), // Serialize food objects
            NFood: this.NFood,
            Nsnake: this.Nsnake,
            sizeMap: this.sizeMap,
            index: this.index,
            minScore: this.minScore,
            die: this.die,
            XX: this.XX,
            YY: this.YY,
            Xfocus: this.Xfocus,
            Yfocus: this.Yfocus,
        };
    }
}

export default Game;
