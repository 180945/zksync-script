import { Provider, Wallet } from "zksync-ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";
import { ethers } from "ethers";

import "@matterlabs/hardhat-zksync-node/dist/type-extensions";
import "@matterlabs/hardhat-zksync-verify/dist/src/type-extensions";
import fs from 'fs';

// Load env file
dotenv.config();

export const getProvider = () => {
  const rpcUrl = hre.network.config.url;
  if (!rpcUrl) throw `⛔️ RPC URL wasn't found in "${hre.network.name}"! Please add a "url" field to the network config in hardhat.config.ts`;

  // Initialize zkSync Provider
  return new Provider(rpcUrl);
}

export const getWallet = (privateKey?: string) => {
  if (!privateKey) {
    // Get wallet private key from .env file
    if (!process.env.WALLET_PRIVATE_KEY) throw "⛔️ Wallet private key wasn't found in .env file!";
  }

  const provider = getProvider();
  
  // Initialize zkSync Wallet
  return new Wallet(privateKey ?? process.env.WALLET_PRIVATE_KEY!, provider);
}

export const verifyEnoughBalance = async (wallet: Wallet, amount: bigint) => {
  // Check if the wallet has enough balance
  const balance = await wallet.getBalance();
  if (balance < amount) throw `⛔️ Wallet balance is too low! Required ${ethers.formatEther(amount)} ETH, but current ${wallet.address} balance is ${ethers.formatEther(balance)} ETH`;
}

/**
 * @param {string} data.contract The contract's path and name. E.g., "contracts/Greeter.sol:Greeter"
 */
export const verifyContract = async (data: {
  address: string,
  contract: string,
  constructorArguments: string,
  bytecode: string
}) => {
  const verificationRequestId: number = await hre.run("verify:verify", {
    ...data,
    noCompile: true,
  });
  return verificationRequestId;
}

type DeployContractOptions = {
  /**
   * If true, the deployment process will not print any logs
   */
  silent?: boolean
  /**
   * If true, the contract will not be verified on Block Explorer
   */
  noVerify?: boolean
  /**
   * If specified, the contract will be deployed using this wallet
   */ 
  wallet?: Wallet
}
export const deployContract = async (contractArtifactName: string, constructorArguments?: any[], options?: DeployContractOptions) => {
  const log = (message: string) => {
    if (!options?.silent) console.log(message);
  }

  log(`\nStarting deployment process of "${contractArtifactName}"...`);
  
  const wallet = options?.wallet ?? getWallet();
  console.log("wallet ",wallet.address);
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact(contractArtifactName).catch((error) => {
    if (error?.message?.includes(`Artifact for contract "${contractArtifactName}" not found.`)) {
      console.error(error.message);
      throw `⛔️ Please make sure you have compiled your contracts or specified the correct contract name!`;
    } else {
      throw error;
    }
  });

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, constructorArguments || []);

  // Check if the wallet has enough balance
  await verifyEnoughBalance(wallet, deploymentFee);

  // Deploy the contract to zkSync
  const contract = await deployer.deploy(artifact, constructorArguments);
  const address = await contract.getAddress();
  const constructorArgs = contract.interface.encodeDeploy(constructorArguments);
  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  // Display contract deployment info
  log(`\n"${artifact.contractName}" was successfully deployed:`);
  log(` - Contract address: ${address}`);
  log(` - Contract source: ${fullContractSource}`);
  log(` - Encoded constructor arguments: ${constructorArgs}\n`);

  if (!options?.noVerify && hre.network.config.url) {
    log(`Requesting contract verification...`);
    await verifyContract({
      address,
      contract: fullContractSource,
      constructorArguments: constructorArgs,
      bytecode: artifact.bytecode,
    });
  }

  return contract;
}

export const deployProxy = async(contractArtifactName: string, constructorArguments?: string) => {
  let proxyAdminAddr = "";
  try {
    const data = fs.readFileSync('proxyAdmin.text', 'utf8');
    console.log(data);
    proxyAdminAddr = data;
  } catch (err) {
    // deploy proxy admin
    const proxyAdmin = await deployContract(
        "ProxyAdmin",
        [],
        { noVerify: true }
    );
    proxyAdminAddr = await proxyAdmin.getAddress();
    fs.writeFileSync('proxyAdmin.text', proxyAdminAddr);
  }

  // deploy implementation
  const impl = await deployContract(
      contractArtifactName,
      [],
      { noVerify: true }
  );

  const proxyContract = await deployContract(
      "TransparentUpgradeableProxy",
      [await impl.getAddress(), proxyAdminAddr, constructorArguments],
      { noVerify: true }
  );

  return proxyContract;
}

