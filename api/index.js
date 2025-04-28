const app = require('../dist/app').default;

module.exports = async (req, res) => {
    // Set CORS headers - allow the specific frontend domain
    res.setHeader('Access-Control-Allow-Origin', 'https://break-your-boredom.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        // Preflight requests need a 204 No Content response
        res.statusCode = 204;
        res.end();
        return;
    }

    // Forward other requests to Express app
    return app(req, res);
};