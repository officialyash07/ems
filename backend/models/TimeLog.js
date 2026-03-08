const mongoose = require('mongoose');
const { toISTISOString } = require('../utils/time');

const timeLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  loginTime: {
    type: Date,
    required: true
  },
  loginTimeIST: {
    type: String
  },
  logoutTime: {
    type: Date,
    default: null
  },
  logoutTimeIST: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // in milliseconds
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdAtIST: {
    type: String
  }
});

// Calculate duration when logout time is set
timeLogSchema.pre('save', function(next) {
  if (this.loginTime) {
    this.loginTimeIST = toISTISOString(this.loginTime);
  }

  if (this.logoutTime && this.loginTime) {
    this.logoutTimeIST = toISTISOString(this.logoutTime);
    this.duration = this.logoutTime - this.loginTime;
    this.isActive = false;
  }

  if (this.createdAt) {
    this.createdAtIST = toISTISOString(this.createdAt);
  }

  next();
});

// Index for querying user sessions
timeLogSchema.index({ userId: 1, loginTime: -1 });
timeLogSchema.index({ isActive: 1 });

module.exports = mongoose.model('TimeLog', timeLogSchema);
