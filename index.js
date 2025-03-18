const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
      "id" : "5",
      "name" : "Angie Flores Hernandez",
      "number" : "621190719",
    },
    {
      "id" : "6",
      "name" : "Nikko Bolanos",
      "number" : "210-980-8018"
    },
]

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if(person) {
    response.json(person)
  } else {
    response.status(404).send('Unable to find person matching the requested id')
  }
})

app.get('/info', (request, response) => {
  const phoneBookCount = persons.length
  const currentDate = new Date()
  const message = `<p>Phonebook has info for ${phoneBookCount} people</p>\n${currentDate}`
  response.send(message)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
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

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  const unique = persons.find(p => p.name === person.name) ? false : true

  if(!unique) {
    return response.status(400).json({
      error: 'Name is not unique'
    })
  }

  persons = persons.concat(person)

  response.json(person)
})

const port = 3001
app.listen(port, () => {
    console.log(`Console running on server ${port}`)
})