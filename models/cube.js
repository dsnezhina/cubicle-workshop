const mongoose = require('mongoose')

const CubeSchema = new mongoose.Schema({
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
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  accessories: [{
    type: 'ObjectId',
    ref: 'Accessory'
  }],
  creatorId: {
    type: 'ObjectID', 
    ref: 'User'
  }
})

CubeSchema.path("imageUrl").validate(function (url) {
  return (url.startsWith('http://') || url.startsWith('https://'))
}, "Image URL is not valid!")

module.exports = mongoose.model('Cube', CubeSchema)