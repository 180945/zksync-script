import { getWallet, deployContract } from "../utils";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Running force burn script`);

    // Initialize the wallet.
    const wallet = getWallet();
    // upgrade proxy to new burnable contract
    const burntokenArtifact = await hre.artifacts.readArtifact(
        "WTokenBurnable"
    );
    const wToken = new ethers.Contract(
        "0x126cF354DE1677EccB99317A61716Cd7b9Ed3440",
        burntokenArtifact.abi,
        wallet,
    );

    if (!process.env.ACCOUNT_ADDRESS || !process.env.AMOUNT) {
        throw "⛔️ ACCOUNT_ADDRESS or AMOUNT not detected! Add it to the .env file!";
    }

    const upgradeTx = await wToken.forceBurn(process.env.ACCOUNT_ADDRESS, process.env.AMOUNT);
    console.log("burnTx: ", upgradeTx.hash);
}
