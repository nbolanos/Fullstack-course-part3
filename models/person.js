const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB', error.message)
    })

    const personSchema = mongoose.Schema({
        name: String,
        number: String,
    })

    personSchema.set('toJSON', {
        transform: (document, requestedObject) => {
            requestedObject.id = requestedObject._id
            delete requestedObject._id
            delete requestedObject.__v
        }
    })

    module.exports = mongoose.model('Person', personSchema)