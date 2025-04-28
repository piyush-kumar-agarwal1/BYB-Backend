// Simple health check endpoint

module.exports = (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running!' });
};