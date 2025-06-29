import pkg from "hardhat";
// import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { ethers, network } = pkg;

async function main() {
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = startTime + 6 * 60 * 60;

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(startTime, endTime);
  await voting.deployed();

  const chainId = (await ethers.provider.getNetwork()).chainId;
  console.log(`✅ Deployed to ${network.name} (chainId: ${chainId})`);
  console.log(`🔗 Contract Address: ${voting.address}`);

  // Determine target env file
  const isLocal = network.name === "localhost" || network.name === "hardhat" || chainId === 1337;
  const envFile = isLocal ? ".env.local" : ".env";
  const envPath = path.resolve(__dirname, "..", envFile);

  // Update env file with contract address
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");

    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/g,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${voting.address}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${voting.address}\n`;
    }
  } else {
    envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${voting.address}\n`;
  }

  fs.writeFileSync(envPath, envContent.trim() + "\n");
  console.log(`🧾 ${envFile} updated with contract address.`);

  // Copy ABI JSON file to frontend contracts folder
  const sourceABIPath = path.resolve(__dirname, "..", "artifacts/contracts/Voting.sol/Voting.json");
  const targetABIPath = path.resolve(__dirname, "..", "contracts/Voting.json");

  if (fs.existsSync(sourceABIPath)) {
    fs.copyFileSync(sourceABIPath, targetABIPath);
    console.log("📦 ABI copied to contracts/Voting.json");
  } else {
    console.warn("⚠️ ABI file not found at expected path:", sourceABIPath);
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
