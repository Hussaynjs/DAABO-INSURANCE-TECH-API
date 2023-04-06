const sendEmail = require('./sendEmail')

const sendResetPassword = async({firstName,lastName, email, token, origin}) => {

    const resetPasswordUri = `${origin}/user/reset-passowrd?email=${email}&token=${token}`

    const message = `please click the link to reset your password <a href="${resetPasswordUri}">reset</a>`
    const sendToken = `<p>please copy the code to reset your password on postman code:  ${token}</p>`

    await sendEmail({
        to: email,
        subject: 'Reset Password',
        html: `<h1>hello $${firstName} ${lastName}</h1>
         ${message}
         ${sendToken}
        `
    })
}


module.exports = sendResetPassword