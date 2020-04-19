const request = require('async-request')

const getConfigByIdAndName = async (index, name) => {
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
    userName: name,
  }
  // 추가 유저가 필요한 경우 아래 리스트에 원소 추가
  const dynamicConfig = [
    '0x3e877a621a56d7785f3525f542f1adc5dcaeb3c2',
    '0x5c2b51025301da8893c3fbb0075ac42756f83273',
    '0x7b2f92579cd00657e929bee55822780d3e5fd39d',
  ];

  let configIndex = index;

   if (index >= dynamicConfig.length) {
    // API Call and push dynamicConfig
    try {
      const response = await request('https://api.luniverse.io/tx/v1.1/wallets', {
        method: 'POST',
        data: {
          walletType: 'LUNIVERSE',
          userKey: index,
        },
        headers: {
          Authorization: `Bearer ${defaultConfig.dapp.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const body = JSON.parse(response.body);
      const userWallet = body.data.address;

      dynamicConfig.push(userWallet);
      configIndex = dynamicConfig.length - 1;
    } catch (e) {
      throw e;
    }
  }
  defaultConfig.walletAddress.user = dynamicConfig[configIndex];

  return defaultConfig;
};

module.exports = {
  getConfigByIdAndName,
}