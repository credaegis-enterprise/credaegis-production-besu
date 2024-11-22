const { ethers } = require('ethers');

// Define the provider (point to your QBFT network)
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8001");  // Use your actual QBFT node URL

// Define the contract address (hardcoded)
const contractAddress = '0xE28158eCFde143e2536761c3254C7C31efd97271';  // Replace with your actual deployed contract address

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
        "indexed": false,
        "internalType": "string",
        "name": "hash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "rev",
        "type": "bool"
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
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "hash",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "stat",
            "type": "bool"
          }
        ],
        "internalType": "struct HashStore.RevokeResult[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
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
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "Hash",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "stored",
            "type": "bool"
          }
        ],
        "internalType": "struct HashStore.StoreResult[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
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
        "components": [
          {
            "internalType": "string",
            "name": "verifiedHashes",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "verificationResults",
            "type": "bool"
          }
        ],
        "internalType": "struct HashStore.VerificationResult[]",
        "name": "",
        "type": "tuple[]"
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


//Function to store array of hashes and display array of objects
async function storeHashes(hashes) {
  try {
    // Fetch the results using `callStatic` to simulate the execution
    const results = await contract.callStatic.storeHash(hashes);

    // Call the `storeHash` function to actually execute the transaction
    const tx = await contract.storeHash(hashes);
    await tx.wait(); // Wait for the transaction to be mined

    // Format the results from `callStatic`
    const formattedResults = results.map(result => ({
      Hash: result.Hash,
      Stored: result.stored
    }));

    console.log("Hashes stored successfully:", formattedResults);
    return formattedResults;
  } catch (error) {
    console.error("Error storing hashes:", error);
    throw error;
  }
}


// Function to revoke an array of hashes and display results as an array of objects
async function revokeHashes(hashesToRevoke) {
  try {
    // Send the transaction and wait for it to be mined
    const tx = await contract.revokeHashes(hashesToRevoke);
    const receipt = await tx.wait(); // Wait for transaction confirmation

    // Parse the logs to extract relevant details
    const eventInterface = new ethers.utils.Interface(contractABI);
    const events = receipt.logs.map(log => {
      try {
        return eventInterface.parseLog(log);
      } catch (err) {
        // Ignore logs that don't match the ABI
        return null;
      }
    }).filter(log => log && log.name === "HashRevoked"); // Adjust to your event name

    // Format the results
    const formattedResults = events.map(event => ({
      hash: event.args.hash, // Ensure `hash` is correctly extracted from the event
      revoked: event.args.rev, // Adjust based on event argument structure
    }));

    // Display the formatted results
    console.log("Hashes revoked:", formattedResults); //remove "Hashes revoked" to view only array of objects 
    return formattedResults;
  } catch (error) {
    console.error("Error revoking hashes:", error);
    throw error;
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



//Function to verify array of hashes and display array of objects
async function verifyHashes(hashesToVerify) {
    const results = await contract.verifyHashesByValue(hashesToVerify);

    // Transform results into desired format
    const formattedResults = results.map(result => ({
        verifiedHashes: result.verifiedHashes,
        verificationResults: result.verificationResults,
    }));

    console.log("Verified hashes and results:", formattedResults);
}



// Example usage
const hashes = [
  '0x4c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c114',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c777',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c771',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c772',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c773',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c774',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c775',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c776',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c778'
];
const hashesToRevoke = ['0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c774',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c775',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c776',
  '0x5c6ee2f9e5d536b563fcfdb00fb218eec33a9f58f91c9f66f1f19cfa0a51c778'
];

// Uncomment to store hashes
//storeHashes(hashes);


// Revoke a batch of hashes
//final runnning
revokeHashes(hashesToRevoke);
  
  
// Retrieve a hash and Merkle root by value
//getHashByValue(hashes[0]);

// Verify multiple hashes
//verifyHashes(hashes);