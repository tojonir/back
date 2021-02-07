const express = require('express')
const Joi = require('joi')
//const Database = require('./database')
const route = require('./router/employee')

const app = express()
app.use(express.json())
app.use('/',route)


const port = process.env.port || 3000
app.listen(port,()=>{console.log('Server listen on port ' + port)})