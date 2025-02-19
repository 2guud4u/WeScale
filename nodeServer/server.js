import express from "express";
import Game from "./slither.io/js/game.js";
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

let g = null;

//start game instance here

// Basic route
app.get("/", (req, res) => {
    res.send("Hello, Node.js server!");
});

app.get("/step/:x/:y", (req, res) => {
    const x = req.params.x;  // Get 'x' from the URL path
    const y = req.params.y;  // Get 'y' from the URL path

    g.update(x,y)
    
    res.send("snake moved"+ g.mySnake[0]["v"][0]["x"] + " score " + g.mySnake[0].score + "other snake: " + g.mySnake[2]["v"][1].x);
});

app.get("/reset", (req, res) => {
    //reset game env with random
    let game_H = 500;
    let game_W = 500;
    let SPEED = 1;
    let MaxSpeed = 0;
    let mySnake = [];
    let FOOD = [];
    let NFood = 2000;
    let Nsnake = 20;
    let sizeMap = 2000;
    let index = 0;
    let minScore = 200;
    let die = false;

    g = new Game(
        game_W,
        game_H,
        SPEED,
        MaxSpeed,
        mySnake,
        FOOD,
        NFood,
        Nsnake,
        sizeMap,
        index,
        minScore,
        die,
        1
    );
    //handle game stuff
    res.send("Game after reset");
});

app.get("/state", (req, res) => {
    //do step stuff
    //handle game stuff
    res.send("Game stuff");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; // Export the Express app
