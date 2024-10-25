// scripts/deploy.js

// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const [deployer] =await ethers.getSigners();
    const HashStore = await ethers.getContractFactory("HashStore");
    const hashStore = await HashStore.deploy(); // Deploying the contract



    console.log("HashStore deployed to:", hashStore.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

