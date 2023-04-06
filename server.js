console.log('Daabo insurance tech');
require('express-async-errors')
require('dotenv').config()

const express = require('express')
const app = express()

// rest of the packages

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API,
    api_secret:process.env.CLOUD_SECRET
})


// routes
const authRouter = require('./routes/authRouter')
const deviceRouter = require('./routes/deviceRouter')


// middleware
const notFoundErrorMiddleware = require('./middleware/notFoundMiddleware')
const errohHandlerMiddleware = require('./middleware/errorHandlerMiddleware')


// connection
const connectDB = require('./db/connect')

const port = process.env.PORT || 5000

app.use(express.json())
app.use(fileUpload({useTempFiles: true}))
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/device', deviceRouter)
app.use(notFoundErrorMiddleware)
app.use(errohHandlerMiddleware)


const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server is listening on port ${port}`);
        })
    } catch (error) {
        console.log('unable to connect to database');
        
    }
}


start()
