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
    const upgradeWallet = "0x54b3DBA467C9Dbb916EF4D6AedaFa19C4Fef8258";
    const operator = "0x9699b31b25D71BDA4819bBe66244E9130cEE62b7";

    // // deploy safe contract
    // const safeImp = await DeployContract(deployer, "Safe", []);
    //
    // // Initialize the contract interface
    // const safeABI = new ethers.utils.Interface(SafeJson.abi);
    // const owners = ["0x54b23c919ac8C78EC8a8D8330BBd546c4E697793","0x8166e29b0b79F1b9056378611d2eC5744A92Ff29","0x1C7Cc916D4cDaF6A9c72741F26BD63e3Ab1bC752","0x2eaABBd0046907D53251498354Ac802D5fecc5C5","0x9BdBE90cFF247912a39da3F5dc847Babf3E5ab74","0x550347D3280b87936555fFA32A426B00Ea169F2f","0x8eD3db5CcD72d4766470a9E83B6dE93b4AbCA275"];
    // const calldata = safeABI.encodeFunctionData("setup", [owners, 1, "0x0000000000000000000000000000000000000000", "0x", "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", 0, "0x0000000000000000000000000000000000000000"]);
    // // deploy safe proxy
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
    // const wTokenImp = await DeployContract(deployer, "contracts/bridge/WToken.sol:WrappedToken", []);

    // deploy wtoken proxy
    const wtokenABI = new ethers.utils.Interface(WTokenJson.abi);
    // const calldata3 = wtokenABI.encodeFunctionData("initialize", [bridge.address, "Ethereum", "ETH"]);
    //
    // const eth = await DeployContract(deployer, "TransparentUpgradeableProxy", [
    //     wTokenImp.address,
    //     upgradeWallet,
    //     calldata3
    // ]);
    // console.log("======================");
    // console.log("eth contract addr: " + eth.address);
    // console.log("======================");

    const calldata4 = wtokenABI.encodeFunctionData("initialize", ["0x3e3Cc9BC371bB7F17661E7370d19dF137e7DFD83", "BSC-USDT", "BSC-USDT"]);

    const bitcoin = await DeployContract(deployer, "TransparentUpgradeableProxy", [
        "0xba71888b6d0185604d820e25e2500f1a0016aa15",
        upgradeWallet,
        calldata4
    ]);
    console.log("======================");
    console.log("BSC-USDT contract addr: " + bitcoin.address);
    console.log("======================");

    const calldata5 = wtokenABI.encodeFunctionData("initialize", ["0x3e3Cc9BC371bB7F17661E7370d19dF137e7DFD83", "BSC-BNB", "BSC-BNB"]);

    const bscbnb = await DeployContract(deployer, "TransparentUpgradeableProxy", [
        "0xba71888b6d0185604d820e25e2500f1a0016aa15",
        upgradeWallet,
        calldata5
    ]);
    console.log("======================");
    console.log("BSC-BNB contract addr: " + bscbnb.address);
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