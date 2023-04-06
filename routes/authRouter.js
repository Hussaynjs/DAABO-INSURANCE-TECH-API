const express = require('express')
const router = express.Router()
const {auth, authorizePermissions} = require('../middleware/auth')

const {
    register,
    login,
    verifyAccount,
    logout,
    forgotPassword,
    resetPassword
} = require('../controllers/authController')


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)
router.route('/verify-account').post(verifyAccount)
router.route('/logout').delete(auth, logout)







module.exports = router