const HDWalletProvider = require('@truffle/hdwallet-provider');

// Replace with your actual private key
const PRIVATE_KEY = '7a1bfdc5e0389137aa3cf3c7ddbad9d6cb83abd2939e811ccf1e020ea8b8ca24';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Default Ganache CLI port
      network_id: "*"
    },
    moonbase: {
      provider: () => new HDWalletProvider(
        PRIVATE_KEY,
        'https://rpc.testnet.moonbeam.network'
      ),
      network_id: 1287,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
};
