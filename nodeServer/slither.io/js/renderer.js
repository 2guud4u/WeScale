class Renderer {
    constructor(canvas, ctx, bg_im) {
        this.canvas = canvas;
        this.context = ctx;
        this.gameState = null;
        this.bg_im = bg_im;

        // Set initial canvas size
        this.resizeCanvas();

        // Adjust canvas size when the window is resized
        window.addEventListener('resize', () => this.resizeCanvas());
        this.init();

    }

    init() {
    }


    // Resize canvas to fit the viewport
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context.drawImage(this.bg_im, 0, 0, this.canvas.width, this.canvas.height);

    }

    // Clear the canvas
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.bg_im, this.gameState.Xfocus, this.gameState.Yfocus, 1.5 * this.gameState.game_W, 1.5 * this.gameState.game_H, 0, 0, this.gameState.game_W, this.gameState.game_H);
    }

    updateState(state) {
        this.gameState = state;
    }

    // Render the game state
    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            // this.game_W = this.canvas.width;
            // this.game_H = this.canvas.height;

            // not sure what SPEED does
            SPEED = this.getSize() / 7;
            SPEED = 1;

            this.gameState.MaxSpeed = this.getSize() / 7;
            if (this.gameState.mySnake.length == 0)
                return;
            if (this.gameState.mySnake[0].v != null) {
                this.gameState.mySnake[0].v[0].x = this.gameState.XX + this.gameState.game_W / 2;
                this.gameState.mySnake[0].v[0].y = this.gameState.YY + this.gameState.game_H / 2;
            }
        }
    }

    draw(){
        this.clearCanvas();
        console.log(this.gameState.mySnake)
        console.log("snakelen: ", this.gameState.mySnake.length)
        // for (let i = 0; i < this.gameState.mySnake; i++)
        //     this.drawSnake(this.gameState.mySnake[i]);
        this.gameState.mySnake.forEach(snake => {
            this.drawSnake(snake);
        });
        for (let i = 0; i < this.gameState.Food.length; i++)
            this.drawFood(this.gameState.Food[i]);
    }

    // Draw a single snake, needs updating
    drawSnake(snake) {
        console.log("testing snake")
        console.log(snake.snake_length - 1)
        for (let i = snake.snake_length - 1; i >= 1; i--){
            // console.log("snake body #", i)
            if (this.isPoint(snake.v[i].x, snake.v[i].y)){
                console.log("drawing snake body", snake.v[i].x, snake)
                // const img = new Image();
                // img.src = snake.bd_im;
                // this.context.drawImage(img, snake.v[i].x - this.gameState.XX - (snake.size) / 2, snake.v[i].y - this/this.gameState.YY - (snake.size) / 2, snake.size, snake.size);
                this.context.beginPath();
                this.context.arc(
                    snake.v[i].x - snake.size / 4 - this.gameState.XX,
                    snake.v[i].y - snake.size / 4 - this.gameState.YY,
                    20,
                    0,
                    Math.PI * 2,
                    false,
                );
                this.context.fillStyle = "#FFFFFF";
                this.context.fill();
                this.context.closePath();
            }
        }
        this.context.save();
        // this.context.translate(snake.v[0].x - this.gameState.XX, snake.v[0].y - this.gameState.YY);
        // this.context.rotate(snake.angle - Math.PI / 2);
        // const head = new Image();
        // head.src = snake.sn_im;
        // this.context.drawImage(head, -this.size / 2, -this.size / 2, this.size, this.size);
        // this.context.restore();
        console.log("done drawing snake")
    }

    // Draw food (if the game has it)
    drawFood(food) {
        if (this.isPoint(food.x, food.y )) {
            this.context.beginPath();
            this.context.arc(
                food.x - food.size / 4 - this.gameState.XX,
                food.y - food.size / 4 - this.gameState.YY,
                food.size / 2,
                0,
                Math.PI * 2,
                false,
            );
            this.context.fillStyle = food.color;
            this.context.fill();
            this.context.closePath();
        }
    }

    getSize(){
        var area = this.gameState.game_W * this.gameState.game_H;
        return Math.sqrt(area / 300);
    }



    isPoint(x, y) {
        if (x - this.gameState.XX < -3 * this.getSize()) return false;
        if (y - this.gameState.YY < -3 * this.getSize()) return false;
        if (x - this.gameState.XX > this.gameState.game_W + 3 * this.getSize()) return false;
        if (y - this.gameState.YY > this.gameState.game_H + 3 * this.getSize()) return false;
        return true;
    }
}

export default Renderer;