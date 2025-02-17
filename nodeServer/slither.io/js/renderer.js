class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Set initial canvas size
        this.resizeCanvas();

        // Adjust canvas size when the window is resized
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // Resize canvas to fit the viewport
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Clear the canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Render the game state
    render(gameState) {
        this.clearCanvas();

        // Draw each snake
        gameState.snakes.forEach(snake => {
            this.drawSnake(snake);
        });

        // Draw food (if applicable)
        if (gameState.food) {
            this.drawFood(gameState.food);
        }
    }

    // Draw a single snake
    drawSnake(snake) {
        snake.body.forEach((segment, index) => {
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, snake.size, 0, 2 * Math.PI);

            // Different colors for the head and body
            this.ctx.fillStyle = index === 0 ? 'red' : snake.color;
            this.ctx.fill();
        });
    }

    // Draw food (if the game has it)
    drawFood(food) {
        food.forEach(item => {
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, item.size, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'yellow';
            this.ctx.fill();
        });
    }
}

export default Renderer;