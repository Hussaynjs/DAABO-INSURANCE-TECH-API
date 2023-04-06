const { createJwt,
    isTokenValid, attachCookiesToResponse} = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermissions = require('./checkPermissions')
const sendVerificationEmail = require('./sendVerificationEmail')
const  sendResetPassword = require('./sendResetPassword')

    module.exports = {
        createJwt,
        isTokenValid,
        createTokenUser,
        attachCookiesToResponse,
        checkPermissions,
        sendResetPassword,
        sendVerificationEmail
    }

