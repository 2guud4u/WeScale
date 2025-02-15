import { createCanvas, loadImage } from "canvas";
import snake from "./snake.js"
import Food from "./food.js"

function getGameState() {
    console.log("Getting game state...");  // Add this line
    let snake = this.mySnake[0];  // Player-controlled snake
    
    // Check if snake exists
    if (!snake) {
        console.error("Snake not found!");
        return null;
    }
    
    console.log("Snake object:", snake);  // Add this line
    
    let state = {
        ssnake: snake.toJSON(),
        food: FOOD.map(f => ({ x: f.x, y: f.y })),
        is_dead: die,
        score: snake.score,
        size: snake.size,
    };
    
    console.log("Generated state:", state);  // Add this line
    return state;
}

function sendGameState() {
    const state = getGameState();
    console.log("Attempting to send state:", state);  // Log the state being sent
    
    fetch("http://localhost:5000/state", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(state)
    })
    .then(response => {
        console.log("Response received:", response.status);  // Log the response status
        return response.json();
    })
    .then(data => console.log("Server response:", data))
    .catch(err => console.error("Error sending game state:", err));
}

let names = ["Ahmed Steinke",
    "Aubrey Brass",
    "Johanne Boothe",
    "Sunni Markland",
    "Tifany Sugar",
    "Latonya Tully",
    "Bobette Huckaby",
    "Daryl Nowicki",
    "Lizeth Kremer",
    "Chiquita Pitt",
    "Christinia Siler",
    "Rena Reep",
    "Evan Mcknight",
    "Sofia Freeland",
    "Virgie Vaughns",
    "Kit Polen",
    "Emma Rutland",
    "Queen Guertin",
    "Cecily Pasquariello",
    "Palmer Myer",
    "Kera Quinton",
    "Domonique Diebold",
    "Henriette Sockwell",
    "Adeline Pettway",
    "Shu Osby",
    "Shantay Wallner",
    "Isaias Drewes",
    "Lettie Gatz",
    "Remona Maravilla",
    "Jessenia Mick",
    "Noelle Rickey",
    "Lavon Revard",
    "Shavonne Stogsdill",
    "Hailey Razo",
    "Bart Somerville",
    "Hannah Masker",
    "Frederica Farmer",
    "Glennie Thorpe",
    "Sherrell Arriaga",
    "Lawanda Maines",
    "Douglass Watts",
    "Naida Grund",
    "Branda Bussiere",
    "Carmelo Savory",
    "Gabriela Blanchette",
    "Tran Huf",
    "Antoinette Hinrichs",
    "Deborah Primmer",
    "Drusilla Mcvea",
    "Charlsie Acy",
    "Nadene Royce",
    "Danette Touchet",
    "Luana Endo",
    "Elvina Hibbitts",
    "Ludivina Dahle",
    "Fabiola Mcwhirter",
    "Isabella Mosier",
    "Lon Lassiter",
    "Laurence Hanning",
    "NamZ Bede",
];

class DeterministicRandom {
    constructor(seed) {
      this.seed = seed % 2147483647; // Ensure seed is within range
      if (this.seed <= 0) this.seed += 2147483646;
    }
  
    next() {
      this.seed = this.seed * 16807 % 2147483647;
      return (this.seed - 1) / 2147483646;
    }
  }


class game {
    constructor(
        game_W,
        game_H,
        speed,
        MaxSpeed,
        mySnake,
        FOOD,
        NFood,
        Nsnake,
        sizeMap,
        index,
        minScore,
        die,
        seed,
    ) {
        this.game_W = game_W;
        this.game_H = game_H;
        this.canvas = null;
        this.context = null;
        this.loopID;
        this.speed = speed;
        this.MaxSpeed = MaxSpeed;
        this.mySnake = mySnake;
        this.Food = FOOD;
        this.NFood = NFood;
        this.Nsnake = Nsnake;
        this.sizeMap = sizeMap;
        this.index = index;
        this.minScore = minScore;
        this.die = die;
        this.Xfocus = 0;
        this.Yfocus = 0;
        this.XX = 0;
        this.YY = 0;
        this.chY = 0;
        this.chX = 0;
        this.bg_im = null;
        this.random = new DeterministicRandom(seed)
        loadImage("public/images/Map2.png")
            .then((img) => {
                this.bg_im = img;
                //console.log("Image loaded in Node.js!");
            })
            .catch((err) => console.error("Image loading error:", err));
        this.init();

    }

    init() {
        // this.canvas = document.createElement("canvas");
        // this.context = this.canvas.getContext("2d");
        // document.body.appendChild(this.canvas);
        // this.canvas = createCanvas(800, 600)
        // this.context = this.canvas.getContext("2d");
        // this.render();
        console.log("random",this.random)
        for (let i = 0; i < this.Nsnake; i++)
            this.mySnake[i] = new snake(
                names[Math.floor(this.random.next() * 99999) % names.length],
                this,
                Math.floor(
                    2 * this.minScore + this.random.next() * 2 * this.minScore,
                ),
                (this.random.next() - this.random.next()) * this.sizeMap,
                (this.random.next() - this.random.next()) * this.sizeMap,
            );

        this.mySnake[0] = new snake(
            "HaiZuka",
            this,
            0,
            this.game_W / 2,
            this.game_H / 2,
        );
        for (let i = 0; i < this.NFood; i++) {
            let newFood = new Food(
                this,
                this.getSize() / (7 + this.random.next() * 10),
                (this.random.next() - this.random.next()) * this.sizeMap,
                (this.random.next() - this.random.next()) * this.sizeMap,
            );
            this.Food[i] = newFood;
        }

        this.loop();

        this.listenMouse();
        this.listenTouch();
    }

    getState() {
        return this.mySnake;
    }
    listenTouch() {
        // document.addEventListener("touchmove", evt => {
        //     var y = evt.touches[0].pageY;
        //     var x = evt.touches[0].pageX;
        //     this.chX = (x - this.game_W / 2) / 15;
        //     this.chY = (y - this.game_H / 2) / 15;
        // })
        // document.addEventListener("touchstart", evt => {
        //     var y = evt.touches[0].pageY;
        //     var x = evt.touches[0].pageX;
        //     this.chX = (x - this.game_W / 2) / 15;
        //     this.chY = (y - this.game_H / 2) / 15;
        //     this.mySnake[0].speed = 2;
        // })
        // document.addEventListener("touchend", evt => {
        //     this.mySnake[0].speed = 1;
        // })
    }

    listenMouse() {
        // document.addEventListener("mousedown", evt => {
        //     var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
        //     var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
        //     this.mySnake[0].speed = 2;
        // })
        // document.addEventListener("mousemove", evt => {
        //     var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
        //     var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
        //     this.chX = (x - this.game_W / 2) / 15;
        //     this.chY = (y - this.game_H / 2) / 15;
        // })
        // document.addEventListener("mouseup", evt => {
        //     var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
        //     var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
        //     this.mySnake[0].speed = 1;
        // })
    }

    loop() {
        if (this.die) return;

        // let now = window.performance.now();
        // // console.log(`Time since last loop: ${now - lastLoopTime} ms`);
        // lastLoopTime = now;

        this.update();
        // this.update();
        // this.update();
        // this.draw();

        if (this.loopID) {
            clearTimeout(this.loopID);
        }
        this.loopID = setTimeout(() => this.loop(), 30);
    }

    update(inputX, inputY) {
        let chX = (inputX - this.game_W / 2) / 15;
        let chY = (inputY - this.game_H / 2) / 15;
        // this.render();
        this.unFood();
        this.changeFood();
        this.changeSnake();
        this.updateChXY();
        this.checkDie();

        this.mySnake[0].dx = chX;
        this.mySnake[0].dy = chY;
        this.XX += chX * this.mySnake[0].speed;
        this.YY += chY * this.mySnake[0].speed;
        this.mySnake[0].v[0].x = this.XX + this.game_W / 2;
        this.mySnake[0].v[0].y = this.YY + this.game_H / 2;
        //return game state
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

        this.Xfocus += 1.5 * this.chX * this.mySnake[0].speed;
        this.Yfocus += 1.5 * this.chY * this.mySnake[0].speed;
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
        for (let i = 0; i < this.Food.length; i++)
            if (
                Math.sqrt(
                    (this.mySnake[0].v[0].x - this.Food[i].x) *
                        (this.mySnake[0].v[0].x - this.Food[i].x) +
                        (this.mySnake[0].v[0].y - this.Food[i].y) *
                            (this.mySnake[0].v[0].y - this.Food[i].y),
                ) > this.sizeMap
            ) {
                this.Food[i] = new Food(
                    this,
                    this.getSize() / (10 + this.random.next() * 10),
                    (this.random.next() - this.random.next()) * this.sizeMap +
                        this.mySnake[0].v[0].x,
                    (this.random.next() - this.random.next()) * this.sizeMap +
                        this.mySnake[0].v[0].y,
                );
                // console.log(FOOD[i]);
            }
    }

    changeSnake() {
        for (let i = 0; i < this.mySnake.length; i++)
            if (
                Math.sqrt(
                    (this.mySnake[0].v[0].x - this.mySnake[i].v[0].x) *
                        (this.mySnake[0].v[0].x - this.mySnake[i].v[0].x) +
                        (this.mySnake[0].v[0].y - this.mySnake[i].v[0].y) *
                            (this.mySnake[0].v[0].y - this.mySnake[i].v[0].y),
                ) > this.sizeMap
            ) {
                this.mySnake[i].v[0].x =
                    (this.mySnake[0].v[0].x + this.mySnake[i].v[0].x) / 2;
                this.mySnake[i].v[0].y =
                    (this.mySnake[0].v[0].y + this.mySnake[i].v[0].y) / 2;
            }
    }

    unFood() {
        if (this.mySnake.length <= 0) return;
        for (let i = 0; i < this.mySnake.length; i++)
            for (let j = 0; j < this.Food.length; j++) {
                if (
                    (this.mySnake[i].v[0].x - this.Food[j].x) *
                        (this.mySnake[i].v[0].x - this.Food[j].x) +
                        (this.mySnake[i].v[0].y - this.Food[j].y) *
                            (this.mySnake[i].v[0].y - this.Food[j].y) <
                    1.5 * this.mySnake[i].size * this.mySnake[i].size
                ) {
                    this.mySnake[i].score += Math.floor(this.Food[j].value);
                    this.Food[j] = new Food(
                        this,
                        this.getSize() / (5 + this.random.next() * 10),
                        (this.random.next() - this.random.next()) * 5000 + this.XX,
                        (this.random.next() - this.random.next()) * 5000 + this.YY,
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
                            this.Food[index] = new Food(
                                this,
                                this.getSize() / (2 + this.random.next() * 2),
                                this.mySnake[i].v[k].x +
                                    (this.random.next() * this.mySnake[i].size) / 2,
                                this.mySnake[i].v[k].y +
                                    (this.random.next() * this.mySnake[i].size) / 2,
                            );
                            this.Food[index++].value =
                                (0.4 * this.mySnake[i].score) /
                                (this.mySnake[i].v.length / 5);
                            if (index >= this.Food.length) index = 0;
                        }

                        if (i != 0) {
                            this.mySnake[i] = new snake(
                                names[
                                    Math.floor(this.random.next() * 99999) %
                                        names.length
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
                        } else {
                            console.log("Game Over! Restarting...");
                            this.restartGame();
                        }
                    }
                }
    }

    // render() {
    //     if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
    //         this.canvas.width = document.documentElement.clientWidth;
    //         this.canvas.height = document.documentElement.clientHeight;
    //         this.game_W = this.canvas.width;
    //         this.game_H = this.canvas.height;
    //         SPEED = this.getSize() / 7;
    //         SPEED = 1;
    //         this.MaxSpeed = this.getSize() / 7;
    //         if (this.mySnake.length == 0)
    //             return;
    //         if (this.mySnake[0].v != null) {
    //             this.mySnake[0].v[0].x = this.XX + this.game_W / 2;
    //             this.mySnake[0].v[0].y = this.YY + this.game_H / 2;
    //         }
    //     }
    // }

    // draw() {
    //     this.clearScreen();
    //     for (let i = 0; i < this.Food.length; i++)
    //         this.Food[i].draw();
    //     for (let i = 0; i < this.mySnake.length; i++)
    //         this.mySnake[i].draw();
    //     this.drawScore();
    // }

    restartGame() {
        die = false;
        this.mySnake = [];
        this.FOOD = [];
        this.XX = 0;
        this.YY = 0;
        this.chX = this.chY = 1;

        // Reset speed variables
        SPEED = 1; // Reset speed to default
        this.MaxSpeed = this.getSize() / 7; // Restore max speed

        // Reinitialize player snake
        this.mySnake[0] = new snake(
            "HaiZuka",
            this,
            this.minScore,
            this.game_W / 2,
            this.game_H / 2,
        );
        this.mySnake[0].speed = 1; // Explicitly reset player snake's speed

        // Reinitialize AI snakes
        for (let i = 1; i < Nsnake; i++) {
            this.mySnake[i] = new snake(
                names[Math.floor(this.random.next() * 99999) % names.length],
                this,
                Math.floor(
                    2 * this.minScore + this.random.next() * 2 * this.minScore,
                ),
                (this.random.next() - this.random.next()) * this.sizeMap,
                (this.random.next() - this.random.next()) * this.sizeMap,
            );
            this.mySnake[i].speed = 1; // Reset AI snake speeds
        }

        // Reinitialize food
        for (let i = 0; i < this.NFood; i++) {
            this.Food[i] = new Food(
                this,
                this.getSize() / (7 + this.random.next() * 10),
                (this.random.next() - this.random.next()) * this.sizeMap,
                (this.random.next() - this.random.next()) * this.sizeMap,
            );
        }

        // Restart the game loop
        this.loop();
    }

    // drawScore() {
    //     let data = [];
    //     for (let i = 0; i < this.mySnake.length; i++)
    //         data[i] = this.mySnake[i];
    //     for (let i = 0; i < data.length - 1; i++)
    //         for (let j = i + 1; j < data.length; j++)
    //             if (data[i].score < data[j].score) {
    //                 let t = data[i];
    //                 data[i] = data[j];
    //                 data[j] = t;
    //             }
    //     let index = 0;
    //     for (let i = 1; i < this.mySnake.length; i++)
    //         if (data[i].name == "HaiZuka")
    //             index = i;
    //     this.context.font = this.getSize() / 4 + 'px Arial Black';
    //     for (let i = 0; i < 10; i++) {
    //         this.context.fillStyle = "#AA0000";
    //         if (i == index)
    //             this.context.fillStyle = "#CC99FF";
    //         this.context.fillText("#" + (i + 1), 3 * this.game_W / 4, this.getSize() / 2 * (i + 1));
    //         this.context.fillText(data[i].name, 3 * this.game_W / 4 + this.game_W / 24, this.getSize() / 2 * (i + 1));
    //         this.context.fillText(Math.floor(data[i].score), 3 * this.game_W / 4 + this.game_W / 5.5, this.getSize() / 2 * (i + 1));
    //     }
    //     if (index > 9) {
    //         this.context.fillStyle = "#CC99FF";
    //         this.context.fillText("#" + (index + 1), 3 * this.game_W / 4, this.getSize() / 2 * (10 + 1));
    //         this.context.fillText(data[index].name, 3 * this.game_W / 4 + this.game_W / 24, this.getSize() / 2 * (10 + 1));
    //         this.context.fillText(Math.floor(data[index].score), 3 * this.game_W / 4 + this.game_W / 5.5, this.getSize() / 2 * (10 + 1));
    //     }
    // }

    // clearScreen() {
    //     this.context.clearRect(0, 0, this.game_W, this.game_H);
    //     // this.context.drawImage(this.bg_im, this.Xfocus, this.Yfocus, 1.5 * this.game_W, 1.5 * this.game_H, 0, 0, this.game_W, this.game_H);
    // }

    getSize() {
        var area = this.game_W * this.game_H;
        return Math.sqrt(area / 300);
    }

    range(a, b, c, d) {
        return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
    }

    randomXY(n) {
        let ans = 0;
        while (Math.abs(ans) < 1) {
            ans = 3 * this.random.next() - 3 * this.random.next();
        }
        return ans * this.sizeMap + n;
    }

    isPoint(x, y) {
        if (x - this.XX < -3 * this.getSize()) return false;
        if (y - this.YY < -3 * this.getSize()) return false;
        if (x - this.XX > this.game_W + 3 * this.getSize()) return false;
        if (y - this.YY > this.game_H + 3 * this.getSize()) return false;
        return true;
    }
}

export default game;
