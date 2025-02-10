const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
    res.send("Hello, Node.js server!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
