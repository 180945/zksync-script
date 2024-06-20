import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import SafeJson from "../artifacts-zk/contracts/bridge/Safe.sol/Safe.json";
import BridgeJson from "../artifacts-zk/contracts/bridge/bridgeTwoWays/Bridge.sol/Bridge.json";
import WTokenJson from "../artifacts-zk/contracts/bridge/WToken.sol/WrappedToken.json";
// import type BrigeType from "../Bridge";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

if (!PRIVATE_KEY)
    throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script for the Bridge contract`);

    // Initialize the wallet.
    const wallet = new Wallet(PRIVATE_KEY);

    // Create deployer object and load the artifact of the contract you want to deploy.
    const deployer = new Deployer(hre, wallet);
    const upgradeWallet = "0xe7143319283d0b5b234aea046769d40bee5c6d43";
    const operator = "0x00ac68bF447A04e2e6ac78d25c8CBeF9EA397b12";

    // deploy safe contract
    // const safeImp = await DeployContract(deployer, "Safe", []);

    // Initialize the contract interface
    const safeABI = new ethers.utils.Interface(SafeJson.abi);
    const owners = ["0x4A0575ea18743A9e07c7D6DB45C0e6bE306605da","0xc1bd11B445731849340539C196241a661affE004","0x0527FcC3e0be62b84707a430B1Aa46b775fe015B","0x9Be2b21B7f78529433021090Cb5941a89E7e0649","0x7FD3B0a8F0441e1a27A4F65FCE9869DEC1D83102","0x4008cE88De080B7B4D99ABA0284FDfbCAC3d1f99","0xbe4C3c99E86ACc9a0831Bf49CE45Ab6F229E111A"];
    const calldata = safeABI.encodeFunctionData("setup", [owners, 1, "0x0000000000000000000000000000000000000000", "0x", "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", 0, "0x0000000000000000000000000000000000000000"]);
    // deploy safe proxy
    // const safeContract = await DeployContract(deployer, "TransparentUpgradeableProxy", [
    //     safeImp.address,
    //     upgradeWallet,
    //     calldata
    // ]);
    //
    // console.log("======================");
    // console.log("Safe contract addr: " + safeContract.address);
    // console.log("======================");
    //
    // // deploy bridge contract
    // const bridgeImp = await DeployContract(deployer, "Bridge", []);
    // const bridgeABI = new ethers.utils.Interface(BridgeJson.abi);
    // const calldata2 = bridgeABI.encodeFunctionData("initialize", [safeContract.address, operator, []]);
    // // delopy bridge proxy
    // const bridge = await DeployContract(deployer, "TransparentUpgradeableProxy", [
    //     bridgeImp.address,
    //     upgradeWallet,
    //     calldata2
    // ]);
    // console.log("======================");
    // console.log("bridge contract addr: " + bridge.address);
    // console.log("======================");

    // deploy wtoken contract
    const wTokenImp = await DeployContract(deployer, "contracts/bridge/WToken.sol:WrappedToken", []);

    // deploy wtoken proxy
    const wtokenABI = new ethers.utils.Interface(WTokenJson.abi);
    const calldata3 = wtokenABI.encodeFunctionData("initialize", ["0x3e3Cc9BC371bB7F17661E7370d19dF137e7DFD83", "Ethereum", "ETH"]);

    const eth = await DeployContract(deployer, "TransparentUpgradeableProxy", [
        wTokenImp.address,
        upgradeWallet,
        calldata3
    ]);
    console.log("======================");
    console.log("eth contract addr: " + eth.address);
    console.log("======================");

    const calldata4 = wtokenABI.encodeFunctionData("initialize", ["0x3e3Cc9BC371bB7F17661E7370d19dF137e7DFD83", "Bitcoin", "BTC"]);

    const bitcoin = await DeployContract(deployer, "TransparentUpgradeableProxy", [
        wTokenImp.address,
        upgradeWallet,
        calldata4
    ]);
    console.log("======================");
    console.log("bitcoin contract addr: " + bitcoin.address);
    console.log("======================");

}


async function  DeployContract(
    deployerInput: Deployer,
    contractName: string,
    constructorArguments: any[],
) {
    console.log(`Running deploy script for the ${contractName} contract`);
    const contract = await deployerInput.loadArtifact(contractName);

    // console.log(artifact)

    // Estimate contract deployment fee
    const deploymentFee = await deployerInput.estimateDeployFee(contract, constructorArguments);

    // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
    // `greeting` is an argument for contract constructor.
    const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

    const deployedContract = await deployerInput.deploy(contract, constructorArguments);

    // Show the contract info.
    const contractAddress = deployedContract.address;
    console.log(`${contractName} was deployed to ${contractAddress}`);

    return deployedContract;
}