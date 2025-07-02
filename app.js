const express = require('express')
const env = require('dotenv').config()
const cors = require('cors')

const userRoute = require('./reources/route')

const app = express()

// Enhanced CORS configuration for Android apps
app.use(cors({
    origin: '*', // For development - restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api', userRoute) //Users endpoint

const port = process.env.PORT || 5000

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`)
})