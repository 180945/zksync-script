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
const N_O_TXS =  process.env.N_O_TXS || "10";
const ADDRESS =  process.env.ADDRESS || "10";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
    let n = 0;

    while(n++ < Number(N_O_TXS)) {
        const balance = await ethers.getDefaultProvider().getBalance(ADDRESS);
        console.log(balance);
    }
}
