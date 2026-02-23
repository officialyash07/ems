/**
 * Chat REST API Routes
 * Provides HTTP endpoints for chat-related operations
 */

const express = require('express');
const router = express.Router();

// Mock data - in production, use database
let chatHistory = [];
let connectedUsers = [];

// Get chat history
router.get('/history', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const messages = chatHistory
      .slice(-limit - offset, -offset || undefined)
      .reverse();
    
    res.json({
      success: true,
      messages,
      total: chatHistory.length
    });
  } catch (error) {
    console.error('[CHAT API] Error getting history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chat history'
    });
  }
});

// Get online users
router.get('/online-users', (req, res) => {
  try {
    res.json({
      success: true,
      users: connectedUsers,
      count: connectedUsers.length
    });
  } catch (error) {
    console.error('[CHAT API] Error getting online users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get online users'
    });
  }
});

// Get chat statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalMessages: chatHistory.length,
      onlineUsers: connectedUsers.length,
      messagesByRole: {}
    };

    // Count messages by role
    chatHistory.forEach(msg => {
      stats.messagesByRole[msg.role] = (stats.messagesByRole[msg.role] || 0) + 1;
    });

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[CHAT API] Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chat statistics'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'Chat service is running',
    timestamp: new Date()
  });
});

module.exports = router;