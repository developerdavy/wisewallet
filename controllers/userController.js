const db = require('../resources/connection')
const bcrypt = require('bcrypt')

// Get all users

const getAllUsers = async(req, res) =>{
    try {

        const [users] = await db.query('select * from users')

        if(users.length === 0){
            return res.status(404).json({
                status : 'failed',
                message : 'No users found'
            })
        }

        const usersWithoutPasswords = users.map(user => {
            const { PASSWORD_HASH, ...userWithoutPassword } = user
            return userWithoutPassword
        })
        
        res.status(200).json({
            status : 'success',
            users : usersWithoutPasswords
        })

        
    } catch (error) {

        console.error('Database error:', error)
        res.status(500).json({
            status : 'failed',
            message : 'Internal server error'
        })
        
    }
}

const createUser = async(req, res) => {
    const { email, password, first_name, middle_name, last_name, phone_number } = req.body

    try {
        // Check if fields are empty first
        if(!email || !password || !first_name || !last_name || !phone_number){
            return res.status(400).json({
                status : 'failed',
                message : 'All fields are required'
            })
        }

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({
                status : 'failed',
                message : 'Invalid email address'
            })
        }

        // check if the password is strong
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        if(!passwordRegex.test(password)){
            return res.status(400).json({
                status : 'failed',
                message : 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'
            })
        }

        // Check if the phone number is valid
        const phoneRegex = /^\d{10}$/
        if(!phoneRegex.test(phone_number)){
            return res.status(400).json({
                status : 'failed',
                message : 'Invalid phone number'
            })
        }

        // Check if the user already exists
        const [existingUser] = await db.query('select * from users where EMAIL = ?', [email])
        if(existingUser.length > 0){
            return res.status(409).json({
                status : 'failed',
                message : 'User already exists'
            })
        }

        const hashed_password = await bcrypt.hash(password, 10)
        const created_at = new Date()
        const updated_at = new Date()

        // Add the user to the database
        const [result] = await db.query('insert into users (EMAIL, PASSWORD_HASH, FIRST_NAME, MIDDLE_NAME, LAST_NAME, PHONE, CREATED_AT, UPDATED_AT) values (?, ?, ?, ?, ?, ?, ?, ?)',
             [email, hashed_password, first_name, middle_name, last_name, phone_number, created_at, updated_at])

        res.status(201).json({
            status : 'success',
            message : 'User created successfully',
            user : {
                id : result.insertId,
                email,
                first_name,
                middle_name,
                last_name,
                phone_number
            }
        })
        
    } catch (error) {
        console.error('Database error:', error)
        res.status(500).json({
            status : 'failed',
            message : 'Failed to create user'
        })
    }
}

// Get user by id
const getUserById = async(req, res) => {
    const { id } = req.params
    
    try{
        const [user] = await db.query('select * from users where USER_ID = ?', [id])

        if(user.length === 0){
            return res.status(404).json({
                status : 'failed',
                message : 'User not found'
            })
        }

        const { PASSWORD_HASH, ...userWithoutPassword } = user[0]
        res.status(200).json({
            status : 'success',
            user : userWithoutPassword
        })
        
    } catch(error){
        console.error('Database error:', error)
        res.status(500).json({
            status : 'failed',
            message : 'Internal server error'
        })
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById
}