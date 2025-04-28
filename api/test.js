module.exports = (req, res) => {
    console.log(`Test endpoint hit with method: ${req.method}`);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://break-your-boredom.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Respond with success for any other method
    return res.status(200).json({
        success: true,
        message: 'Test endpoint working correctly',
        method: req.method,
        timestamp: new Date().toISOString()
    });
};