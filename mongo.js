const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI

mongoose.set('strictQuery', false)

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database Connected')
  }).catch((error) => {
    console.log(error.message)
  })

// const contact = new Contact({
//   name: 'Esteban Manuel',
//   number: '828-546-7853'
// })

// contact.save()
//   .then(res => {
//     console.log(res)
//     mongoose.connection.close()
//   }).catch((err) => {
//     console.log(err)
//   })
