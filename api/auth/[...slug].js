// This is a Vercel-specific handler for auth routes
const app = require('../../dist/app').default;

module.exports = (req, res) => {
    // Log request details for debugging
    console.log(`${req.method} request to ${req.url}`);

    // For OPTIONS requests, respond directly with CORS headers
    if (req.method === 'OPTIONS') {
        // Set all required CORS headers
        res.setHeader('Access-Control-Allow-Origin', 'https://break-your-boredom.vercel.app');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

        // Send 200 OK for preflight requests
        return res.status(200).end();
    }

    // Add CORS headers for non-OPTIONS requests too
    res.setHeader('Access-Control-Allow-Origin', 'https://break-your-boredom.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle all other requests with the Express app
    return app(req, res);
};