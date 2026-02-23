/**
 * General Chat Room Socket Implementation
 * Supports all user roles: intern, team_lead, manager, admin, cto, cfo, coo, ceo
 * Features: Real-time messaging, user presence, message history
 */

const chatSocket = (io) => {
  // Store connected users and their info
  const connectedUsers = new Map();
  const chatHistory = []; // In production, use database

  // User roles for validation
  const VALID_ROLES = [
    'intern', 'team_lead', 'manager', 'admin', 
    'cto', 'cfo', 'coo', 'ceo'
  ];

  io.on('connection', (socket) => {
    console.log(`[CHAT] New connection: ${socket.id}`);

    // Handle user joining the general chat room
    socket.on('join-general-chat', (userData) => {
      try {
        const { userId, username, role, avatar } = userData;

        // Validate user data
        if (!userId || !username || !role) {
          socket.emit('error', { message: 'Invalid user data' });
          return;
        }

        if (!VALID_ROLES.includes(role)) {
          socket.emit('error', { message: 'Invalid user role' });
          return;
        }

        // Join the general chat room
        socket.join('general-chat');

        // Store user information
        connectedUsers.set(socket.id, {
          userId,
          username,
          role,
          avatar: avatar || null,
          joinedAt: new Date(),
          socketId: socket.id
        });

        console.log(`[CHAT] User joined: ${username} (${role}) - Socket: ${socket.id}`);

        // Send current chat history to the newly joined user
        socket.emit('chat-history', {
          messages: chatHistory.slice(-50), // Send last 50 messages
          success: true
        });

        // Send current online users list
        const onlineUsers = Array.from(connectedUsers.values()).map(user => ({
          userId: user.userId,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          joinedAt: user.joinedAt
        }));

        socket.emit('online-users', { users: onlineUsers });

        // Notify others about new user joining
        socket.to('general-chat').emit('user-joined', {
          userId,
          username,
          role,
          avatar,
          joinedAt: new Date(),
          message: `${username} joined the chat`
        });

        // Update online users for all clients
        io.to('general-chat').emit('online-users', { users: onlineUsers });

      } catch (error) {
        console.error('[CHAT] Error in join-general-chat:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Handle sending messages
    socket.on('send-message', (messageData) => {
      try {
        const user = connectedUsers.get(socket.id);
        
        if (!user) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        const { message, type = 'text' } = messageData;

        if (!message || message.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        // Create message object
        const chatMessage = {
          id: Date.now() + Math.random(), // Simple ID generation
          userId: user.userId,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          message: message.trim(),
          type,
          timestamp: new Date(),
          socketId: socket.id
        };

        // Store message in history (in production, save to database)
        chatHistory.push(chatMessage);

        // Keep only last 100 messages in memory
        if (chatHistory.length > 100) {
          chatHistory.shift();
        }

        console.log(`[CHAT] Message from ${user.username} (${user.role}): ${message}`);

        // Broadcast message to all users in general chat
        io.to('general-chat').emit('new-message', chatMessage);

        // Send confirmation to sender
        socket.emit('message-sent', { 
          success: true, 
          messageId: chatMessage.id,
          timestamp: chatMessage.timestamp
        });

      } catch (error) {
        console.error('[CHAT] Error in send-message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      
      if (user) {
        console.log(`[CHAT] User disconnected: ${user.username} (${user.role})`);

        // Remove from connected users
        connectedUsers.delete(socket.id);

        // Notify others about user leaving
        socket.to('general-chat').emit('user-left', {
          userId: user.userId,
          username: user.username,
          role: user.role,
          message: `${user.username} left the chat`
        });

        // Update online users list
        const onlineUsers = Array.from(connectedUsers.values()).map(u => ({
          userId: u.userId,
          username: u.username,
          role: u.role,
          avatar: u.avatar,
          joinedAt: u.joinedAt
        }));

        io.to('general-chat').emit('online-users', { users: onlineUsers });
      }
    });

    // Handle manual leave chat
    socket.on('leave-chat', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        socket.leave('general-chat');
        connectedUsers.delete(socket.id);

        socket.to('general-chat').emit('user-left', {
          userId: user.userId,
          username: user.username,
          role: user.role,
          message: `${user.username} left the chat`
        });

        // Update online users list
        const onlineUsers = Array.from(connectedUsers.values()).map(u => ({
          userId: u.userId,
          username: u.username,
          role: u.role,
          avatar: u.avatar,
          joinedAt: u.joinedAt
        }));

        io.to('general-chat').emit('online-users', { users: onlineUsers });
      }
    });
  });

  // Cleanup function for graceful shutdown
  const cleanup = () => {
    connectedUsers.clear();
    console.log('[CHAT] Socket cleanup completed');
  };

  // Handle process termination
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);

  console.log('[CHAT] General chat socket initialized');
};

module.exports = chatSocket;