require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

//let persons = []

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

const handleErrors = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(500).send({ error: 'Name too short or invalid phone number format' })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//Get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//Get person by specific ID match
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  
  Person.find({}).then(result => {
    response.send(`<p>Phonebook has info for ${result.length} people</p>\n${currentDate}`)
  })
})

/*const generateId = () => {
  const maxId = persons.length > 0 
  ? Math.floor(Math.random() * 10000)
  : 0
  return String(maxId)
}*/

//Add a new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body) {
    return response.status(400).json({ error: 'content missing!' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  /*const unique = Person.findById(request.params.id).then(p => p.id === person.id ? false : true)

  if(!unique) {
    return response.status(400).json({
      error: 'Name is not unique'
    })
  }*/

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
  .catch(error => {
    next(error)
  })
})

//Update matching person to DB
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id).then(person => {
    if(!person) {
      return result.status(404).end()
    }

    person.name = name
    person.number = number

    return person.save().then(updatedPerson => {
      result.json(updatedPerson)
    })
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Console running on server ${PORT}`)
})