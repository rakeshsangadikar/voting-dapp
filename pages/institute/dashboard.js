import Link from "next/link";
import { useEffect, useState } from "react";
import { getContract } from "../../lib/web3";

export default function InstituteDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newCandidate, setNewCandidate] = useState("");


  useEffect(() => {
    async function loadData() {
      try {
        const vc = await getContract();
        const cands = await vc.getCandidates(); // assuming returns array of strings
        const vtrs = await vc.getVoters(); // assuming returns array of addresses

        setCandidates(cands);
        setVoters(vtrs);
        localStorage.setItem('userRole', 'institute');
        window.dispatchEvent(new Event('userRoleChange'));
      } catch (err) {
        console.error("Error loading contract data:", err);
      }
    }

    loadData();
  }, []);

  async function handleAddCandidate() {
    try {
      const vc = await getContract();
      const txPromise = await vc.addCandidate(newCandidate); // or your smart contract method
      toast.loading(`Adding candidate "${newCandidate}"...`, { id: "adding" });

      const tx = await txPromise;
      await tx.wait();
      toast.success("Candidate added successfully!", { id: "adding" });

      setShowDialog(false);
      setNewCandidate("");
      load(); // refresh list
    } catch (error) {
      toast.success("Failed to add Candidate.", { id: "adding" });
      toast.error(error?.reason || error?.message || "Failed to add candidate");
    }
  }


  return (
    <div className="min-h-screen bg-white px-6 py-8 text-blue-900">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Institute Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-blue-100 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Candidates</h2>
          <p className="text-4xl font-bold text-blue-700">{candidates.length}</p>
        </div>
        <div className="bg-blue-100 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Voters</h2>
          <p className="text-4xl font-bold text-blue-700">{voters.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <button onClick={() => setShowDialog(true)}
          className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800"> 
          Add Candidate
        </button>

        <Link href="/institute/create-voter" className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800">
          Add New Voter
        </Link>
        <Link href="/institute/graph-dashboard" className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800">
          View Graph Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Registered Candidates</h2>
        <ul className="bg-white border rounded shadow divide-y">
          {candidates.map((name, idx) => (
            <li key={idx} className="p-4">{name}</li>
          ))}
          {candidates.length === 0 && <li className="p-4 text-gray-500">No candidates yet.</li>}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Registered Voters</h2>
        <ul className="bg-white border rounded shadow divide-y">
          {voters.map((voter, idx) => (
            <li key={idx} className="p-4">{voter}</li>
          ))}
          {voters.length === 0 && <li className="p-4 text-gray-500">No voters yet.</li>}
        </ul>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-4">Add New Candidate</h2>
            <input
              type="text"
              value={newCandidate}
              onChange={e => setNewCandidate(e.target.value)}
              placeholder="Candidate Name"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={handleAddCandidate}
                className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800">
                Add
              </button>
              <button onClick={() => setShowDialog(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
