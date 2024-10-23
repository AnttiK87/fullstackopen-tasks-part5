// Model for blogs that are added to the db

// Dependencies
const mongoose = require('mongoose')

// "Blueprints" for blog in the db and settings for validation
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },     
  likes:{
    type: Number,
    default: 0 // likes default 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Editing how user data is returned as JSON
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


// Exports
module.exports = mongoose.model('Blog', blogSchema)