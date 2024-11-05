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
    uint256 private currentBatch;
    uint256 private currentHashCount;

    uint256 constant BATCH_SIZE = 5; //change this number to whatever you like to be the batch size

   

    event HashStored(uint256 indexed batchId, uint256 indexed id, string hash, string message);
    event HashRevoked(uint256 indexed batchId, uint256 indexed id, string message);

    address private owner;


    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to store hashes by taking input hashes as array
    function storeHash(string[] memory hashes) public {
        for (uint256 i = 0; i < hashes.length; i++) {
            if (currentHashCount == BATCH_SIZE) {
                currentBatch++;  // Move to the next batch
                currentHashCount = 0;
            }

            // Store the hash in the current batch
            batches[currentBatch].hashes.push(hashes[i]);
            emit HashStored(currentBatch, currentHashCount, hashes[i], "Hash stored successfully.");

            // Update hash lookup mappings
            hashToBatchId[hashes[i]] = currentBatch;
            hashToId[hashes[i]] = currentHashCount;

            currentHashCount++;

            // Update Merkle root for the current batch when it's full
            if (currentHashCount == BATCH_SIZE) {
                batches[currentBatch].merkleRoot = calculateMerkleRoot(batches[currentBatch].hashes);
            }
        }
    }



   // Function to revoke hashes by flagging them as revoked
   function revokeHashes(string[] memory hashesToRevoke) public onlyOwner {
        for (uint256 i = 0; i < hashesToRevoke.length; i++) {
            string memory hashToRevoke = hashesToRevoke[i];
            uint256 batchId = hashToBatchId[hashToRevoke];
            uint256 id = hashToId[hashToRevoke];

            require(batchId <= currentBatch, "Invalid batch ID.");
            require(id < batches[batchId].hashes.length, "Invalid ID in batch.");

            // Revoke the hash and emit event
            batches[batchId].revoked[id] = true;
            emit HashRevoked(batchId, id, "Hash revoked successfully.");
        }
    }

    // need to work on logic of this function to getting the merkle root
    // Function to get merkle root to be pushed into Avalanche
    function getHashByValue(string memory hash) public view returns (/*uint256, uint256, */string memory, bytes32) {
        uint256 batchId = hashToBatchId[hash];
        uint256 id = hashToId[hash];

        require(id < batches[batchId].hashes.length, "Invalid ID in batch.");
        require(!batches[batchId].revoked[id], "Hash has been revoked.");

        bytes32 merkleRoot = batches[batchId].merkleRoot;

        // *old* return (batchId, id, hash, merkleRoot);

        return (hash, merkleRoot);
    }



    // Function to verify an array of hashes for bulk verification
    function verifyHashesByValue(string[] memory hashesToVerify) public view returns (string[] memory, bool[] memory) {
        uint256 length = hashesToVerify.length;
        bool[] memory verificationResults = new bool[](length);
        string[] memory verifiedHashes = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            string memory hashToVerify = hashesToVerify[i];
            uint256 batchId = hashToBatchId[hashToVerify];
            uint256 id = hashToId[hashToVerify];
            
            if (id < batches[batchId].hashes.length && !batches[batchId].revoked[id]) {
                string memory storedHash = batches[batchId].hashes[id];
                if (keccak256(abi.encodePacked(storedHash)) == keccak256(abi.encodePacked(hashToVerify))) {
                    verificationResults[i] = true;
                    verifiedHashes[i] = hashToVerify;
                } else {
                    verificationResults[i] = false;
                }
            } else {
                verificationResults[i] = false;
            }
        }

        return (verifiedHashes, verificationResults);
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
