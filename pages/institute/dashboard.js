import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getContract } from "../../lib/web3";
import { toast } from "react-hot-toast";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InstituteDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const router = useRouter();

  async function loadData() {
    try {
      const vc = await getContract();
      const cands = await vc.getCandidates();
      const vs = {};
      let total = 0;

      for (const c of cands) {
        const count = (await vc.getVotes(c)).toNumber();
        vs[c] = count;
        total += count;
      }

      setCandidates(cands);
      setVotes(vs);
      setTotalVotes(total);

      localStorage.setItem("userRole", "institute");
      window.dispatchEvent(new Event("userRoleChange"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load candidate data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const chartData = {
    labels: candidates,
    datasets: [
      {
        data: candidates.map(c => votes[c] || 0),
        backgroundColor: [
          "#4B5563",
          "#6366F1",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#3B82F6",
          "#8B5CF6",
          "#F472B6",
          "#0EA5E9",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      {/* Top Control Row */}
      <div className="flex justify-between items-center mb-6">
        {/* Left Buttons */}
        <div className="space-x-3">
          <button
            onClick={() => router.push("/institute/voters")}
            className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900"
          >
            Voter List
          </button>
          <button
            onClick={() => router.push("/institute/candidates")}
            className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900"
          >
            Candidate List
          </button>
        </div>

        {/* Right Button */}
        {/* <div className="space-x-3">
          <button
            onClick={() => router.push("/institute/graph-dashboard")}
            className="bg-purple-700 text-white px-4 py-2 rounded shadow hover:bg-purple-800"
          >
            Graph View
          </button>
        </div> */}
      </div>

      {/* Table and Chart Layout */}
      <div className="flex gap-6 flex-wrap">
        {/* Candidate Table */}
        <div className="bg-white shadow rounded p-4 w-full md:w-1/2 overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">Candidate Vote Summary</h2>
          {candidates.length > 0 ? (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 border">Candidate</th>
                  <th className="text-left p-2 border">Vote Count</th>
                  <th className="text-left p-2 border">Vote %</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c}>
                    <td className="p-2 border">{c}</td>
                    <td className="p-2 border">{votes[c]}</td>
                    <td className="p-2 border text-center">
                      {totalVotes > 0
                        ? ((votes[c] / totalVotes) * 100).toFixed(2) + "%"
                        : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center h-64 flex items-center justify-center">
              No Candidates Summary available
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded p-4 flex-1 min-w-[300px]">
          <h2 className="text-lg font-bold mb-4">Vote Distribution</h2>
          {totalVotes > 0 ? (
            <Pie data={chartData} />
          ) : (
            <div className="text-gray-500 text-center h-64 flex items-center justify-center">
              No votes yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
