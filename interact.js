const { ethers } = require('ethers');

// Define the provider (point to your QBFT network)
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8001");  // Use your actual QBFT node URL

// Define the contract address (hardcoded)
const contractAddress = '0xf204a4Ef082f5c04bB89F7D5E6568B796096735a';  // Replace with your actual deployed contract address

// Define the ABI of the contract with updated functions and events
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "HashRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
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
    "name": "HashStored",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "hash",
        "type": "string"
      }
    ],
    "name": "getHashByValue",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "hashesToRevoke",
        "type": "string[]"
      }
    ],
    "name": "revokeHashes",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "hashes",
        "type": "string[]"
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
        "internalType": "string[]",
        "name": "hashesToVerify",
        "type": "string[]"
      }
    ],
    "name": "verifyHashesByValue",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "bool[]",
        "name": "",
        "type": "bool[]"
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

// Function to store an array of hash values
async function storeHashValues(hashes) {
  try {
    const tx = await contract.storeHash(hashes);
    await tx.wait();  // Wait for the transaction to be mined
    console.log('Hashes stored successfully:', hashes);
  } catch (error) {
    console.error('Error storing hashes:', error);
  }
}

// Function to revoke an array of hashes
async function revokeHashes(hashesToRevoke) {
  try {
    const tx = await contract.revokeHashes(hashesToRevoke);
    await tx.wait();  // Wait for the transaction to be mined
    console.log('Hashes revoked successfully:', hashesToRevoke);
  } catch (error) {
    console.error('Error revoking hashes:', error);
  }
}

// Function to retrieve a hash and Merkle root by hash value
async function getHashByValue(hash) {
  try {
    const [retrievedHash, merkleRoot] = await contract.getHashByValue(hash);
    console.log('Retrieved hash:', retrievedHash);
    console.log('Merkle root:', merkleRoot);
    return { retrievedHash, merkleRoot };
  } catch (error) {
    console.error('Error retrieving hash:', error);
  }
}

// Function to verify multiple hashes
async function verifyHashesByValue(hashesToVerify) {
  try {
    const [verifiedHashes, verificationResults] = await contract.verifyHashesByValue(hashesToVerify);
    console.log('Verified hashes:', verifiedHashes);
    console.log('Verification results:', verificationResults);
    return { verifiedHashes, verificationResults };
  } catch (error) {
    console.error('Error verifying hashes:', error);
  }
}

// Example usage
const hashes = [
  '0x4c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c111',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c777',
];
const hashesToRevoke = ['0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c777'];

// Uncomment to store hashes
storeHashValues(hashes);

// Revoke a batch of hashes
revokeHashes(hashesToRevoke);

// Retrieve a hash and Merkle root by value
getHashByValue(hashes[0]);

// Verify multiple hashes
verifyHashesByValue(hashes);