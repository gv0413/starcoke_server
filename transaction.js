const request = require('async-request')

const execTx = async (params) => {
  const {
    body,
    txActionName,
    apiKey,
  } = params;

  let res = false;
  try {
    res = await request(`https://api.luniverse.io/tx/v1.0/transactions/${txActionName}`, {
      method: 'POST',
      data: body,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    throw e;
  }

  return res.body;
};

const getBalance = async (params) => {
  const {
    mtSymbol,
    stSymbol,
    apiKey,
    userAddress,
  } = params;

  let res = false;
  try {
    res = await request(`https://api.luniverse.io/tx/v1.0/wallets/${userAddress}/${mtSymbol}/${stSymbol}/balance`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    throw e;
  }

  return res.body;
};

module.exports = {
  execTx,
  getBalance,
}