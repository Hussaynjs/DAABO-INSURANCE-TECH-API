const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'please provide first name'],
        min: 3,
        max: 30,
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'please provide first name'],
        min: 3,
        max: 30,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: 'please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlenght: 6
    },
    phoneNumber: {
        type: Number,
        required: [true, 'please provide phone number'],
        unique: true

    },
    companyName:{
        type: String,
        required: [true, 'please provide company name'],
        trim: true
    },
    accountType: {
        type: String,
        enum: ['individual', 'buisness', 'admin'],
        default: 'individual'
    },
    address: {
        type: String,
        required: [true, 'please provide your address'],
        trim: true

    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
})

userSchema.methods.comparePassword = async function(candidatesPassword) {
    const isMatch = await bcrypt.compare(candidatesPassword, this.password)
    return isMatch
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

module.exports = mongoose.model('User', userSchema)