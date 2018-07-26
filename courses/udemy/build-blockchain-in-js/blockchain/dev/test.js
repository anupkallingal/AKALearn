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

console.log(bitcoin);

