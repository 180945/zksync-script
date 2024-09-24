import { getWallet, deployContract } from "../utils";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running deploy script for the Burn Token contract`);

    // Initialize the wallet.
    const wallet = getWallet();
    // deploy new burnable contract
    const newBurnableContract = await deployContract("WTokenBurnable", [], {noVerify: true});
    // upgrade proxy to new burnable contract
    const transparentUpgradeableProxy = await hre.artifacts.readArtifact(
        "ITransparentUpgradeableProxy"
    );
    const wTokenProxy = new ethers.Contract(
        "0x126cF354DE1677EccB99317A61716Cd7b9Ed3440",
        transparentUpgradeableProxy.abi,
        wallet,
    );

    const upgradeTx = await wTokenProxy.upgradeTo(await newBurnableContract.getAddress());
    console.log("upgradeTx: ", upgradeTx.hash);
}
