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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={login} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-primary mb-4 text-xl text-center">Voter Login</h1>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your wallet address"
          className="border p-2 w-full mb-4 rounded"
        />
        <button type="submit" className="bg-primary text-white p-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}
