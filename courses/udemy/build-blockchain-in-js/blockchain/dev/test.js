const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

/*bitcoin.createNewBlock(1234, 'KKMNVMZXNVM87ONMN','QREPOINCVXB934JDKD');

bitcoin.createNewTransaction(200, 'ALEXIDSFNKMDS', 'SMITHIEWSNSDFKJ');

bitcoin.createNewBlock(3781, 'UIWFDJHBZXCDSFJKL','QUIONZXHSDNN89YSDAK');

bitcoin.createNewTransaction(100, 'ALEXIDSFNKMDS', 'SMITHIEWSNSDFKJ');
bitcoin.createNewTransaction(300, 'ALEXIDSFNKMDS', 'SMITHIEWSNSDFKJ');
bitcoin.createNewTransaction(100, 'ALEXIDSFNKMDS', 'SMITHIEWSNSDFKJ');

bitcoin.createNewBlock(7548, 'ZXCKHQEIU,LKJLKJM','ZCXHJKZXHDHFSKJGJHCXVH');*/

/*
const previousBlockHash = 'DFSUJKLJDSLJF809KJLKJJKJKSDRWZCVC';
const currentBlockData = [
  {
    amount:100,
    sender:'ALEXIDSFNKMDS',
    recipient:'SMITHIEWSNSDFKJ'
  },
  {
    amount:300,
    sender:'ALEXIDSFNKMDS',
    recipient:'SMITHIEWSNSDFKJ'
  },
  {
    amount:200,
    sender:'ALEXIDSFNKMDS',
    recipient:'SMITHIEWSNSDFKJ'
  }
];


const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
console.log(nonce);
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
*/

/*
const blockchain1 = {"chain":[{"index":1,"timestamp":1533048440931,"transactions":[],"nonce":100,"hash":"0","previousBlockHash":"0"},{"index":2,"timestamp":1533048660714,"transactions":[],"nonce":18140,"hash":"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100","previousBlockHash":"0"},{"index":3,"timestamp":1533048673566,"transactions":[{"amount":12.5,"sender":"00","recipient":"a0f4b42094d011e8a22bc91e7638c177","transactionId":"2400112094d111e8a22bc91e7638c177"}],"nonce":122524,"hash":"0000b1ab6d1a288249762094c2727e8b348e1a23aebd8d19698dd0d523dd6e03","previousBlockHash":"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"},{"index":4,"timestamp":1533048818183,"transactions":[{"amount":12.5,"sender":"00","recipient":"a0f4b42094d011e8a22bc91e7638c177","transactionId":"2b9ec02094d111e8a22bc91e7638c177"},{"amount":1200,"sender":"ALEXIDSFNKMDS","recipient":"SMITHIEWSNSDFKJ","transactionId":"6150a17094d111e8a22bc91e7638c177"}],"nonce":14358,"hash":"00000c03e46ad2311a81a8ae60c2f8d005a887889c8b94c173ca75b46d7a8411","previousBlockHash":"0000b1ab6d1a288249762094c2727e8b348e1a23aebd8d19698dd0d523dd6e03"}],"pendingTransactions":[{"amount":12.5,"sender":"00","recipient":"a0f4b42094d011e8a22bc91e7638c177","transactionId":"81d13f9094d111e8a22bc91e7638c177"}],"currentNodeUrl":"http://localhost:3001","networkNodes":[]};
console.log("Chain is valid " + bitcoin.chainIsValid(blockchain1.chain));
*/

//console.log(bitcoin);

