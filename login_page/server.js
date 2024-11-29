const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const CREDENTIALS_FILE = path.join(__dirname, "credentials.txt");

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static")));

// Helper: Load credentials from file
const loadCredentials = () => {
    if (!fs.existsSync(CREDENTIALS_FILE)) return {};
    const data = fs.readFileSync(CREDENTIALS_FILE, "utf8");
    const lines = data.trim().split("\n");
    const credentials = {};
    lines.forEach((line) => {
        const [username, email, password] = line.split(",");
        credentials[username] = { email, password };
    });
    return credentials;
};

// Helper: Save credentials to file
const saveCredentials = (username, email, password) => {
    const entry = `${username},${email},${password}\n`;
    fs.appendFileSync(CREDENTIALS_FILE, entry, "utf8");
};

// Signup endpoint
app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;
    const credentials = loadCredentials();

    if (credentials[username]) {
        return res.status(400).json({ success: false, message: "Username already exists!" });
    }

    saveCredentials(username, email, password);
    return res.status(200).json({ success: true, message: "Account created successfully!" });
});

// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const credentials = loadCredentials();

    if (!credentials[username]) {
        return res.status(400).json({ success: false, message: "Username does not exist!" });
    }

    if (credentials[username].password !== password) {
        return res.status(400).json({ success: false, message: "Incorrect password!" });
    }

    return res.status(200).json({ success: true, message: "Logged in successfully!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

