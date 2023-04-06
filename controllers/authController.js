const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const Token = require('../models/Token')
const crypto = require('crypto')
const { createTokenUser,
    attachCookiesToResponse,sendVerificationEmail, sendResetPassword,hashPassword} = require('../utils')

const register = async(req, res) => {
    
    const {
        firstName,
         lastName,
         email,
         password,
         phoneNumber,
         companyName,
         address
    
    } = req.body;

    if(!firstName || !lastName || !address || !phoneNumber || !companyName || !email  || !password){
        throw new CustomError.BadRequestError('please provide all values')
    }

    const isEmailAlreadyExist = await User.findOne({email})

    if(isEmailAlreadyExist){
        throw new CustomError.BadRequestError('email already exist')
    }
 const isFirstUser = await User.countDocuments({}) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex')

    const user = await User.create({
        firstName,
        lastName,
        address,
        phoneNumber,
        companyName,
        email,
        password,
        role,
        verificationToken
    })

    const origin = 'localhost:3000'

    await sendVerificationEmail({
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        verificationToken:user.verificationToken,
        origin
    })
    res.status(StatusCodes.CREATED).json({msg: 'success, please check your email to verify account'})
}


const verifyAccount = async(req, res) => {
   
    const {verificationToken, email} = req.body;

    const user = await User.findOne({email})

    if(!user){
        throw new CustomError.UnauthenticatedError('invalid credentials')
    }
if(user.verificationToken !== verificationToken){
    throw new CustomError.UnauthenticatedError('invalid token')
}
user.isVerified = true;
user.verified = Date.now()
user.verificationToken = ''

await user.save()

    res.status(StatusCodes.OK).json({msg: 'success account verifield'})

}


const login = async(req, res) => {
    
    const {email, password} = req.body;

    if(!email || !password){
        throw new CustomError.BadRequestError('please provide email and password')
    }

    const user = await User.findOne({email})

    if(!user){

        throw new CustomError.UnauthenticatedError('invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('invalid credentials')
    }

    if(!user.isVerified){
        throw new CustomError.UnauthenticatedError('please verify your account')
    }

    const tokenUser = createTokenUser(user)

    // creating a new token

    let refreshToken = ''

    const existingToken = await Token.findOne({user: user._id})

    if(existingToken){
        const {isValid} = existingToken;
        if(!isValid){
            throw new CustomError.UnauthenticatedError('invalid credentials')
        }

        refreshToken = existingToken.refreshToken
        attachCookiesToResponse({res, user:tokenUser, refreshToken})

        res.status(StatusCodes.OK).json({tokenUser})
        return
    }
    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip

    const userToken = {refreshToken, userAgent, ip, user: user._id}

    await Token.create(userToken)

    attachCookiesToResponse({res, user:tokenUser, refreshToken})

    res.status(StatusCodes.OK).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        accountType: user.accountType,
        userId: user._id
    })
    

   

}


const logout = async(req, res) => {
    await Token.findOneAndDelete({user: req.user.userId})

    res.cookie('accessToken', 'token', {
        httpOnly: true,
        expires: new Date(Date.now()),
      
    })

    res.cookie('refreshToken', 'token', {
        httpOnly: true,
        expires: new Date(Date.now()),
      
    })
    res.status(StatusCodes.OK).json({messg: "logged out succeful"})

}

const forgotPassword = async(req, res) => {

    const {email} = req.body;

    if(!email){
        throw new CustomError.BadRequestError('please provide email')
    }

    const user = await User.findOne({email})

    if(user){
        const passwordToken = crypto.randomBytes(70).toString('hex')

        // dev uri to the frontend app
        const origin = 'localhost:3000'
        // send verification email

       await  sendResetPassword({
            firstName: user.firstName,
            lastName: user.lastName,
            email:user.email,
            origin,
            token: passwordToken
        })

        const tenMinutes = 1000 * 60 * 60 * 10
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

        user.passwordToken = passwordToken
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;

        await user.save()
    }


    res
    .status(StatusCodes.OK)
    .json({messg: 'please check your email to reset password'})
}

const resetPassword = async(req, res) => {

    const {email, token, password, confirmPassword} = req.body;

    if(!email || !token || !password){
        throw new CustomError.BadRequestError('please provide all value')
    }

    if(password !== confirmPassword){
        if(!email || !token || !password){
            throw new CustomError.BadRequestError('please provide authentic password')
        }

    }

    const user = await User.findOne({email})

    if(user){
        const currentDate = new Date()

        if(user.passwordToken === token && user.passwordTokenExpirationDate > currentDate){
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null

            await user.save()
        }
    }

    res
    .status(StatusCodes.OK)
    .json({messg: 'password updated'})

}





module.exports = {
    register,
    login,
    verifyAccount,
    logout,
    forgotPassword,
    resetPassword
}