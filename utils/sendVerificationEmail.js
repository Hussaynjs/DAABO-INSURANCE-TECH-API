const sendEmail = require('./sendEmail')


const sendVerificationEmail = async({firstName,lastName, email, verificationToken, origin}) => {

    // fronntend uri
    const verifyEmail = `${origin}/user/verify-email?email=${email}&token=${verificationToken}`

    const message = `<p>please click on the following link to verify email: <a href="${verifyEmail}">click here</a> </p>`
    const sendToken = `<p>please copy the code to verify your account on postman code:  ${verificationToken}</p>`
    return sendEmail({
        to: email,
        subject: 'Email Verification',
        html: `<h1>hello ${firstName} ${lastName}</h1>
        ${message}
        ${sendToken}
        `
    })

}

module.exports = sendVerificationEmail