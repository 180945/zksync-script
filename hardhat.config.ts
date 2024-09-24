import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "@matterlabs/hardhat-zksync";

import 'dotenv/config'

// dynamically changes endpoints for local tests
const zkSyncTestnet = {
    url: "https://rpc.zkfractal.bvm.network",
    ethNetwork: "https://tc-node-auto.regtest.trustless.computer",
    zksync: true,
    verifyURL: 'https://contract-verification.supersonic.bvm.network/',
};

let localTestMnemonic = "test test test test test test test test test test test junk";


const config: HardhatUserConfig = {
    solidity: {
      compilers: [
        { version: "0.8.19", settings: { optimizer: { enabled: true, runs: 2000000, viaIR: true } } },
        { version: "0.8.20", settings: { optimizer: { enabled: true, runs: 2000000 }, evmVersion: 'paris', viaIR: true } },
        { version: "0.6.6", settings: { optimizer: { enabled: true, runs: 2000000, viaIR: true } } },
        { version: "0.8.17", settings: { optimizer: { enabled: true, runs: 2000000, viaIR: true } } },
      ]
    },
    defaultNetwork: "zkSyncTestnet",
    networks: {
      hardhat: {
        blockGasLimit: 20_500_000_000,
        accounts: {
          count: 20,
          accountsBalance: "20000000000000000000000000",
        },
        allowUnlimitedContractSize: true,
      },
      localhost: {
        url: "http://localhost:8545",
        accounts: {
          mnemonic: localTestMnemonic,
          count: 10,
        },
        timeout: 500_000_000,
        blockGasLimit: 2_500_000_000,
      },
      zkSyncTestnet,
    },
    paths: {
      sources: './contracts',
      tests: './tests',
      cache: './cache',
      artifacts: './artifacts',
    },
    zksolc: {
      settings: { 
      }
    }
  };

export default config;
