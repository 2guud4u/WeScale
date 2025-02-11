

import express from "express";
import Game from "./slither.io/js/game.js"
import game from "./slither.io/js/game.js";
const app = express();


const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

let game_H = 0;
let game_W = 0;
let SPEED = 1;
let MaxSpeed = 0;
// let chX = chY = 1;
let mySnake = [];
let FOOD = [];
let NFood = 2000;
let Nsnake = 20;
let sizeMap = 2000;
let index = 0;
let minScore = 200;
let die = false;

var g = new Game(game_W, game_H, SPEED, MaxSpeed, mySnake, FOOD, NFood, 
    Nsnake, sizeMap, index, minScore, die);


//start game instance here

// Basic route
app.get("/", (req, res) => {
    res.send("Hello, Node.js server!");
});

app.get("/step", (req, res) => {
    //do step stuff
    //handle game stuff
    res.send("Game after step")

});

app.get("/reset", (req, res) => {
    //do step stuff
    //handle game stuff
    res.send("Game after reset")
});

app.get("/state", (req, res) => {
    //do step stuff
    //handle game stuff
    res.send("Game stuff")
});






// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; // Export the Express app