const { ethers } = require('ethers');

// Define the provider (point to your QBFT network)
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8001");  // Use your actual QBFT node URL

// Define the contract address (hardcoded)
const contractAddress = '0xE470B4AF2C0dbFa6E834586B364a91e79ad6BcBf';  // Replace with your actual deployed contract address

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
        "name": "merkleroot",
        "type": "string"
      }
    ],
    "name": "finaliseBatch",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllMerkleRoot",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "roots",
            "type": "string"
          }
        ],
        "internalType": "struct HashStore.allMerkleRoot[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      }
    ],
    "name": "getBatchById",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractDetails",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHashesForNextBatch",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
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
    "name": "getMerkleByHash",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "hash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "merkleRoot",
            "type": "string"
          }
        ],
        "internalType": "struct HashStore.HashMerklePair[]",
        "name": "",
        "type": "tuple[]"
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
          },
          {
            "internalType": "bool",
            "name": "revoked",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "merkleRoot",
            "type": "string"
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



//Function to verify array of hashes and display array of objects
async function verifyHashes(hashesToVerify) {
    const results = await contract.verifyHashesByValue(hashesToVerify);

    // Transform results into desired format
    const formattedResults = results.map(result => ({
        verifiedHashes: result.verifiedHashes,
        verificationResults: result.verificationResults,
        revokedStatus: result.revoked,
        merkleRoot: result.merkleRoot

    }));

    console.log("Verified hashes and results:", formattedResults);
}


// Function to get the hashes for the next batch and display an array of results
async function getHashesForNextBatch() {
  // Call the contract method to get the hashes
  const hashes = await contract.getHashesForNextBatch();

  // Check if hashes are returned
  if (hashes && hashes.length > 0) {
      // Transform the results into the desired format (if needed, you can customize this)
      const formattedResults = hashes.map(hash => ({
          hash: hash,
          //status: "Hash retrieved successfully"  // Or any status or additional information you need
      }));

      console.log("Fetched hashes for next batch:", formattedResults);
  } else {
      console.log("No new hashes found for the next batch.");
  }
}





// Function to finalise the batch and display the batch number and status
async function finaliseBatch(merkleroot) {
  try {
    // Call the finaliseBatch function to change the state
    const tx = await contract.finaliseBatch(merkleroot);
    
    // Wait for the transaction to be mined
    await tx.wait();

    // Now use callStatic to retrieve the return values without changing the state
    const result = await contract.callStatic.finaliseBatch(merkleroot);

    // Destructure the returned values
    const [batchNumber, status] = result;

    // Check if values are defined
    if (batchNumber === undefined || status === undefined) {
        throw new Error("Received undefined values from the contract.");
    }


    // Display the results
    console.log(`Batch Number: ${batchNumber.toString()}`);
    console.log(`Status: ${status}`);
} catch (error) {
    console.error("Error executing function:", error);
}
}


// Function to fetch all Merkle roots
async function fetchMerkleRoots() {
  try {
    const merkleRoots = await contract.getAllMerkleRoot();

    // Format the results as an array of objects with "Batch N" keys
    const formattedResult = merkleRoots.map((result, index) => ({
      [`Batch ${index + 1}`]: result.roots,
    }));

    console.log("Hashes stored successfully:");
    console.log(formattedResult);
  } catch (error) {
    console.error("Error in fetching Merkle roots:", error);
  }
}

//Function to get merkle root by giving hashes
async function getMerkleByHash(hashes) {
  try {
      // Call the smart contract function
      const results = await contract.getMerkleByHash(hashes);

      // Convert the result into a readable array of objects
      const formattedResult =  results.map(result => ({
          hash: result.hash,
          merkleRoot: result.merkleRoot
      }));
      
      console.log(formattedResult);
  } catch (error) {
      console.error("Error fetching Merkle roots:", error);
      
  }
}








//debugging--------------------------------------------------------------------


async function fetchContractDetails() {
  try {

      // Call the Solidity function
      const [batchHashCount, currentBatch, lastHashIndex] = await contract.getContractDetails();

      console.log("Batch Hash Count:", batchHashCount.toString());
      console.log("Current Batch:", currentBatch.toString());
      console.log("Last Hash Index:", lastHashIndex.toString());
  } catch (error) {
      console.error("Error fetching contract details:", error);
  }
}


async function fetchBatchDetails(batchId) {
  try {

      // Call the Solidity function with the batch ID
      const [hashes, merkleRoot, lastHashIndex] = await contract.getBatchById(batchId);

      // Display batch details
      console.log(`Batch ID: ${batchId}`);
      console.log("Hashes:", hashes);
      console.log("Merkle Root:", merkleRoot);
      console.log("Last Hash Index:", lastHashIndex.toString());
  } catch (error) {
      console.error("Error fetching batch details:", error);
  }
}



// Example usage
const hashes = [
  '0x4c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c114',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c777',
  '0x5c6ee2f9e5d536b5633a9f58f91c9f66f1f19cfa0a51c771',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c772',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c773',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c774',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c775',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c776',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c778',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c811',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c812',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c813',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c814',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c815',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c816',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c817',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c818',
  '0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c819'

];
const hashesToRevoke = ['0x5c6ee2f9e5d536b56333a9f58f91c9f66f1f19cfa0a51c811'];

const merkleroot = "0x15451";

const batchId = 1; // Replace with desired batch ID




// Uncomment to store hashes
//storeHashes(hashes);


// Revoke a batch of hashes
//revokeHashes(hashesToRevoke);

// Verify multiple hashes
//verifyHashes(hashes);

// To calculate merkle root for the batch 
//getHashesForNextBatch();

// To finalise the batch with sending merkle root in order to push merkle root to AVALANCHE
//finaliseBatch(merkleroot);

// To fetch all merkle roots
//fetchMerkleRoots();

// Fetch global variables
//fetchContractDetails();

// Get structure data 
//fetchBatchDetails(batchId);

// To fetch merkle root by giving hash
//getMerkleByHash(hashes);



























/*
//sample for present merkle root logic

unction calculateMerkleRoot(hashes) {
  // If the array has an odd length, add "test" as the last leaf
  if (hashes.length % 2 !== 0) {
    hashes.push(sha256("test"));
  }

  // Recursive helper function to compute Merkle root
  function computeMerkleRoot(layer) {
    if (layer.length === 1) {
      return layer[0]; // Root found
    }

    const nextLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
      // Combine pairs of hashes, left and right
      const left = layer[i];
      const right = layer[i + 1];
      nextLayer.push(sha256(left + right));
    }

    // Recursive call with the next layer
    return computeMerkleRoot(nextLayer);
  }

  return computeMerkleRoot(hashes);
}

// Example usage:
const leafHashes = ["a", "b", "c", "d"].map(sha256); // Example hashes
const merkleRoot = calculateMerkleRoot(leafHashes);
console.log("Merkle Root:", merkleRoot);

*/
