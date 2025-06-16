import { useState } from "react";
import { getContract } from "../../lib/web3";
import toast from "react-hot-toast";

export default function CreateCandidate() {
  const [name, setName] = useState("");

  const handleAddCandidate = async () => {
    const contract = await getContract();
    try {
      const tx = await contract.addCandidate(name);
      toast.loading("Adding candidate...", { id: "candidate" });
      await tx.wait();
      toast.success("Candidate added successfully!", { id: "candidate" });
      setName("");
    } catch (err) {
      toast.error("Failed to add candidate.", { id: "candidate" });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-blue-900">
      <h1 className="text-2xl font-bold mb-4">Create Candidate</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <button
          onClick={handleAddCandidate}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add Candidate
        </button>
      </div>
    </div>
  );
}
