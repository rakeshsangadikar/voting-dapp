import { useState } from "react";
import { getContract } from "../../lib/web3";
import toast from "react-hot-toast";

export default function CreateVoter() {
  const [address, setAddress] = useState("");

  const handleAddVoter = async () => {
    const contract = await getContract();
    try {
      const tx = await contract.registerVoter(address);
      toast.loading("Registering voter...", { id: "voter" });
      await tx.wait();
      toast.success("Voter registered successfully!", { id: "voter" });
      setAddress("");
    } catch (err) {
      toast.error("Failed to register voter.", { id: "voter" });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-blue-900">
      <h1 className="text-2xl font-bold mb-4">Create Voter</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Voter Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <button
          onClick={handleAddVoter}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Register Voter
        </button>
      </div>
    </div>
  );
}
