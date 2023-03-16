const { model, Schema } = require('mongoose')

const contactSchema = new Schema({
  name: String,
  number: String

})

contactSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const Contact = model('Contact', contactSchema)

module.exports = Contact
