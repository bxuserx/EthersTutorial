// Script 3/N
// Bx: 2021/11/27
// The following script instantiates a ChainLink contract and interacts with it.
// Here we use the Kovan test network instead of rinkeby because of kovan's support for chainlink.

// Importing required libraries.
const { ethers } = require("ethers");   // Importing the ethers library
require('dotenv').config()              // dotenv library allows useage of system variables defined in .profile / .env


async function mainContract() {

    const kovanURL = process.env.KOVAN_RPC_URL;
    const provider = new ethers.providers.JsonRpcProvider(kovanURL);               // Provider instance. Connecting with infura.
    const privateKey = process.env.KOVAN_PRIVATE_KEY;
    let wallet = new ethers.Wallet(privateKey, provider);

    // LINK contract information
    const linkContractAddr = "0x5369AcC445C81b440E09905a1467BC425e3af705";
    const linkABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "getRandomNumber", "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "randomResult", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, { "internalType": "uint256", "name": "randomness", "type": "uint256" }], "name": "rawFulfillRandomness", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];


    // Contract instance. 
    let factoryContract = new ethers.Contract(linkContractAddr, linkABI, wallet);
    console.log(factoryContract.interface)
    let randomNum = await factoryContract.getRandomNumber();
    console.log(`Chainlink Random number object: ${JSON.stringify(randomNum)}`)
    console.log(parseInt(randomNum.data, 16))

};
mainContract();