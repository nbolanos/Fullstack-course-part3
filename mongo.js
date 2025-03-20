const mongoose = require('mongoose')

const processLength = process.argv.length

if(processLength < 5 && processLength !== 3) {
    console.log('Missing password, user, or number')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nikkolife25:${password}@cluster0.rprbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(processLength === 3) {
    console.log('Phonebook:')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}