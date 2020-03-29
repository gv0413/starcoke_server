if(process.env.NODE_ENV !== 'prodyction'){
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport =  require('./passport-config')
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.use(express.json())
// app.set('view-engine', 'ejs')
// app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// app.get('/', checkAuthenticated, (req, res) =>{
//   res.render('index.ejs', {name : req.user.name })
// })

app.get('/dino', (req, res) =>{
  // res.send({
  //   result: true,
  //   data: 'dino',
  // })
  res.send(true)
})

// app.get('/login',checkNotAuthenticated, (req, res)=> {
//   res.render('login.ejs')
// })

// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

// app.get('/register', checkNotAuthenticated, (req, res)=> {
//   res.render('register.ejs')
// })

// app.post('/register', checkNotAuthenticated, async (req, res)=> {
//   try{
//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     users.push({
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword
//     })
//     res.redirect('/login')
//   } catch {
//     res.redirect('/register')
//   }
//   console.log(users)
// })

app.post('/login', (req, res)=> {
  const user = users.find(e => e.email === req.body.email)
  if( user && user.password === req.body.password){
    res.send({
      res: true,
      data: 'Login success!',
    })
  }
  else{
    res.send({
      res: false,
      data: 'Login failed!',
    })
  }
})

let users = []

app.post('/register', (req, res) => {
  res.send({
    res: true,
    data: 'Register success!',
  })

  if (!users.find(e => e.name === req.body.name)) {
    users.push({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
  }

  console.log(`users = ${JSON.stringify(users)}`)
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

// function checkAuthenticated(req, res, next)  {
//   if(req.isAuthenticated()) {
//     return next()
//   }

//   res.redirect('/login')
// }

// function checkNotAuthenticated(req, res, next) {
//   if(req.isAuthenticated()){
//     res.redirect('/')
//   }
//   next()
// }
app.listen(3000, () => {
  console.log(`http://localhost:3000`);
})

