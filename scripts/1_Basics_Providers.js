// Script 1/N
// Bx: 2021/11/27
// The following script pulls data from the ethereum blockchain, and introduces critical functions/concepts
// Ethers.js has three main elements: providers, signers, and contracts. This Script focuses on providers.
// All of this code can be used with a test network like Rinkeby by changing "MAINNET_RPC_URL" to its Rinkeby version.

// Importing required libraries.
const { ethers } = require("ethers");   // Importing the ethers library
require('dotenv').config()              // dotenv library allows useage of system variables defined in .env

// Setting up an asynchronous function.
async function mainProviders() {
    const mainnetURL = process.env.MAINNET_RPC_URL;                     // Pulling the environment variable set in .env
    const provider = new ethers.providers.JsonRpcProvider(mainnetURL);  // Provider instance. Connecting with infura.


    // -------------- Network Info ------------- // 
    let myNetwork = await provider.getNetwork();                          // Promise: Returns => Object
    let networkName = myNetwork.name;
    let networkChainId = myNetwork.chainId;
    let networkEnsAddress = myNetwork.ensAddress;
    //console.log('Network Object: ', network);                           // Logging the object
    console.log(`Network Chain ID: ${networkChainId}`);


    // -------------- Block Info --------------- //
    let block = await provider.getBlock();                              // Promise: Returns => Object
    let blockHash = block.hash;
    let baseFeePerGas = ethers.BigNumber.from(block.baseFeePerGas);     // Use BigNumber utility for large numbers.
    let blockDifficulty = ethers.BigNumber.from(block._difficulty);     // Manipulating big numbers using ethers methods is critical to prevent errors.
    let blockMiner = block.miner;
    let blockNumber = block.number;
    //console.log('Block Object: ', block);                             // Logging the entire object
    console.log(`Block Miner: ${blockMiner}`)
    console.log(`Base Fee Per Gas (Max Fee) in gwei: ${ethers.utils.formatUnits(baseFeePerGas, 'gwei')}`);
    console.log(`Block Difficulty: ${blockDifficulty}`)


    // -------------- Address Info --------------- //
    // Note, reverese lookup of ens name from address requires additional setup from ens owner name.
    let ensName = "guy.eth";
    let addressFromEns = await provider.resolveName(ensName)
    let address = "0x4f0fa30d9a0a7bdd053210e6f220255fd64a3a22";         // The Address that is already known. 
    if (addressFromEns.toUpperCase() === address.toUpperCase()) {
        console.log(`ENS name lookup address matches known address :)`)
    }

    // The Account balance and transaction count.
    let balanceWei = await provider.getBalance(address);
    let transactionCount = await provider.getTransactionCount(addressFromEns)
    console.log('guy.eth balance: ', ethers.utils.formatUnits(balanceWei, "ether")); // formatUnits() convert Wei to Ether.
    console.log(`guy.eth transaction count: ${transactionCount}`);


    // ------------- Transaction Info ------------ //  
    // To calculate the cost of a transaction: 
    // cost (ETH) = gasLimit × MaxPriorityFee(tip) x MaxFee × 1e-9.   i.e. 0.00315 Eth = 21000gwei x 1.5 x 100gwei x 1e-9
    txObject = {
        to: address,
        data: "0xd0e30db0",
        value: ethers.utils.parseUnits("1.0", "ether")                  // parseUnits() converts ether to Wei, 
    }
    //let gasLimit = await provider.estimateGas(txObject);                // Denominated in Gwei
    let gasLimit = await provider.estimateGas(txObject);
    console.log(`Gas Limit (gwei) for transaction: ${gasLimit}`)

    let gasMaxFee = await provider.getGasPrice();                       // Max Fee query
    console.log(`Max Gas Fee (gwei) to send a transaction to guy.eth: ${ethers.utils.formatUnits(gasMaxFee, "gwei")}`)

};
mainProviders();


