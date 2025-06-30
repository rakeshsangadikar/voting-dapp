import { useEffect, useState } from 'react';
import { getReadContract } from '@/lib/contract';
import { USER_STATUS } from '@/lib/constant';
import UserModal from '@/components/Common/UserModal';

export default function VoterList() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const contract = getReadContract();
        const voterAddresses = await contract.read.getVoterList();

        const voterData = await Promise.all(
          voterAddresses.map(async (addr, index) => {
            const [name, wallet, docUrl, hasVoted, candAddr, status] = await contract.read.getVoterDetails([addr]);
            console.log("status===>{}"+ status);
            return {
              id: index + 1,
              name,
              wallet,
              status: USER_STATUS[Number(status)].toLowerCase(),
              hasVoted,
              docUrl,
            };
          })
        );

        setVoters(voterData);
      } catch (error) {
        console.error("Error fetching voters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Voter List</h2>

      { voters.length === 0 && !loading ? (
        <p className="text-center text-gray-500">No voters found.</p>
      ) : loading ? (
        <p className="text-center text-gray-500">Loading voters...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Name</th>
                <th className="px-4 py-2 border text-left">Wallet</th>
                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {voters.map((voter, index) => (
                <tr key={voter.wallet} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border">{voter.id}</td>
                  <td className="px-4 py-2 border">{voter.name}</td>
                  <td className="px-4 py-2 border break-all">{voter.wallet}</td>
                  <td className="px-4 py-2 border capitalize">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        voter.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : (voter.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700')
                      }`}
                    >
                      {voter.status.charAt(0).toUpperCase() + voter.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <UserModal
                      type="voter"
                      user={voter}
                      index={index}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
