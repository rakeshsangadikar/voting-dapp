import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWalletClientSafe } from '../hooks/useWalletClientSafe';
import { getReadContract, getWriteContract } from "@/lib/contract";

export default function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const walletClient = useWalletClientSafe();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const contract = getReadContract();
        const addrs = await contract.read.getDashboardCandidate();

        const data = await Promise.all(
          addrs.map(async (addr) => {
            const [name, slogan, votes, photoUrl, docUrl] =
              await contract.read.getCandidateDetails([addr]);
            return {
              wallet: addr,
              name,
              slogan,
              photoUrl,
              docUrl,
              votes: Number(votes),
            };
          })
        );

        const voted = await contract.read.hasUserVoted();
        setHasVoted(voted);
        setCandidates(data);
      } catch (err) {
        console.error("Failed to load vote page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleVote = async (wallet) => {

    const votePromise = new Promise(async (resolve, reject) => {
        try {
            const contract = getWriteContract(walletClient);
            const tx = await contract.write.vote([wallet]);
            // await tx.wait();
            resolve("Vote submitted successfully!");
            setHasVoted(true);
        } catch (err) {
            const message = err?.shortMessage || err?.cause?.message || err?.message || "Voting failed";
            console.error("Vote failed:", err);
            reject(`${message}`);
        }
    });

    toast.promise(votePromise, {
        loading: 'Casting your vote...',
        success: (msg) => msg,
        error: (err) => err,
    });
  };

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Cast Your Vote
      </h2>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 mx-auto"
        />
      </div>

      { filteredCandidates.length === 0 && !loading ? (
        <p className="text-center text-gray-500">No candidates available to vote.</p>
      ) : loading ? (
        <p className="text-center text-gray-500">Loading candidates...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Photo</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Slogan</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c, i) => (
                <tr key={c.wallet} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.slogan}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          title="View Profile"
                          onClick={() => setSelectedCandidate(c)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md px-6 py-4">
                        <DialogHeader>
                          <DialogTitle className="text-lg font-semibold">
                            Candidate Profile
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-center">
                            <img
                              src={selectedCandidate?.photoUrl}
                              alt={selectedCandidate?.name}
                              className="w-24 h-24 rounded-full"
                            />
                          </div>
                          <p>
                            <strong>Name:</strong> {selectedCandidate?.name}
                          </p>
                          <p>
                            <strong>Wallet:</strong> {selectedCandidate?.wallet}
                          </p>
                          <p>
                            <strong>Slogan:</strong> {selectedCandidate?.slogan}
                          </p>
                          <p>
                            <strong>Document:</strong>{" "}
                            <a
                              href={selectedCandidate?.docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View
                            </a>
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {hasVoted ? (
                      <span className="text-green-600 font-semibold text-xs">
                        Already Voted
                      </span>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="text-sm">
                            Vote
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm your vote for {c.name}?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVote(c.wallet)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No matching candidates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
