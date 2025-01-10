readme
------

**To initialise the network on new system, run:**

 npx hardhat --network qbft



**This is just a base initialization of the Hyperledger Besu network using 4 nodes and QBFT on a single server.**

generate-network-docker-compose.yml:
Generates networkFiles, which contain configuration for the genesis block, as well as public and private keys for each node based on qbftConfigFile.json.
(As of now, a sample structure is provided. If needed, run the following command to regenerate the files):
docker compose -f generate-network-docker-compose.yml up -d



start-network-docker-compose.yml:
Starts the network consisting of 4 nodes, with one node acting as a boot node to establish connections between peers.

**To start the network, run:**


docker compose -f start-network-docker-compose.yml up -d

**To stop the network, run:**

docker compose -f start-network-docker-compose.yml down -d

**To deploy scripts at after making changes in smart contract, run:**

 npx hardhat run scripts/deploy.js --network qbft

HERE, THE CONTRACT WILL BE DEPLOYED TO NEW ADDRESS
SO, CHANGE THE CONTRACT ADRESS IN *interact.js*

Also modify the ABI in interact.js with the new ABI generated in **~artifacts/contracts/HashStore.sol/HashStore.json**

**To run functions in the *hashstore.sol* run:**
 
 node interact.js

*comment out functions that you don't wish to run*


**code the private key to .env file and invoke it to .js later**

**To test follow this steps**
1) store hashes
2) gethashesfornextbatch
3) finaliseBatches

