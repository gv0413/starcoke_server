require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { getConfigByIdAndName, getDefaultConfig } = require('./config')
const { checkUserExistByEmail, users } = require('./user')
const { execTx, getBalance } = require('./transaction')

app.use(express.json())

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

app.post('/txAction/:txActionName', async (req, res) => {
  const txActionName = req.params.txActionName;
  const defaultConfig = getDefaultConfig();

  try {
    const response = await execTx({
      body: req.body,
      txActionName,
      apiKey: defaultConfig.dapp.apiKey,
    });

    res.send(response);
  } catch(e) {
    res.status(400).send(`${txActionName} failed`);
  }
});

app.get('/getBalance/:userAddress', async (req, res) => {
  const userAddress = req.params.userAddress;
  const defaultConfig = getDefaultConfig();

  try {
    const response = await getBalance({
      mtSymbol: defaultConfig.mt.symbol,
      stSymbol: defaultConfig.st.symbol,
      apiKey: defaultConfig.dapp.apiKey,
      userAddress,
    });

    res.send(response);
  } catch(e) {
    res.status(400).send(`getBalanceOf ${userAddress} failed`);
  }
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
})