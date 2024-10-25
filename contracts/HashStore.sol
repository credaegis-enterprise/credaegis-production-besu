// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStore {
    mapping(uint256 => string) private hashes;

    event HashStored(uint256 indexed id, string hash, string message);
    event HashRetrieved(uint256 indexed id, string hash, string message);
    event HashVerified(uint256 indexed id, bool isVerified, string message);

    function storeHash(uint256 id, string memory hash) public {
        hashes[id] = hash;
        emit HashStored(id, hash, "Hash stored successfully.");
    }

    function getHash(uint256 id) public view returns (string memory) {
        return hashes[id]; // Just return the stored hash
    }

    function verifyHash(uint256 id, string memory hashToVerify) public view returns (bool) {
        string memory storedHash = hashes[id];
        bool isVerified = (keccak256(abi.encodePacked(storedHash)) == keccak256(abi.encodePacked(hashToVerify)));
        return isVerified; // Return verification result
    }
}

