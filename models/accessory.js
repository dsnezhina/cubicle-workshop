const mongoose = require('mongoose')

const AccessorySchema = new mongoose.Schema({
  //Id - (ObjectId)
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000 //max length validation
  },
  imageUrl: {
    type: String,
    required: true,
    // http/https validation
  },
  cubes: [{
    type: 'ObjectId',
    ref: "Cube"
  }]
})

module.exports = mongoose.model('Accessory', AccessorySchema)