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
const jwt = require('jsonwebtoken');
const { getConfigByIdAndName } = require('./config')
const { checkUserExistByEmail, users } = require('./user')
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.use(express.json())
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET || 'tmpSecretKey',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.post('/register', async (req, res)=> {
  try{
    const duplicatedEmail = checkUserExistByEmail(req.body.email);
    if (duplicatedEmail) {
      res.status(400)
         .send({
           res: false,
           data: 'Eamil already exist.',
         })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: users.length,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.send({
      res: true,
      data: 'Register success!',
    })
  } catch {
    res.status(400)
    .send({
      res: false,
      data: 'Register failed',
    })
  }
  console.log(users)
})

app.post('/login', async (req, res)=> {
  const user = users.find(e => e.email === req.body.email)
  if( user && await bcrypt.compare(req.body.password, user.password)){
    // create user config
    try {
      const userConfig = await getConfigByIdAndName(user.id, user.name);
      // create jwt token
      const token = jwt.sign({
        email: user.email,
        name: user.name,
        config: userConfig,
      }, process.env.ENCRYPT_KEY);
      res.send({
        res: true,
        data: {
          jwtToken: token,
        },
      })
      console.log(`current User Index = ${user.id} userAddress = ${userConfig.walletAddress.user}`)
    } catch (e) {
      res.status(400)
        .send(e)
    }
  }
  else{
    res.send({
      res: false,
      data: 'Login failed!',
    })
  }
})

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
})