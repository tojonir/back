const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/employee'

mongoose.connect(url)
    .then(()=>{
        console.log('connected')
    })
    .catch((err)=>{ 
        console.error(err)
    })

const employeesSchema = new mongoose.Schema({
    Matricule: {type : String, unique: true},
    Name: String,
    gender: String,
    Age: Number,
    Category: String,
    StartDate: { type: Date, Default: Date.now }
})

module.exports = mongoose.model('employee', employeesSchema)
