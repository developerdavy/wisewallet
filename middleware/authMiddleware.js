
const jwt = require('jsonwebtoken')
const db = require('../resources/connection')

const authenticateToken = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]
        
        if(!token) {
            return res.status(401).json({
                status: 'failed',
                message: 'Access token required'
            })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        
        // Verify user still exists
        const [users] = await db.query('SELECT USER_ID, EMAIL FROM users WHERE USER_ID = ?', [decoded.userId])
        if(users.length === 0) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid token'
            })
        }
        
        req.user = decoded
        next()
        
    } catch(error) {
        res.status(401).json({
            status: 'failed',
            message: 'Invalid token'
        })
    }
}

module.exports = { authenticateToken }
