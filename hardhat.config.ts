import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
// import "@matterlabs/hardhat-zksync-upgradable";

// dynamically changes endpoints for local tests
const zkSyncTestnet = {
    url: "https://rpc.supersonic.bvm.network",
    ethNetwork: "https://tc-node-auto.regtest.trustless.computer",
    zksync: true,
};

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.4.0",
    compilerSource: "binary",
    settings: {
        libraries: {
            "contracts/v2-periphery/UniswapRouterV2.sol": {
                "TransferHelper": "0x13706Afd344d905BB9Cb50752065a67Fa8d09c70",
                "UniswapV2Library": "0xb9FeC233026C2EE67BAA2BaB669B6daD20a2747D",
            }
        },
    },
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet,
  },
  solidity: {
      compilers: [
          {
              version: "0.8.17",
          },
          {
              version: "0.5.16",
              settings: {
                  optimizer: {
                      enabled: true,
                      runs: 999999,
                  },
              },
          },
          {
              version: "0.6.6",
              settings: {
                  optimizer: {
                      enabled: true,
                      runs: 999999,
                  },
              },
          },
          {
              version: "0.4.18",
          },
          {
              version: '0.8.19',
              settings: {
                  optimizer: {
                      enabled: true,
                      runs: 200,
                  },
                  viaIR: true,
                  outputSelection: {
                      '*': {
                          '*': ['storageLayout', 'evm.gasEstimates']
                      }
                  }
              },
          },
      ],
  },
};

export default config;
