const nodemailer = require('nodemailer')
const nodemailerConfiq = require('./nodemailerConfiq')

const sendEmail = async({to, subject, html}) => {
    let testAccount = await nodemailer.createTestAccount();


    const transporter = nodemailer.createTransport(nodemailerConfiq);

    return  transporter.sendMail({
        from: '"Hussaini musa 👻" <hussayn@gmail.com>', // sender address
        to,
        subject,
        html
      });
    
}

module.exports = sendEmail