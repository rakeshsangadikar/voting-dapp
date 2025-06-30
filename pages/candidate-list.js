import { useEffect, useState } from 'react';
import { getReadContract } from '@/lib/contract';
import { Eye } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { USER_STATUS } from '@/lib/constant';

// const mockCandidates = [
//   {
//     id: 1,
//     name: 'John Doe',
//     wallet: '0xAbC1234567890DefABC1234567890DefABC12345',
//     photo: 'https://randomuser.me/api/portraits/men/1.jpg',
//     status: 'pending',
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     wallet: '0xDeF9876543210AbcDEF9876543210AbcDEF98765',
//     photo: 'https://randomuser.me/api/portraits/women/2.jpg',
//     status: 'approved',
//   },
// ];

export default function CandidateList() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCandidates = async () => {
    try {
      const contract = getReadContract();
      const addrs = await contract.read.getCandidateList();
      const data = await Promise.all(
        addrs.map(async (addr, idx) => {
          const [name, slogan, voteCount, photoUrl, docUrl, status] = await contract.read.getCandidateDetails([addr]);
          console.log("status", status);
          return {
            id: idx + 1,
            wallet: addr,
            name,
            slogan,
            status: USER_STATUS[Number(status)].toLowerCase(),
            votes: Number(voteCount),
            photoUrl,
            docUrl,
          };
        })
      );
      setCandidates(data);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Candidate List</h2>
      <div className="overflow-x-auto">
        { candidates.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-6">
            No candidates found. Please check back later.
          </div>
        ) : loading ? (
            <div className="text-center text-gray-500 py-6">
              Loading candidates...
            </div>
        ) : (
          <table className="min-w-full border-collapse rounded-md overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Name</th>
                <th className="px-4 py-2 border text-left">Wallet</th>
                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border">{candidate.id}</td>
                  <td className="px-4 py-2 border">{candidate.name}</td>
                  <td className="px-4 py-2 border break-all">{candidate.wallet}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        candidate.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : (candidate.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700')
                      }`}
                    >
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Candidate"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </DialogTrigger>

                      {selectedCandidate && (
                        <DialogContent className="sm:max-w-md px-6 py-4 box-border">
                          <DialogHeader>
                            <DialogTitle>Candidate Details</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 text-left break-words">
                            <div className="flex justify-center">
                              <img
                                src={selectedCandidate.photoUrl}
                                alt={selectedCandidate.name}
                                className="w-24 h-24 rounded-full border"
                              />
                            </div>
                            <p className='text-center'><strong> {selectedCandidate.name}</strong></p>
                            <p><strong>Wallet:</strong> <span className="break-all">{selectedCandidate.wallet}</span></p>
                            <p><strong>Status:</strong> {selectedCandidate.status}</p>
                            {/* <p><strong>Supporting Docs:</strong> <a target='_blank'> {selectedCandidate.docUrl}</a></p> */}
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

