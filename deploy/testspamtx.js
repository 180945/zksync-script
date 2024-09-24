require("dotenv").config();
const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider("https://rpc.iron-chain-bank.l2aas.com/");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

async function sendTx (nonce) {
    try {
        const tx = await signer.sendTransaction({
            to: '0x9699b31b25D71BDA4819bBe66244E9130cEE62b7',
            value: ethers.utils.parseUnits('0.000000001', 'ether'),
            nonce
        });
        console.log(tx);
    } catch (err) {
        console.log(err);
    }
}

(async function main() {
    // let nonce = 1618;
    while (true) {
        console.log("fuck u leon");
        sendTx(1034);
        sendTx(1035);
        break;
    }

    // await sendTx();

    while (true) {}
})();
