const { status, get } = require('express/lib/response')
const db =  require('../reources/connection')
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

        res.status(200).json({
            status : 'success',
            users : users
        })

        
    } catch (error) {

        res.status(500).json({
            status : 'Failed to fetch users',
            message : error.message
        })
        
    }
}

const createUser = async(req, res) => {
    const { email, password, first_name, last_name, phone_number, } = req.body

    const hashed_password = await bcrypt.hash(password, 10)

    try {

        const [result] = await db.query('insert into users (email, password, first_name, last_name, phone_number) values (?, ?, ?, ?, ?)',
             [email, hashed_password, first_name, last_name, phone_number])

             res.status(200).json({
                status : 'success',
                message : 'User created successfully',
                user : {
                    id : result.insertId,
                    email,
                    first_name,
                    last_name,
                    phone_number,
                    phone_number
                }
             })
        
    } catch (error) {

        res.status(500).json({
            status : 'Failed to create user',
            message : error.message
        })
        
    }
}

module.exports = {
    getAllUsers,
    createUser
}