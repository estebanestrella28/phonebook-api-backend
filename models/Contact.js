const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const contactSchema = new Schema({

  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },

  number: {
    type: String,
    minlength: 8,
    required: true
  }

})

contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const Contact = model('Contact', contactSchema)

module.exports = Contact
