const Device = require('../models/Device')
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions} = require('../utils')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const createDevice = async(req, res) => {
    req.body.user = req.user.userId;
    const device = await (await Device.create(req.body))
    res.status(StatusCodes.CREATED).json({device})
}

const allDevice = async(req, res) => {

   const devices = await Device.find({})
  
   res.status(StatusCodes.OK).json({devices})

}

const getSingleDevice = async(req, res) => {
    const { id: deviceId } = req.params;

    const device = await Device.findOne({_id: deviceId})

    if(!device){
        throw new CustomError.NotFoundError(`no device with this id: ${deviceId}`)
    }

    checkPermissions(req.user, device.user)
    res.status(StatusCodes.OK).json({device})

   

}

const updateDevice = async(req, res) => {
    const { id: deviceId } = req.params;

    const device = await Device.findOneAndUpdate({_id: deviceId}, req.body, {
        new: true,
        runValidators: true
    })

    if(!device){
        throw new CustomError.NotFoundError(`no device with this id: ${deviceId}`)
    }

    checkPermissions(req.user, device.user)
    res.status(StatusCodes.OK).json({device})
}

const deleteDevice = async(req, res) => {
    const { id: deviceId } = req.params;

    const device = await Device.findOneAndDelete({_id: deviceId})

    if(!device){
        throw new CustomError.NotFoundError(`no device with this id: ${deviceId}`)
    }

    checkPermissions(req.user, device.user)
    res.status(StatusCodes.OK).json({msg: 'device deleted'})

}

const uploadImage = async(req, res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'upload-image2'
        }
    )
    console.log(result);
    fs.unlinkSync( req.files.image.tempFilePath)
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}})
}

module.exports = {
    createDevice,
    allDevice,
    getSingleDevice,
    updateDevice,
    deleteDevice,
    uploadImage
}