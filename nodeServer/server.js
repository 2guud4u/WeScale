import { createServer } from "http"; // Importing createServer
import express from "express";
import { WebSocketServer } from "ws"; // Importing WebSocketServer

import Game from "./slither.io/js/game.js";

const app = express();
const server = createServer(app); // Use createServer to handle both HTTP requests and WebSocket

const wss = new WebSocketServer({ server }); // Create WebSocket server attached to the same HTTP server

const PORT = process.env.PORT || 3000;
let g = null;


// Basic route
app.get("/", (req, res) => {
    res.send("Hello, Node.js server!");
});

app.get("/step", (req, res) => {
    //do step stuff
    //handle game stuff
    let gameState = g.getState(); //assuming this returns game state
    console.log(gameState);
    
    res.json({
        snake: gameState.snake,  //adjust based on actual data
        food: gameState.food,
        score: gameState.score,
        alive: gameState.alive
    });
});

// Default game start state, for testing purposes
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

console.log("Printing game context")
console.log(g.context)


// Basic route
app.get("/", (req, res) => {
    res.send("Hello, Node.js server!");
});

app.get("/step", (req, res) => {
    let gameState = g.getState();
    console.log(gameState);
    res.send(""); // Respond with game state or an empty response
});

// app.get("/reset", (req, res) => {
//     let game_H = 500;
//     let game_W = 500;
//     let SPEED = 1;
//     let MaxSpeed = 0;
//     let mySnake = [];
//     let FOOD = [];
//     let NFood = 2000;
//     let Nsnake = 20;
//     let sizeMap = 2000;
//     let index = 0;
//     let minScore = 200;
//     let die = false;

//     g = new Game(
//         game_W,
//         game_H,
//         SPEED,
//         MaxSpeed,
//         mySnake,
//         FOOD,
//         NFood,
//         Nsnake,
//         sizeMap,
//         index,
//         minScore,
//         die,
//         1
//     );
//     res.send("Game after reset");
// });

app.get("/state", (req, res) => {
    //do step stuff
    //handle game stuff
    let gameState = g.getState();
    if (!gameState) {
        res.status(500).json({ error: "Failed to get game state" });
    } else {
        res.send(gameState);
    }
});

// WebSocket connection handler
wss.on("connection", (ws) => {
    console.log("New client connected");
    
    // Send initial game state to the client
    if (g) {
        console.log("Sending game state to client");
        // ws.send(JSON.stringify(g.getContext())); // Send game state as JSON
        ws.send(JSON.stringify([{"message": "hello"}, ])); // Send game state as JSON
    }

    // Function to broadcast the game state to the current client
    const uploadGameState = () => {
        if (g) {
            try {
                // const gameState = g.getContext(); // Or g.getState() if you have fixed the circular reference
                // ws.send(JSON.stringify(gameState));
                ws.send(JSON.stringify(g.toJSON())); // Send game state as JSON
                console.log("Sent game state to client");
            } catch (err) {
                console.error("Error sending game state:", err);
            }
        }
    };

    // Start sending game state at regular intervals (e.g., every 100ms)
    const intervalId = setInterval(() => {
        if (ws.readyState === ws.OPEN) { // Check if connection is still open
            uploadGameState();
            console.log("Uploaded game state");
        }
    }, 30); // Interval in milliseconds (adjust based on your needs)


    // Handle game step updates or any other interaction
    ws.on("message", (message) => {
        console.log("Received: %s", message);
        // Respond to the game updates or interactions here
        // E.g., handle user input, game step updates, etc.

        const data = JSON.parse(message);



        if (data.type === 'canvasResize') {
            console.log('New canvas size:', data.data.width, data.data.height);
            // Do something with the new dimensions, if necessary
            g.updateCanvasSize(data.data.width, data.data.height);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
