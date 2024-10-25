const { ethers } = require('ethers');

// Define the provider (point to your QBFT network)
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8001");  // Use your actual QBFT node URL

// Define the contract address (hardcoded)
const contractAddress = '0xAa588d3737B611baFD7bD713445b314BD453a5C8';  // Replace with your actual deployed contract address

// Define the ABI of the contract
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "hash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "HashRetrieved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "HashVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getHash",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "hash",
        "type": "string"
      }
    ],
    "name": "storeHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
  "inputs": [
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "hashToVerify",
      "type": "string"
    }
  ],
  "name": "verifyHash",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}

  


];

// Define your private key (hardcoded)
const privateKey = 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';  // Replace with the private key of the account you want to use

// Create a signer using the private key
const signer = new ethers.Wallet(privateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Function to store the hash value
async function storeHashValue(id,hashValue) {
    try {
        // Call the contract's function to store the hash
        const tx = await contract.storeHash(id,hashValue);  // Replace `storeHash` with your actual function name
        await tx.wait();  // Wait for the transaction to be mined
        console.log('Hash stored successfully:', hashValue);
    } catch (error) {
        console.error('Error storing hash:', error);
    }
}

async function verifyHash(id, hashToVerify) {
    try {
        const isVerified = await contract.verifyHash(id, hashToVerify);
        console.log('Is hash verified?', isVerified);
    } catch (error) {
        console.error('Error verifying hash:', error);
    }
}
async function retrieveHash(id) {
    try {
        const storedHash = await contract.getHash(id);
        console.log('Retrieved hash:', storedHash);
        return storedHash;
    } catch (error) {
        console.error('Error retrieving hash:', error);
    }
}

// Example usage: Replace with the actual hash value you want to store
const hashToStore = '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c8b1';  // Replace with your actual hash value
idTostore=1;
retrieveHash(idTostore);
verifyHash(idTostore,hashToStore);
