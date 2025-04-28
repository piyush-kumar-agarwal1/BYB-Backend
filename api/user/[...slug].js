// This file handles all requests to /api/user/* routes

// Import your Express app
const app = require('../../dist/app').default;

module.exports = (req, res) => {
    // Handle OPTIONS preflight requests directly
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://break-your-boredom.vercel.app');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(200).end();
    }

    // For all other requests, use your Express app
    return app(req, res);
};