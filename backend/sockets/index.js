/**
 * Socket.IO Main Index
 * Initializes all socket modules
 */

const chatSocket = require('./chat.socket');

const initializeSockets = (io) => {
  console.log('[SOCKETS] Initializing all socket modules...');
  
  // Initialize chat socket
  chatSocket(io);
  
  // Add other socket modules here as needed
  // Example: meetingSocket(io);
  // Example: notificationSocket(io);
  
  console.log('[SOCKETS] All socket modules initialized successfully');
};

module.exports = initializeSockets;