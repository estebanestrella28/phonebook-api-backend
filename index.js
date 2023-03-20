require('dotenv').config()
require('./mongo')
const Contact = require('./models/Contact')
const express = require('express') // Commonjs
// import express from 'express'
// to use ES6 Modules have to add "type": "module" to package.json
const morgan = require('morgan')
const cors = require('cors')
const handleErrors = require('./middlewares/handleErrors')
const unknownEndpoint = require('./middlewares/unknownEndpoint')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
// app.use(morgan('tiny'))

morgan.token('content', function (req, res) {
  return JSON.stringify(req.body) || '-'
})

morgan.token('param', function (req, res, param) {
  return JSON.stringify(req.params[param]) || '-'
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :content - :param[id]'))

// Note the "content" logging data even in the console can be dangerous since it can contain sensitive data and may violate local privacy law (e.g. GDPR in EU) or business-standard. In this exercise, you don't have to worry about privacy issues, but in practice, try not to log any sensitive data.

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
  Contact.find({}).then(res => {
    response.send(`<p>Phonebook has info for ${res.length} people</p>` +
    '\n' + `<spam> ${new Date()}</spam>`)
  })
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Contact.findById(id).then(contact => {
    console.log(contact)
    if (contact) {
      response.json(contact)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Contact.findByIdAndRemove(id).then(res => {
    console.log(res)
    response.status(204).end()
  }).catch(error => {
    next(error)
  })
})

app.post('/api/persons', (request, response, next) => {
  const newName = request.body.name
  const newNumber = request.body.number

  if (!newName || !newNumber) {
    return response.status(400).json({ error: 'missing content' })
  }

  const contact = new Contact({
    name: newName,
    number: newNumber
  })

  contact.save()
    .then(savedcontact => {
      response.json(savedcontact)
    })
    .catch(error => {
      console.log(error.name)
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const changedContact = request.body

  Contact.findByIdAndUpdate(id, changedContact, { new: true, runValidators: true }).then(contact => {
    response.json(contact)
  }).catch(error => next(error))
})

app.use(handleErrors)

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
