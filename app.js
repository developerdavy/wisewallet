const express = require('express')
const env = require('dotenv').config()
const cors = require('cors')

const userRoute = require('./resources/route')

const app = express()

// Enhanced CORS configuration for Android apps
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] // Replace with your actual domains
    : '*'; // Allow all origins in development

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
    optionsSuccessStatus: 200 // For legacy browser support
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api', userRoute) //Users endpoint

const port = process.env.PORT || 5000

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`)
})