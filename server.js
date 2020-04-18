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

let users = [];
const defaultConfig = {
  chainId: '5300575914426995782',
  mt: {
    symbol: 'FT9754',
  },
  st: {
    symbol: 'DST01',
  },
  walletAddress: {
    pd: '',
    user: ''
  },
  dapp: {
    apiKey: ''
  },
  txActionName: {
    like: 'like',
    funding: 'funding',
    purchase: 'purchase',
    getOwner: 'getOwner',
    setOwner: 'setOwner'
  },
  userName: '',
}
const dynamicConfig = [
  {
    apiKey: 'G2auRtGRzre2GoXXGZLYzZqawfLfBi2Prn9miWW65iRQTyLe9ASeicUYwbKVD416',
    user: '0x3e877a621a56d7785f3525f542f1adc5dcaeb3c2',
    pd: '0x773f69537fd1a47fdd9adae3a1181daaa4d3b168',
  },
  {
    apiKey: 'hLM6r3oQ7jyGW1VoLra3ciy6ZczKJVTLGQgZSbzPYLM4UvZWytjcdBJBAqX6w2E3',
    user: '0x5c2b51025301da8893c3fbb0075ac42756f83273',
    pd: '0x54b41d3dbbae365c8bea4b4ddcf8efd279e68625',
  },
  {
    apiKey: 'eF3hNeRVXFwZ1YuhDfQHd8V2ngkK5pocrA3MJyBx8bX2EENRb9ZfRT9N63TNMQGv',
    user: '0x7b2f92579cd00657e929bee55822780d3e5fd39d',
    pd: '0x84bb88215f71587435cc4c0cd4f29e4c1ae2af5b',
  },
];

app.post('/register', async (req, res)=> {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
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
    // create jwt token
    defaultConfig.walletAddress.user = dynamicConfig[user.id  % 3].user;
    defaultConfig.walletAddress.pd = dynamicConfig[user.id  % 3].pd;
    defaultConfig.dapp.apiKey = dynamicConfig[user.id  % 3].apiKey;
    defaultConfig.userName = user.name;
    const token = jwt.sign({
      email: user.email,
      name: user.name,
      config: defaultConfig,
    }, process.env.ENCRYPT_KEY);
    res.send({
      res: true,
      data: {
        jwtToken: token,
      },
    })
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