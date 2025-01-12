// Import the Migrations contract
const Migrations = artifacts.require("Migrations");

//importing additional contracts
const AnotherContract = artifacts.require("AnotherContract");
const TokenContract = artifacts.require("TokenContract");
const Flashswap = artifacts.require("Flashswap");
const Flashswaptest = artifacts.require("Flashswaptest");

module.exports = async function (deployer, network, accounts) {
  // Deploy the Migrations contract
  await deployer.deploy(Migrations);
  const migrationsInstance = await Migrations.deployed();

  console.log("Migrations deployed at:", migrationsInstance.address);

  // Deploy another contract with dependencies or initial values
  const initialSupply = 1000000;
  await deployer.deploy(TokenContract, "MyToken", "MTK", initialSupply);
  const tokenInstance = await TokenContract.deployed();

  console.log("TokenContract deployed at:", tokenInstance.address);

  // Deploy another contract and pass the address of a previously deployed contract
  await deployer.deploy(AnotherContract, tokenInstance.address);
  const anotherContractInstance = await AnotherContract.deployed();

  console.log("AnotherContract deployed at:", anotherContractInstance.address);

  // Interact with the deployed contracts to set additional state
  await tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] });
  console.log("Transferred 1000 tokens to account:", accounts[1]);

  // Set a value in AnotherContract using the address of TokenContract
  await anotherContractInstance.setTokenAddress(tokenInstance.address);
  console.log("Token address set in AnotherContract");

  // Handle different configurations based on the network
  if (network === "development") {
    console.log("Deployment on development network completed.");
  } else if (network === "mainnet") {
    console.log("Deployment on mainnet completed. Ensure contracts are verified.");
  }

  // Additional Deployment Logic for Flashswap and Flashswaptest
  if (network === "mainnet") {
    await deployer.deploy(Flashswap);
    const flashswapInstance = await Flashswap.deployed();
    console.log("Flashswap deployed at:", flashswapInstance.address);
  } else if (network === "testnet") {
    await deployer.deploy(Flashswaptest);
    const flashswaptestInstance = await Flashswaptest.deployed();
    console.log("Flashswaptest deployed at:", flashswaptestInstance.address);
  }
};
