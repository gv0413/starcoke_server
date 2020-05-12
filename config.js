const request = require('async-request')

const defaultConfig = {
  chainId: '5300575914426995782',
  mt: {
    symbol: 'FT9754',
  },
  st: {
    symbol: 'DST01',
  },
  walletAddress: {
    pd: '0x773f69537fd1a47fdd9adae3a1181daaa4d3b168',
    user: ''
  },
  dapp: {
    apiKey: 'G2auRtGRzre2GoXXGZLYzZqawfLfBi2Prn9miWW65iRQTyLe9ASeicUYwbKVD416'
  },
  txActionName: {
    like: 'like',
    funding: 'funding',
    purchase: 'purchase',
    getOwner: 'getOwner',
    setOwner: 'setOwner'
  },
  userName: '',
};

const getConfigByEmailAndName = async (email, name) => {
  const tmpConfig = defaultConfig;
  tmpConfig.userName = name;

  // API Call and push dynamicConfig
  try {
    const response = await request('https://api.luniverse.io/tx/v1.1/wallets', {
      method: 'POST',
      data: {
        walletType: 'LUNIVERSE',
        userKey: email,
      },
      headers: {
        Authorization: `Bearer ${tmpConfig.dapp.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const body = JSON.parse(response.body);
    const userWallet = body.data.address;

    tmpConfig.walletAddress.user = userWallet;
  } catch (e) {
    throw e;
  }

  return tmpConfig;
};

const getDefaultConfig = () => {
  return defaultConfig;
}

module.exports = {
  getConfigByEmailAndName,
  getDefaultConfig,
}