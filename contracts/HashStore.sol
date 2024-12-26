// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStore {
    struct Batch {
        string[] hashes;
        bytes32 merkleRoot;
        mapping(uint256 => bool) revoked; // Mapping to track revocation status for each hash
    }

    mapping(uint256 => Batch) private batches;
    mapping(string => uint256) private hashToBatchId;
    mapping(string => uint256) private hashToId;
    uint256 private currentBatch = 1; //batch id is numbered from 1 rather than starting from 0
    uint256 private currentHashCount;

    uint256 constant BATCH_SIZE = 5; //change this number to whatever you like to be the batch size

   

    event HashStored(uint256 indexed batchId, uint256 indexed id, string hash, string message);
    //event HashRevoked(uint256 indexed batchId, uint256 indexed id, string message, string rev);
    event HashRevoked(string hash, bool rev);


    address private owner;


    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Define a struct for the return type
struct StoreResult {
    string Hash;
    bool stored;
}

// Function to store hashes by taking input hashes as array and returns array of objects
function storeHash(string[] memory hashes) public returns (StoreResult[] memory) {
    uint256 length = hashes.length;
    StoreResult[] memory results = new StoreResult[](length);

    for (uint256 i = 0; i < length; i++) {
        bool alreadyStored = false;

        // Check if hash exists in any previous batch by looking at hashToBatchId
        uint256 batchId = hashToBatchId[hashes[i]];

        if (batchId != 0) {
            alreadyStored = true; // The hash already exists in a batch
        }

        if (alreadyStored) {
            results[i] = StoreResult({
                Hash: hashes[i],
                stored: false // Already stored, do not store it again
            });
            continue; // Skip storing this hash again
        }

        // Check if we need to move to a new batch when the current batch is full
        if (currentHashCount == BATCH_SIZE) {
            currentBatch++; // Increment to next batch
            currentHashCount = 0; // Reset count for the new batch
        }

        // Store the hash in the current batch
        batches[currentBatch].hashes.push(hashes[i]);
        emit HashStored(currentBatch, currentHashCount, hashes[i], "Hash stored successfully.");

        // Update mappings
        hashToBatchId[hashes[i]] = currentBatch;
        hashToId[hashes[i]] = currentHashCount;

        // Store the result for that hash
        results[i] = StoreResult({
            Hash: hashes[i],
            stored: true
        });

        // Increment the current count for this batch
        currentHashCount++;

        // Once the batch is full, calculate the Merkle root
        if (currentHashCount == BATCH_SIZE) {
            batches[currentBatch].merkleRoot = calculateMerkleRoot(batches[currentBatch].hashes);
        }
    }

    return results; // Return the result for each hash processed
}




// Define a struct to store the result of each revocation attempt
struct RevokeResult {
    string hash;      // The hash being revoked
    bool stat;     // A flag indicating if the hash was successfully revoked
}

// Function to revoke hashes by flagging them as revoked and returning an array of objects
function revokeHashes(string[] memory hashesToRevoke) public onlyOwner returns (RevokeResult[] memory) 
{
    uint256 length = hashesToRevoke.length;
    RevokeResult[] memory results = new RevokeResult[](length);

    

    for (uint256 i = 0; i < length; i++) {
        string memory hashToRevoke = hashesToRevoke[i];
        uint256 batchId = hashToBatchId[hashToRevoke];  // Map the hash to its batch ID
        uint256 id = hashToId[hashToRevoke];           // Map the hash to its id in the batch
        //bool isRevoked = 0;
        bool stat= false;                     // Default revocation status

        // Check if the batch ID and index are valid
        if (batchId <= currentBatch && id < batches[batchId].hashes.length) {
            // Revoke the hash if it exists and is not already revoked
            if (!batches[batchId].revoked[id]) 
            {
                batches[batchId].revoked[id] = true;    // Mark the hash as revoked
                //isRevoked = true;     
                stat = true;                 // Update revocation status
                emit HashRevoked(hashToRevoke,stat); // Emit revocation event
                
                
            } else
             {
                emit HashRevoked(hashToRevoke,stat); // Emit failure event for already revoked hash
            }
        } else 
            {
            emit HashRevoked(hashToRevoke,stat); // Emit failure event for invalid hash
            }

        // Populate the result struct with the hash and its revocation status
        results[i] = RevokeResult({
            hash: hashToRevoke,
            stat: stat
        });
        
    }

    return results;  // Return the array of results
}




    // need to work on logic of this function to getting the merkle root
    // Function to get merkle root to be pushed into Avalanche
    function getHashByValue(string memory hash) public view returns (/*uint256, uint256, */string memory, bytes32) {
        uint256 batchId = hashToBatchId[hash];
        uint256 id = hashToId[hash];

        require(id < batches[batchId].hashes.length, "Invalid ID in batch.");
        require(!batches[batchId].revoked[id], "Hash has been revoked.");

        bytes32 merkleRoot = batches[batchId].merkleRoot;


        return (hash, merkleRoot);
    }





    // Define a struct for the return type
struct VerificationResult {
    string verifiedHashes;
    bool verificationResults;
    bool revoked;
}

// Function to verify an array of hashes for bulk verification
function verifyHashesByValue(string[] memory hashesToVerify) 
    public 
    view 
    returns (VerificationResult[] memory) 
{
    uint256 length = hashesToVerify.length;
    VerificationResult[] memory results = new VerificationResult[](length);

    for (uint256 i = 0; i < length; i++) {
        string memory hashToVerify = hashesToVerify[i];
        uint256 batchId = hashToBatchId[hashToVerify];
        uint256 id = hashToId[hashToVerify];
        bool isVerified = false;
        bool isrevoked = false;
        isrevoked = batches[batchId].revoked[id];



        if (id < batches[batchId].hashes.length && !batches[batchId].revoked[id]) {
            string memory storedHash = batches[batchId].hashes[id];
            //isrevoked = batches[batchId].revoked[id];
            if (keccak256(abi.encodePacked(storedHash)) == keccak256(abi.encodePacked(hashToVerify))) {
                isVerified = true;
            }
        }

        // Populate the result struct
        results[i] = VerificationResult({
            verifiedHashes: hashToVerify,
            verificationResults: isVerified,
            revoked: isrevoked
        });
    }

    return results;
}

    


    
    //Function to calculate merkleroot from hashes in a batch
    function calculateMerkleRoot(string[] memory hashes) internal pure returns (bytes32) {
        if (hashes.length == 0) return bytes32(0);
        bytes32[] memory merkleTree = new bytes32[](hashes.length);

        for (uint256 i = 0; i < hashes.length; i++) {
            merkleTree[i] = keccak256(abi.encodePacked(hashes[i]));
        }

        uint256 n = merkleTree.length;
        while (n > 1) {
            for (uint256 i = 0; i < n / 2; i++) {
                merkleTree[i] = keccak256(abi.encodePacked(merkleTree[2 * i], merkleTree[2 * i + 1]));
            }
            n = (n + 1) / 2;
        }
        return merkleTree[0];
    }
}