const mongoose = require('mongoose')


const deviceSchema = new mongoose.Schema({
    deviceType: {
        type: String,
        enum: ['mobile phone', 'computer', 'laptop', 'ipad/tablet', 'smart watch', 'television', 'home theater', 
         'appliance', 'gaming gear', 'camera', 'pos device', 'printer', 'monitor/desktop', 'drone', 'solar power system',
         'projector', 'misc electronics', 
    ],
    default: 'mobile phone'
    },
    deviceManufacturer:{
        type: String,
        required: [true, 'please provide the device manufacturer']

    },
    deviceModel: {
        type: String,
        required: [true, 'please provide the device model']
    },
    serialNumber:{
        type: Number,
        required: [true, 'please provide the device model']

    },
    deviceCondition: {
        type: String,
        enum: ['london used', 'fairly used', 'brand new', 'fairly used with damages', 'has some damages', 'has some physical damges'],
        default: 'brand new'
    },
    deviceImage: {
        type: String,
        required: [true, 'please upload the image for your device']
    },
    plans:{
        type: String,
        enum: ['starter plan', 'premium plan', 'edutech plan', 'travel plan', 'event plan', 'hotel/stay plan'],
        default: 'starter plan'
    },
    user: {
        type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    }
})


module.exports = mongoose.model('Device', deviceSchema)