const express = require('express')
const exphbs = require('express-handlebars')
const User = require('./models/user')
const cookieParser = require('cookie-parser')

const app = express()
require('./config/mongoose')

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('secret'))

app.get('/', (req, res) => {
  const { login, user } = req.signedCookies
  User.findOne({ firstName: user })
    .lean()
    .then(user => {
      if (login && user) {
        res.render('index', { firstName: user.firstName })
      } else {
        res.render('login')
      }
    })
    .catch(err => console.log(err))

})

// 帳號驗證作法一:
app.post('/', (req, res) => {
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
        res.cookie('login', true, { signed: true })
        res.cookie('user', user.firstName, { signed: true })
        res.render('index', { firstName: user.firstName })
      }
    })
    .catch(err => console.log(err))

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