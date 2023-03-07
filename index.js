const express = require('express') // Commonjs
// import express from 'express'
// to use ES6 Modules have to add "type": "module" to package.json
let persons = require('./persons')

const app = express()

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>klk</h1>')
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

  console.log({ filteredPerson })

  if (filteredPerson) {
    response.json(filteredPerson)
  } else {
    response.status(404).json({ error: 'contact not found' })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(person => person.id !== id)

  console.log({ persons })

  response.status(204)
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

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
