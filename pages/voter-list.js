const mockVoters = [
  { id: 1, name: 'Alice Johnson', wallet: '0xAbc123456789', hasVoted: true },
  { id: 2, name: 'Bob Smith', wallet: '0xDef987654321', hasVoted: false },
  { id: 3, name: 'Charlie Lee', wallet: '0x789abcDEF123', hasVoted: true },
];

export default function VoterList() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Voter List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 border text-left">ID</th>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Wallet</th>
              <th className="px-4 py-2 border text-left">Has Voted</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {mockVoters.map((voter) => (
              <tr key={voter.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border">{voter.id}</td>
                <td className="px-4 py-2 border">{voter.name}</td>
                <td className="px-4 py-2 border break-all">{voter.wallet}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      voter.hasVoted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {voter.hasVoted ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
