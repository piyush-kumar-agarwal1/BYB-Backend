const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB:", process.env.MONGODB_URI ? "URI exists" : "No URI found");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

// Load User model if not already loaded
let User;
try {
    User = mongoose.model('User');
    console.log("User model retrieved from mongoose");
} catch {
    console.log("Creating new User model schema");
    const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    // Add password comparison method
    userSchema.methods.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    };

    User = mongoose.model('User', userSchema);
}

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = async (req, res) => {
    console.log(`Login endpoint hit with method: ${req.method}`);

    // Set CORS headers for ALL requests including OPTIONS
    res.setHeader('Access-Control-Allow-Origin', 'https://break-your-boredom.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log("Responding to OPTIONS request with 200");
        return res.status(200).end();
    }

    // Only proceed with POST requests
    if (req.method !== 'POST') {
        console.log(`Method not allowed: ${req.method}`);
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Connect to the database
        await connectDB();
        console.log("Connected to MongoDB for login request");

        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);

        // Validate input
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find the user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log(`User found: ${user.name}, validating password`);
        // Validate password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log("Password validation failed");
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id.toString());
        console.log("Generated JWT token for user");

        // Send response
        console.log("Login successful, sending response");
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};