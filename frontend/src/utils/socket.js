/**
 * Socket.IO Client Utility
 * Manages connection to the backend Socket.IO server
 */

import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Initialize socket connection
  connect(serverUrl = 'http://localhost:5000') {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup basic event listeners
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[SOCKET] Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('[SOCKET] Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('[SOCKET] Error:', error);
    });
  }

  // Join general chat room
  joinGeneralChat(userData) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('join-general-chat', userData);
  }

  // Send message to general chat
  sendMessage(message, type = 'text') {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('send-message', { message, type });
  }

  // Leave chat
  leaveChat() {
    if (this.socket) {
      this.socket.emit('leave-chat');
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.socket) return;

    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Remove from stored listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      // Remove all listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.listeners.clear();

      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null
    };
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;