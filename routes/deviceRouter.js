const express = require('express')
const router = express.Router()
const {auth, authorizePermissions} = require('../middleware/auth')
const {
    createDevice,
    allDevice,
    getSingleDevice,
    updateDevice,
    deleteDevice,
    uploadImage
} = require('../controllers/deviceController')


router.route('/').post(auth, createDevice).get(auth, allDevice)
router.route('/uploadImage').post(auth, uploadImage)
router.route('/:id').get(auth, getSingleDevice,).patch(auth, updateDevice).delete(auth, deleteDevice)




module.exports = router