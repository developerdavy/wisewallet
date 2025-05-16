const express = require('express')
const env = require('dotenv').config()
const cors = require('cors')

const userRoute = require('./reources/route')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', userRoute) //Users endpoint

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}` )
})