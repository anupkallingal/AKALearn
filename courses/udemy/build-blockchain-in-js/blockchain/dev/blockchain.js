const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    
    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index : this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce : nonce,
        hash : hash,
        previousBlockHash : previousBlockHash
    };
    
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    
    return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipient : recipient,
        transactionId : uuid().split('-').join('')
    };

    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(newTransaction) {
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
}

Blockchain.prototype.chainIsValid = function(blockchain) {
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;
    if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
        return false;
    }

    for( var i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1];

        if(currentBlock['previousBlockHash'] !== prevBlock['hash']) {
            return false;
        }

        const currentBlockData = {
            transactions: currentBlock['transactions'],
            index: currentBlock['index']
        };
        const blockHash = this.hashBlock(prevBlock['hash'], currentBlockData, currentBlock['nonce']);
        if(blockHash.substring(0, 4) !== '0000') {
            return false;
        }
    }

    return true;
}

Blockchain.prototype.getBlock = function(blockHash) {
    for (var i = 0; i < this.chain.length; ++i) {
        var block = this.chain[i];
        if(block.hash === blockHash) {
            return block;
        }
    }
    return null;
}

Blockchain.prototype.getTransaction = function(transactionId) {
    for(var i = 0; i < this.chain.length; ++i) {
        var block = this.chain[i];
        for(var j = 0; j < block.transactions.length; ++j) {
            var transaction = block.transactions[j];
            if(transaction.transactionId === transactionId) {
                return {
                    transaction : transaction,
                    block : block
                }
            }
        }
    }

    return {
        transaction: null,
        block: null
    }
}

Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions = [];
    let addressBalance = 0;

    this.chain.forEach( block => {
        console.log(block.hash);
       block.transactions.forEach( transaction => {
          if(transaction.sender === address || transaction.recipient === address) {
              console.log("Found");
              addressTransactions.push(transaction);
              if(transaction.sender === address) {
                  addressBalance -= transaction.amount;
              }
              if(transaction.recipient === address) {
                  addressBalance += transaction.amount;
              }
          }
       });
    });

    console.log("addressBalance: "+addressBalance);
    return {
        addressTransactions : addressTransactions,
        addressBalance : addressBalance
    }
}

module.exports = Blockchain;