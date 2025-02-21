import { createCanvas, loadImage } from "canvas";

class snake {
    constructor(name, score, x, y, game_W, game_H) {
        this.name = name;
        this.score = score;
        this.x = x;
        this.y = y;
        this.Nball = 13;
        this.game_W = game_W;
        this.game_H = game_H;
        this.v = [];

        this.init();
    }

    getSize() {
        var area = this.game_W * this.game_H;
        return Math.sqrt(area / 300);
    }

    init() {
        this.time = Math.floor(20 + Math.random() * 100);
        this.speed = 1;
        this.size = this.getSize() * 1;
        this.angle = 0;
        this.dx = Math.random() * this.MaxSpeed - Math.random() * this.MaxSpeed;
        this.dy = Math.random() * this.MaxSpeed - Math.random() * this.MaxSpeed;

        this.v = [];
        for (let i = 0; i < 50; i++) this.v[i] = { x: this.x, y: this.y };
        // this.sn_im = new Image();
        this.sn_im = "images/head.png";
        // this.bd_im = new Image();
        this.bd_im =
            "images/body/" +
            (Math.floor(Math.random() * 999999) % this.Nball) +
            ".png";

        // loadImage("public/images/head.png")
        //     .then((img) => {
        //         this.sn_im = img;
        //         //console.log("Image loaded in Node.js!");
        //     })
        //     .catch((err) => console.error("Image loading error:", err));

        // loadImage(
        //     "public/images/body/" +
        //         (Math.floor(Math.random() * 999999) % this.Nball) +
        //         ".png",
        // )
        //     .then((img) => {
        //         this.bd_im = img;
        //         //console.log("Image loaded in Node.js!");
        //     })
        //     .catch((err) => console.error("Image loading error:", err));
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

    update() {
        this.time--;
        this.angle = this.getAngle(this.dx, this.dy);
        if (this.name != "HaiZuka") {
            if (this.time > 90) this.speed = 2;
            else this.speed = 1;
            if (this.time <= 0) {
                this.time = Math.floor(10 + Math.random() * 20);
                this.dx =
                    Math.random() * this.MaxSpeed -
                    Math.random() * this.MaxSpeed;
                this.dy =
                    Math.random() * this.MaxSpeed -
                    Math.random() * this.MaxSpeed;

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
                if (minRange < Math.sqrt(game_W * game_W + game_H * game_H))
                    this.time = 0;
                // console.log(minRange);

                while (
                    Math.abs(this.dy) * Math.abs(this.dy) +
                        Math.abs(this.dx) * Math.abs(this.dx) >
                        this.MaxSpeed * this.MaxSpeed &&
                    this.dx * this.dy != 0
                ) {
                    this.dx /= 1.1;
                    this.dy /= 1.1;
                }
                while (
                    Math.abs(this.dy) * Math.abs(this.dy) +
                        Math.abs(this.dx) * Math.abs(this.dx) <
                        this.MaxSpeed * this.MaxSpeed &&
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
            if (this.name == "Tifany Sugar") {
                console.log("im moving", this.v[2]);
            }
        }
        if (this.score < 200) return;
        if (this.speed == 2) this.score -= this.score / 2000;
        let csUp = Math.pow(this.score / 1000, 1 / 5);
        this.size = (this.getSize() / 2) * csUp;
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
        //         this.game.context.drawImage(this.bd_im, this.v[i].x - XX - (this.size) / 2, this.v[i].y - YY - (this.size) / 2, this.size, this.size);

        // this.game.context.save();
        // this.game.context.translate(this.v[0].x - XX, this.v[0].y - YY);
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

    toString() {
        return `snake location: ${this.x} ${this.y}`;
    }
}

export default snake;
