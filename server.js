const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
    // Initial state goes here
    teamGoals: [0, 0, 0, 0, 0]  // Assuming there are 5 teams
};

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Send the current game state to the newly connected client
    ws.send(JSON.stringify({ type: 'updateGameState', gameState }));
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'completeGoal') {
            const teamIndex = data.teamIndex;
            
            // Update the game state here based on the completed goal
            gameState.teamGoals[teamIndex] += 1;
            
            // Broadcast updated gameState to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'updateGameState', gameState }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Get current state
app.get('/state', (req, res) => {
    res.json(gameState);
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

