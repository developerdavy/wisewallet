const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully')
        connection.release()
    })
    .catch(error => {
        console.error('Database connection failed:', error.message)
    })

module.exports = pool.promise()