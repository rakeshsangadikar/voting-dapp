


# Voting DApp

> This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app), integrated with Hardhat for smart contract development and deployment.

---

**Created and managed by Rakesh Sangadikar**

---

## Step-by-Step Setup & Run Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd voting-dapp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory to store all required environment variables. This file is ignored by git and is the recommended way to manage secrets and configuration for local development in Next.js projects.

**Example `.env.local`:**

```env
# Example environment variables
# Replace the values with your actual configuration

# Infura/Alchemy/Other RPC URL for blockchain connection
NEXT_PUBLIC_RPC_URL=https://your_rpc_url_here

# Pinata or IPFS API keys (if using file uploads)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret

# Any other required environment variables
# NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

> **Note:**
> - Prefix variables with `NEXT_PUBLIC_` to expose them to the browser (required for frontend usage in Next.js).
> - Do **not** commit your `.env.local` file to version control.
> - Add any additional variables your project requires (e.g., contract addresses, API endpoints, etc).

### 4. Compile & Deploy Smart Contracts (Local Network)

Start a local Hardhat node:

```bash
npm run hardhat-local
# or
npx hardhat node
```

In a new terminal, deploy contracts to the local network:

```bash
npm run deploy-local
# or
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

### 7. Lint the Project

```bash
npm run lint
```

---

## Useful Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run hardhat-local` - Start local Hardhat node
- `npm run deploy-local` - Deploy contracts to local node
- `npm run deploy-hardhat` - Deploy contracts to Hardhat network

---

## Project Structure

- `contracts/` - Solidity smart contracts
- `scripts/` - Deployment scripts
- `pages/` - Next.js pages
- `components/` - React components
- `lib/` - Utility libraries
- `context/` - React context providers

---



## Deployment

You can deploy this app easily on [Vercel](https://vercel.com/) or any platform supporting Next.js.

---

## License

MIT


