import { useEffect, useState } from "react";
import { getContract } from "../../lib/web3";
import toast from "react-hot-toast";

export default function VoterDashboard() {
  const [cands, setCands] = useState([]);
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(false);

  async function load() {
    try {
      const vc = await getContract();
      const array = await vc.getCandidates();
      setCands(array);

      const vs = {};
      for (const c of array) {
        vs[c] = (await vc.getVotes(c)).toNumber();
      }
      setVotes(vs);

      const hasVoted = await hasAlreadyVoted();
      setVoted(hasVoted);

      localStorage.setItem('userRole', 'voter');
      window.dispatchEvent(new Event('userRoleChange'));
    } catch (err) {
      toast.error("Failed to load candidates.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function voteFor(c) {
    try {
      const vc = await getContract();
      // Start transaction
      const txPromise = vc.vote(c);

      toast.loading(`Submitting vote for ${c}...`, { id: "voting" });

      const tx = await txPromise;
      await tx.wait(); // Wait for confirmation

      toast.success(`Successfully voted for ${c}`, { id: "voting" });
      load(); // Reload data
    } catch (error) {
      console.error("Voting error:", error);

      let message = "Voting failed";
      if (error.code === 4001) {
        message = "Transaction rejected by user.";
      } else if (error?.error?.message?.includes("Already voted") || error?.reason?.includes("Already voted") 
        || error?.message?.includes("Already voted")) {
        message = "You have already voted.";
      } else if (error.reason) {
        message = error.reason;
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message, { id: "voting" });
    }
  }

  return (
    <div className="p-6 bg-background">
      <h1 className="text-2xl text-primary mb-4">Vote for a candidate</h1>
    {cands.length === 0 ? (
      <div className="text-gray-500">No candidates available.</div>
    ) : (
      cands.map(c => (
        <div key={c} className="flex items-center justify-between bg-white p-4 mb-2 rounded shadow">
          <span>{c}: {votes[c]}</span>
          {voted ? (
            <span className="text-gray-500 font-semibold">Already Voted</span>
          ) : (
            <button
              onClick={() => voteFor(c)}
              className="bg-primary text-white px-3 py-1 rounded"
            >
              Vote
            </button>
          )}
        </div>
      ))
    )}
    </div>
  );
}
