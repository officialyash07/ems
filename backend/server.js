const app = require("./app");
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize chat socket
require('./sockets/chat.socket')(io);

// Start server only when run directly (local dev / container).
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO server initialized`);
  });
}

// Export app for serverless platforms (Vercel) and tests
module.exports = app;
