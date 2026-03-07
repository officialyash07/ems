const app = require("./app");
const { connectDB } = require("./config/db");

require('dotenv').config();


const PORT = process.env.PORT || 5000;

// Start server only when run directly (local dev / container).
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });}

// Export app for serverless platforms (Vercel) and tests
module.exports = app;