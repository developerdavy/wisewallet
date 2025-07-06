
const db = require('../resources/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Login user
const loginUser = async(req, res) => {
    const { email, password } = req.body
    
    try {
        // Validate input
        if(!email || !password) {
            return res.status(400).json({
                status: 'failed',
                message: 'Email and password are required'
            })
        }
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE EMAIL = ?', [email])
        if(users.length === 0) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid credentials'
            })
        }
        
        const user = users[0]
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD_HASH)
        if(!isPasswordValid) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid credentials'
            })
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.USER_ID, 
                email: user.EMAIL 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        )
        
        // Remove password from response
        const { PASSWORD_HASH, ...userWithoutPassword } = user
        
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: token,
            user: userWithoutPassword
        })
        
    } catch(error) {
        console.error('Login error:', error)
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error'
        })
    }
}

// Logout user (client-side token removal)
const logoutUser = async(req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Logout successful'
    })
}

// Verify token and get user info
const verifyToken = async(req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        
        if(!token) {
            return res.status(401).json({
                status: 'failed',
                message: 'No token provided'
            })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        
        // Get user info
        const [users] = await db.query('SELECT * FROM users WHERE USER_ID = ?', [decoded.userId])
        if(users.length === 0) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid token'
            })
        }
        
        const { PASSWORD_HASH, ...userWithoutPassword } = users[0]
        
        res.status(200).json({
            status: 'success',
            user: userWithoutPassword
        })
        
    } catch(error) {
        res.status(401).json({
            status: 'failed',
            message: 'Invalid token'
        })
    }
}

module.exports = {
    loginUser,
    logoutUser,
    verifyToken
}
