// Vercel serverless entry point for the aircraft catalog.
// Reuse the Express route so local and hosted behavior stay identical.
const { app } = require('../apps/backend/server/server');

module.exports = app;
