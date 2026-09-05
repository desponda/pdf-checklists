// Vercel serverless entry point for PDF generation.
// Reuse the Express route so local and hosted behavior stay identical.
const { app } = require('../apps/backend/server/server');

module.exports = app;
