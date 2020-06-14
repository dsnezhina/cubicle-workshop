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

AccessorySchema.path("imageUrl").validate(function (url) {
  return (url.startsWith('http://') || url.startsWith('https://'))
}, "Image URL is not valid!")

module.exports = mongoose.model('Accessory', AccessorySchema)