const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB Error!')
})

db.once('open', () => {
  console.log('MongoDB Connected!')
})

module.exports = db