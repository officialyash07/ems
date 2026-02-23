const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.path}`);
  next();
});

// expose uploads with proper headers for downloads
app.use('/uploads', (req, res, next) => {
  console.log(`[uploads] Serving file: ${req.path}`);
  res.header('Content-Disposition', 'inline'); // Change to 'attachment' if you want to force download
  res.header('Cache-Control', 'public, max-age=3600');
  express.static(path.join(__dirname, 'uploads'))(req, res, next);
});

const taskRoutes = require('./modules/tasks/task.routes');
const submissionsRoutes = require('./modules/submissions/submissions.routes');
const chatRoutes = require('./modules/chat/chat.routes');

app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[error-handler] Caught error:', err.message);
  console.error('[error-handler] Stack:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message, 
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

app.get('/', (req, res) => {
	res.send('OWMS Backend Running');
});

module.exports = app;
