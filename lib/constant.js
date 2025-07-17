// --- Blockchain Config ---
export const CONTRACT_ADDRESS = "0x11CF12D2748Cc9190AA9bD1032440a47279dB3df";

export const LOCAL_CHAIN_ID = 1337  // Holesky Testnet
export const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export const HOLESKY_CHAIN_ID = 17000  // Holesky Testnet
export const HOLESKY_RPC_URL = "https://rpc.ankr.com/eth_holesky";

// --- Pinata Cloud Config ---
export const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYjcwOGRmYy01MjA4LTRhZWQtYWU4NS1lYjAxNjY5OWNjMGQiLCJlbWFpbCI6InJha2VzaHNhbmdhZGlrYXIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjNmNmODU1Y2M3OTc5MmI3Nzk3NiIsInNjb3BlZEtleVNlY3JldCI6IjRiZjJiNmM4YTE4MWM2NjI0ODUyZmFlMjJlYzdiZTI1ZjczNjQ2YTBkY2UwYTYzODgxM2QyNTQxM2UwMzVhMGYiLCJleHAiOjE3ODI3MjM4ODB9.YvtpKxqGH6Do99R6-ylYR-pHlZhtoa5pr25wdNexz5A";
export const PINATA_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
export const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

export const USER_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected"
};

export const USER_STATUS_TO_INT = {
  "pending": 0,
  "approved": 1,
  "rejected": 2
};

export const WALLET_PRIVATE_KEY = "some_private_key_here"; // Replace with your actual private key
