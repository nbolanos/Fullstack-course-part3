require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

let persons = []

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  const phoneBookCount = persons.length
  const currentDate = new Date()
  const message = `<p>Phonebook has info for ${phoneBookCount} people</p>\n${currentDate}`
  response.send(message)
})

const generateId = () => {
  const maxId = persons.length > 0 
  ? Math.floor(Math.random() * 10000)
  : 0
  return String(maxId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  const unique = Person.findById(request.params.id).then(p => p.id === person.id ? false : true)

  if(!unique) {
    return response.status(400).json({
      error: 'Name is not unique'
    })
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Console running on server ${PORT}`)
})