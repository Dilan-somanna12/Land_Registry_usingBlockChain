const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var cors = require('cors')
const server = require('./backend/Controller/user')
const bankRoutes = require('./backend/Controller/bankController')
const surveyorRoutes = require('./backend/Controller/surveyorController')
const mortgageRoutes = require('./backend/Controller/mortgageController')
const surveyRoutes = require('./backend/Controller/surveyController')
const app = express()
const config = require('./backend/Config/db_config')


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose
  .connect(
    config.MongoURI,
  )
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))
var port = process.env.PORT || 3001

app.use('/', server)
app.use('/api/bank', bankRoutes)
app.use('/api/surveyor', surveyorRoutes)
app.use('/api/mortgage', mortgageRoutes)
app.use('/api/survey', surveyRoutes)



app.listen(port)
console.log('App is running on port ' + port)
