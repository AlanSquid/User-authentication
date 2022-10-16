const db = require('../../config/mongoose')
const User = require('../user')
const userList = require('./users.json').users

db.once('open', () => {
  User.create(userList)
  console.log('done!')
})