const app = require('../dist/app').default;

module.exports = async (req, res) => {
    // Set CORS headers - allow the specific frontend domain
    res.setHeader('Access-Control-Allow-Origin', 'https://break-your-boredom.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight OPTIONS request more explicitly
    if (req.method === 'OPTIONS') {
        // Set status code to 200 instead of 204 for wider compatibility
        res.statusCode = 200;
        // Ensure all headers are properly set for OPTIONS
        res.setHeader('Content-Length', '0');
        res.setHeader('Content-Type', 'text/plain');
        res.end();
        return;
    }

    try {
        // Forward other requests to Express app
        return app(req, res);
    } catch (error) {
        console.error('API error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Server error' }));
    }
};