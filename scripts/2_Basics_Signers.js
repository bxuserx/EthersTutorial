// Script 2/N
// Bx: 2021/11/27
// The following script instantiates signers in multiple ways.
// It uses the Ropsten test network, but this can be applied to mainnet by simply changing RINKEBY_RPC_URL variable.

// Importing required libraries.
const { ethers } = require("ethers");   // Importing the ethers library
require('dotenv').config()              // dotenv library allows useage of system variables defined in .profile / .env

// Setting up an asynchronous function.
async function signersContract() {

    // --------------- Instantiate a Provider ---------------- //
    const rinkebyURL = process.env.RINKEBY_RPC_URL;                     // Pulling the environment variable set in .profile
    const rinkebyPrivateKey1 = process.env.RINKEBY_PRIVATE_KEY1;
    const provider = new ethers.providers.JsonRpcProvider(rinkebyURL);  // Provider instance. Connecting with infura.
    const wallet = new ethers.Wallet(rinkebyPrivateKey1, provider)


    // ---------------- Signing a message -------------------- //
    let myMessage = "Hello World!"
    let signatureHelloWorld = await wallet.signMessage(myMessage);   // Returns -> a Raw Signature
    console.log(`Hello world message signature: ${signatureHelloWorld}`);


    // ---------------- Send a Transaction ------------------- //
    const fromAddress = "0x00FCea4fd0e100B3669e73EDb041425c5792ae9d";
    const toAddress = "0xb37D740E23256aCb4DcCCe8077eec3BC20bF5488";
    let sendTokenAmount = "0.01";

    // Creating a sample transaction to test how much gas will cost.
    txEstimate = {
        to: toAddress,
        value: ethers.utils.parseUnits(sendTokenAmount, "ether")                  // parseUnits() converts ether to Wei, 
    }
    let gasLimit = await provider.estimateGas(txEstimate);
    let gasLimitHex = ethers.utils.hexlify(gasLimit)
    let gasMaxFee = await provider.getGasPrice();
    let sendValue = ethers.utils.parseUnits(sendTokenAmount, "ether")
    let nonceNum = await provider.getTransactionCount(fromAddress, "latest")
    console.log(`Gas Limit: ${gasLimit}, Gas Max Fee: ${ethers.utils.formatUnits(gasMaxFee, "gwei")}`);
    console.log(`Sending Value: ${sendValue}`)
    console.log(`Nonce Number: ${nonceNum}`)

    // Creating the real transaction object to send:
    const txObject = {
        from: fromAddress,
        to: toAddress,
        value: sendValue,
        nonce: nonceNum,
        gasLimit: gasLimitHex,
        gasPrice: gasMaxFee
    }

    let tx = await wallet.sendTransaction(txObject);
    let txOut = await provider.waitForTransaction(tx.hash);
    let txBlockNumber = tx.blockNumber;
    //console.log(`Raw Transaction Info: ${JSON.stringify(txOut)}`);
    console.log(`Transaction Block Number: ${txOut.blockNumber}`);
    console.log(`Transaction Block Hash: ${txOut.blockHash}`);




};
signersContract();


