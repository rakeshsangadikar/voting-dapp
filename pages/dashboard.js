import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReadContract } from "@/lib/contract";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [leading, setLeading] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getElectionSummary = async () => {
      try {
        const contractInstance = getReadContract();

        const start = Number(await contractInstance.read.startTime());
        const end = Number(await contractInstance.read.endTime());
        const now = Math.floor(Date.now() / 1000);

        setStartTime(start);
        setEndTime(end);

        if (now < start) setStatus("UPCOMING");
        else if (now > end) setStatus("ENDED");
        else setStatus("LIVE");

        const candidateAddrs = await contractInstance.read.getDashboardCandidate();
        const data = await Promise.all(
          candidateAddrs.map(async (addr) => {
            const [name, slogan, voteCount, photoUrl, docUrl] =
              await contractInstance.read.getCandidateDetails([addr]);
            return {
              address: addr,
              name,
              slogan,
              votes: Number(voteCount),
              photoUrl,
              docUrl,
            };
          })
        );

        setCandidates(data);
        setLeading(data.reduce((a, b) => (a.votes > b.votes ? a : b), data[0]));
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setStatus("Error");
      }
    };

    getElectionSummary();
    const interval = setInterval(getElectionSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      let diff = 0;

      if (status === "UPCOMING" && startTime) diff = startTime - now;
      else if (status === "LIVE" && endTime) diff = endTime - now;
      else {
        setTimeLeft("");
        return;
      }

      if (diff < 0) {
        setTimeLeft("0 days 0 hrs 0 mins 0 secs");
        return;
      }

      const days = Math.floor(diff / (3600 * 24));
      const hrs = Math.floor((diff % (3600 * 24)) / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;

      setTimeLeft(`${days} days ${hrs} hrs ${mins} mins ${secs} secs`);
    };

    timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [status, startTime, endTime]);

  const COLORS = ["#2563EB", "#10B981", "#F97316", "#EF4444", "#8B5CF6"];

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">📊 Voting Dashboard</h1>
        {status !== "ENDED" && timeLeft && (
          <div className="text-md bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-sm">
            ⏳ Voting will be {status === "LIVE" ? "close in" : " starts in"}: {timeLeft}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            🗳️ Election Status:{" "}
            <span className="text-blue-600">{status}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center min-h-[280px]">
          {leading && leading?.votes > 0 && (
            <div className="text-xl font-semibold text-yellow-500">
              🥇 Leading: {leading.name} ({leading.votes} votes)
            </div>
          )}

          {mounted &&
          candidates.length > 0 &&
          candidates.some((c) => c.votes > 0) ? (
            <motion.div
              className="w-64 h-64"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <PieChart width={250} height={250}>
                <Pie
                  data={candidates}
                  dataKey="votes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {candidates.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </motion.div>
          ) : (
            <motion.div
              className="text-gray-400 italic text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No candidates or votes yet.
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Candidate Summary
        </h2>
        {candidates.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No candidates found. Please check back later.
          </div>
        ) : (
          <table className="w-full table-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">Photo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Slogan</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Votes</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 bg-white">
              {candidates.map((c, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-center">
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">{c.name}</td>
                  <td className="px-4 py-3 text-center">{c.slogan}</td>
                  <td className="px-4 py-3 text-center font-bold">{c.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
