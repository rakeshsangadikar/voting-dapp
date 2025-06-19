import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getReadOnlyContract } from "../../lib/web3";

export default function VoterLogin() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    try {
      const contract = await getReadOnlyContract();
      const isVoter = await contract.isVoterValid(address);

      if (isVoter) {
        toast.success("Login successful!");
        router.push("/voter/dashboard");
      } else {
        toast.error("Address is not a registered voter");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full animate-fade-in">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Voter Login</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your registered Ethereum wallet address to access your dashboard.
        </p>

        <form onSubmit={login}>
          <label className="block text-gray-700 mb-2 font-medium">
            Wallet Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Make sure your wallet address is correct and registered by your institute.
        </p>
      </div>
    </div>
  );
}
