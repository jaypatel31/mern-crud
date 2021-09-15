const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI)
mongoose.connection.on("connected",()=>{
    console.log("connected to mongo yeahh!!")
})
mongoose.connection.on("error",()=>{
    console.log("Error connecting ",err)
})

require('./models/user')

app.use(express.json())
app.use(require('./routes/user'))


const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})