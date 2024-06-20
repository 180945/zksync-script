import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { encodeFunctionData } from 'viem';

// load env file
import dotenv from "dotenv";
import {keccak256} from "ethers/lib/utils";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const N_O_TXS =  process.env.N_O_TXS || "10";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);

  // await DeployContract(deployer, "TransferHelper", []);
  // await DeployContract(deployer, "UniswapV2Library", []);
  //
  // const wbvm = await DeployContract(deployer, "WETH9", []);
  // const uniswapFactory = await DeployContract(deployer, "UniswapV2Factory", ["0x637249dBbAE73035C26F267572a5454d8E2a20B3"]);
  // await DeployContract(deployer, "UniswapV2Router02", [uniswapFactory.address, wbvm.address]);
  // await DeployContract(deployer, "BEP20Token", []);
  // await DeployContract(deployer, "ERC20", ["1000000000000000000000000000"]);
  // await DeployContract(deployer, "bulkSender", []);

  // add liquidity

  // approve uniswap router

  // swap token
  const contract = await deployer.loadArtifact("UniswapV2Router02");
  // contract
  const contractWithCorrectAddress = new ethers.Contract("0x08e2DA7685835FFD0CADa593Ee8C9517E98EDE4A", contract.abi, deployer.zkWallet);

  let path = ["0x7B0AF064Fe8aAd066A733cAEcF4be0b67Fa03B48", "0x93E83EAfc9A5742911369ADCa16ddEFCbBf020C1"];

  //     function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
  let n = 0;
  while(n++ < Number(N_O_TXS)) {
    console.log(await contractWithCorrectAddress.swapETHForExactTokens(1, path, "0x637249dBbAE73035C26F267572a5454d8E2a20B3", 1714856363, {value: "100000000000"}));
  }

  // deploy
  // var initializeData = nonfungibleTokenPositionDescriptor.interface.encodeFunctionData('initialize', [deployData.WTC.address, ethers.utils.formatBytes32String('TC')]);

  // const upgradeAddress = '0xD21968daE95717C723e5C129db9eaCC268e9ca44';
  // const operatorAddress = '0x57dAf89931e5fCc618429778E50052e9669Fd02f';
  // const owners = ["0x990F4bAb2EEE01E74A5D180120eFA5267D17FC67","0xCe91d43217b95cdB0974a40FAe776E80Db3A7cdd","0x66bfb1A5EAbf746f5faC5A24E35C5fAa28A881A7","0x11FF5A145EDAE91C9a6ea8E1E0740F1A71a8b72B","0x93Fc71ebb6ECFaB8681769b205202894935BB2be","0xBa8b1B1E0DB0A771C6A513662b2B3F75FBa39D47","0xA2FFf21B05827406010A49e621632e31Ff349009"];
  // // deploy safe contract
  // const safeImpl = await DeployContract(deployer, "Safe", []);
  // const safeArtifact = await deployer.loadArtifact("Safe");
  // const safeInitData = encodeFunctionData({
  //   abi: safeArtifact.abi,
  //   functionName: 'setup',
  //   args: [owners, Math.floor(2 * owners.length / 3) + 1, "0x0000000000000000000000000000000000000000", "", "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", 0, "0x0000000000000000000000000000000000000000"]
  // });
  // const safe = await DeployContract(deployer, "TransparentUpgradeableProxy", [safeImpl.address, upgradeAddress, safeInitData]);
  // console.log(`180945 deployed multisig contract ${safe.address}`);
  //
  // // bridge contract
  // const bridgeImpl = await DeployContract(deployer, "Bridge", []);
  // const bridgeArtifact = await deployer.loadArtifact("Bridge");
  // const bridgeInitData = encodeFunctionData({
  //   abi: bridgeArtifact.abi,
  //   functionName: 'initialize',
  //   args: [safe.address, operatorAddress, []]
  // });
  //
  // const bridge = await DeployContract(deployer, "TransparentUpgradeableProxy", [bridgeImpl.address, upgradeAddress, bridgeInitData]);
  // console.log(`180945 deployed bridge contract ${bridge.address}`);
  //
  // // wrapped token
  // const wrappedImp = await DeployContract(deployer, "WrappedTokenRune", []);
  // const wrappedArtifact = await deployer.loadArtifact("WrappedTokenRune");
  // const wrappedInitData = encodeFunctionData({
  //   abi: wrappedArtifact.abi,
  //   functionName: 'initialize',
  //   args: [ bridge.address, "ZERO•DIVISIBILITY•RUNE", "ZERO•DIVISIBILITY•RUNE"]
  // });
  // const warrpedToken = await DeployContract(deployer, "TransparentUpgradeableProxy", [wrappedImp.address, upgradeAddress, wrappedInitData]);
  // console.log(`180945 deployed ZERO•DIVISIBILITY•RUNE token contract ${warrpedToken.address}`);
  //
  // const wrappedInitData2 = encodeFunctionData({
  //   abi: wrappedArtifact.abi,
  //   functionName: 'initialize',
  //   args: [ bridge.address, "BVM•REGTEST•RUNE•ONE", "BVM•REGTEST•RUNE•ONE"]
  // });
  // const warrpedToken2 = await DeployContract(deployer, "TransparentUpgradeableProxy", [wrappedImp.address, upgradeAddress, wrappedInitData2]);
  // console.log(`180945 deployed BVM•REGTEST•RUNE•ONE token contract ${warrpedToken2.address}`);
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
  console.log("================================");

  return deployedContract;
}