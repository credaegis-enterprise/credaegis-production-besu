This is just a base initialization of the hyperledger besu network using 4 nodes and QBFT in a single server.


generate-network-docker-compose.yml - generates networkFiles which contains configuration for genesis block and public and private keys based on qbftConfigFile.json .(as of now a sample structure is provided, if needed run docker compose -f generate-network-docker-compose.yml up -d )



start-network-docker-compose.yml - starts the network consisting of 4 nodes which one node is boot-node to establish connect between peers.

To start the network - docker compose -f start-network-docker-compose.yml up -d
To stop the network - docker compose -f start-network-docker-compose.yml down -d
