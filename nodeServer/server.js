const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());


//start game instance here

// Basic route
app.get("/", (req, res) => {
    res.send("Hello, Node.js server!");
});

app.get("/step", (req, res) => {
    //do step stuff
    //handle game stuff
    res.send("Game stuff")

});

app.get("/reset", (req, res) => {
    //do step stuff
    //handle game stuff
    res.send("Game stuff")

});





// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
