// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStore {

    uint256 private batchHashCount = 0;
    uint256 private currentBatch = 1; //batch id is numbered from 1 rather than starting from 0
    uint256 private lastHashIndex = 0;

    
    struct Batch {
        string[] hashes;
        string merkleRoot;
        uint256 lastHashIndex;
        mapping(uint256 => bool) revoked; // Mapping to track revocation status for each hash
    }

    mapping(uint256 => Batch) private batches;
    mapping(string => uint256) private hashToBatchId;
    mapping(string => uint256) private hashToId;
    

    //uint256 constant BATCH_SIZE = 6; //change this number to whatever you like to be the batch size

   

    event HashStored(uint256 indexed batchId, uint256 indexed id, string hash, string message);
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

        // Store the hash in the current batch
            batches[currentBatch].hashes.push(hashes[i]);
            uint256 id = batches[currentBatch].hashes.length - 1; // to get index number of hash stored in the "hashes" array under that batch

            // Update mappings
            hashToBatchId[hashes[i]] = currentBatch;
            hashToId[hashes[i]] = id;

            // Increment the current count
            batchHashCount++;

            lastHashIndex = id; //index of last added hash

            // Emit an event
            emit HashStored(currentBatch, id, hashes[i], "Hash stored successfully.");


        // Store the result for that hash
        results[i] = StoreResult({
            Hash: hashes[i],
            stored: true
        });
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
        bool stat= false;                     // Default revocation status

        // Check if the batch ID and index are valid
        if (batchId <= currentBatch && id < batches[batchId].hashes.length) {
            // Revoke the hash if it exists and is not already revoked
            if (!batches[batchId].revoked[id]) 
            {
                batches[batchId].revoked[id] = true;    // Mark the hash as revoked
                 
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




// Define a struct for the return type
struct VerificationResult {
    string verifiedHashes;
    bool verificationResults;
    bool revoked;
    string merkleRoot;
}

// Function to verify an array of hashes for bulk verification
function verifyHashesByValue(string[] memory hashesToVerify) public view returns (VerificationResult[] memory) 
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
        string memory merkleroot = batches[batchId].merkleRoot; 



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
            revoked: isrevoked,
            merkleRoot: merkleroot
        });
    }

    return results;
}



// Function to fetch hashes that are in current batch segment
function getHashesForNextBatch() public view returns (string[] memory) {
    uint256 startIndex;

    if (currentBatch == 1) {
        // If no batch finalized, start from the first hash
        startIndex = 0;
    } else {
        // Get the index after the last finalized hash
        startIndex = batches[currentBatch].lastHashIndex;
    }

    // The actual end index of the last hash (since lastHashIndex is 1-based, subtract 1)
    uint256 endIndex = lastHashIndex;
    require(endIndex >= startIndex, "No new hashes to return");

    uint256 resultLength = endIndex - startIndex + 1;
    string[] memory result = new string[](resultLength);

    for (uint256 i = 0; i < resultLength; i++) {
        result[i] = batches[currentBatch].hashes[startIndex + i];
    }

    return result;
}





// Function to finalise batch 
function finaliseBatch(string memory merkleroot) public onlyOwner returns (uint256,bool) {

    // Initialise status with 'false' 
    bool statuses = false;

    batches[currentBatch].merkleRoot = merkleroot;
    batches[currentBatch].lastHashIndex = lastHashIndex;

    // Increment the batch count to create a new batch
    currentBatch++;

    // Reset the hash counter for the next batch
    batchHashCount = 0;

    if (batchHashCount == 0) 
    {
        statuses = true;
    }

    return(currentBatch-1,statuses);

    
}



//Structure for returning all merkle roots
struct allMerkleRoot
{
    string roots;
}
//Function to fetch all the merkle roots in blockchain
function getAllMerkleRoot() public view returns(allMerkleRoot[] memory)
{
    allMerkleRoot[] memory result = new allMerkleRoot[](currentBatch-1); //length at last bracket is allocated currentBatch-1 to avoid allocating an extra location in return array
    for(uint256 i = 1; i < currentBatch; i++)
    {
        result[i-1] = allMerkleRoot(batches[i].merkleRoot); //result[i-1] because to store it in 0th position
    }

    return result;
} 




function getContractDetails() public view returns (uint256,uint256,uint256)
    {
         return (batchHashCount,currentBatch,lastHashIndex);
        
    }


// Function to fetch batch details by batch ID
    function getBatchById(uint256 batchId) public view returns (string[] memory,string memory,uint256)
    {
        Batch storage batch = batches[batchId];
        return (batch.hashes, batch.merkleRoot, batch.lastHashIndex);
    }

}




