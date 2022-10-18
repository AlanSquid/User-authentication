const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const User = require('./models/user')


const app = express()
require('./config/mongoose')

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.render('login', { result: '請輸入帳號密碼' })
  }
  User.findOne({ email, password })
    .lean()
    .then(user => {
      if (!user) {
        res.render('login', { result: '帳號或密碼錯誤，請重新輸入' })
      } else {
        res.render('index', { firstName: user.firstName })
      }
    })

  // 帳號驗證作法二:
  // if (!email || !password) {
  //   return res.render('login', { result: '請輸入帳號密碼' })
  // }
  // User.findOne({ email })
  //   .lean()
  //   .then(user => user ? user : res.render('login', { result: '查無此帳號，請先進行註冊' }))
  //   .then(user => {
  //     if (user.password !== password) {
  //       res.render('login', { result: '密碼錯誤!' })
  //     } else {
  //       res.render('index', { firstName: user.firstName })
  //     }
  //   })
  //   .catch(err => console.log(err))
})

app.listen(3000, () => {
  console.log(`Express is listening on http://localhost:3000`)
})