const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    // Função para calcular o hash do bloco
    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
            .digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    // Criando o bloco inicial (gênesis)
    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    // Obter o último bloco da cadeia
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Adicionar novo bloco à cadeia
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    // Verificar a integridade da cadeia de blocos
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Verifica se o hash atual está correto
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Verifica se o hash do bloco anterior está correto
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// Testando a implementação do blockchain
let myBlockchain = new Blockchain();
myBlockchain.addBlock(new Block(1, new Date().toISOString(), { amount: 4 }));
myBlockchain.addBlock(new Block(2, new Date().toISOString(), { amount: 10 }));

console.log('Blockchain válido? ' + myBlockchain.isChainValid());

// Exibindo os blocos na cadeia
console.log(JSON.stringify(myBlockchain, null, 4));
