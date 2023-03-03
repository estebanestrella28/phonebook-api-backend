const express = require('express') // Commonjs
// import express from 'express'
// to use ES6 Modules have to add "type": "module" to package.json
const persons = require('./persons')

const app = express()

app.get('/', (request, response) => {
  response.send('<h1>Hola</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
