const express = require('express') // Commonjs
// import express from 'express'
// to use ES6 Modules have to add "type": "module" to package.json
let persons = require('./persons')

const app = express()

const cors = require('cors')

app.use(express.static('build'))
app.use(cors())

app.use(express.json())

const morgan = require('morgan')

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
  response.send(`<p>Phonebook has info for ${persons.length} people</p>` +
  '\n' + `<spam> ${new Date()}</spam>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const filteredPerson = persons.find(person => person.id === id)

  if (filteredPerson) {
    response.json(filteredPerson)
  } else {
    response.status(404).json({ error: 'contact not found' })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const isPerson = (persons.filter(person => person.id === id).length >= 1)
  // console.log(isPerson)
  if (!isPerson) {
    response.status(404).end()
  }

  persons = persons.filter(person => person.id !== id)

  // console.log({ persons })

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const newName = request.body.name
  const newNumber = request.body.number

  // const maxId = Math.max(...persons.map(p => p.id))

  const maxId = Math.floor(Math.random() * 1000000)

  if (!newName || !newNumber) {
    return response.status(400).json({ error: 'missing content' })
  } else if (persons.filter(person => person.name.toUpperCase() === newName.toUpperCase()).length > 0) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    name: newName,
    number: newNumber,
    id: maxId + 1
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
