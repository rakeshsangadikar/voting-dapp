import { useEffect, useState } from "react";
import { getContract } from "../../lib/web3";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GraphDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadVotes() {
      const vc = await getContract();
      const candidates = await vc.getCandidates();
      const candidateData = [];
      let totalVotes = 0;

      for (let name of candidates) {
        const count = await vc.getVotes(name);
        const votes = count.toNumber();
        totalVotes += votes;
        candidateData.push({ name, votes });
      }

      // Add percentage for each
      const withPercent = candidateData.map(c => ({
        ...c,
        percentage: totalVotes === 0 ? 0 : ((c.votes / totalVotes) * 100).toFixed(2)
      }));

      setData(withPercent);
    }

    loadVotes();
  }, []);

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl text-primary font-bold mb-6">Candidate Vote Graph</h1>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#1E40AF" />
          <YAxis stroke="#1E40AF" />
          <Tooltip />
          <Bar dataKey="votes" fill="#1E40AF" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-8">
        <h2 className="text-xl text-primary font-semibold mb-2">Candidate Summary</h2>
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="text-left bg-blue-100">
              <th className="py-2 px-4">Candidate</th>
              <th className="py-2 px-4">Votes</th>
              <th className="py-2 px-4">Vote %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 px-4">{c.name}</td>
                <td className="py-2 px-4">{c.votes}</td>
                <td className="py-2 px-4">{c.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
