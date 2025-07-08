import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import UserModal from '@/components/Common/UserModal';
import { format } from 'date-fns';
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { USER_STATUS, USER_STATUS_TO_INT } from '@/lib/constant';
import { useWalletClientSafe } from "../hooks/useWalletClientSafe";
import { getReadContract, getWriteContract } from '@/lib/contract';

export default function SystemSettings() {
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const walletClient = useWalletClientSafe();

  const [electionDates, setElectionDates] = useState({
    start: '',
    end: '',
  });

  useEffect(() => {
    // if (!walletClient) {
    //   alert('Please connect your wallet to manage candidates and voters.');
    //   return;
    // }
    const getCandidates = async () => {
      const contractInstance = getReadContract();
      const candidateAddrs = await contractInstance.read.getCandidateList();
      const data = await Promise.all(
        candidateAddrs.map(async (addr) => {
          const [name, slogan, voteCount, photoUrl, docUrl, status] =
            await contractInstance.read.getCandidateDetails([addr]);
          return {
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
    }

    const getVoterList = async () => {
      const contractInstance = getReadContract();
      const voterAddrs = await contractInstance.read.getVoterList();
      const data = await Promise.all(
        voterAddrs.map(async (addr, index) => {
          const [name, wallet, docUrl, hasVoted, candAddr, status] = await contractInstance.read.getVoterDetails([addr]);
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
      setVoters(data);
    }

    const getElectionDates = async () => {
      const contractInstance = getReadContract();
      const start = await contractInstance.read.startTime();
      const end = await contractInstance.read.endTime();
      setElectionDates({
        start: format(new Date(Number(start) * 1000), 'yyyy-MM-dd HH:mm:ss'),
        end: format(new Date(Number(end) * 1000), 'yyyy-MM-dd HH:mm:ss'),
      });
    }

    getCandidates();
    getVoterList();
    getElectionDates();

  }, [walletClient]);

  const handleApproval = async (type, wallet, action) => {

    const approvalPromise = new Promise(async (resolve, reject) => {
      try {
        const writerContract = getWriteContract(walletClient);
        if (type === 'candidate') {
          await writerContract.write.changeCandidateStatus([wallet, USER_STATUS_TO_INT[action]]);
        } else if (type === 'voter') {
          await writerContract.write.changeVoterStatus([wallet, USER_STATUS_TO_INT[action]]);
        } else {
          throw new Error('Invalid type for approval');
        }

        const list = type === 'candidate' ? [...candidates] : [...voters];
        const updated = list.map(user =>
          user.wallet === wallet ? { ...user, status: action.charAt(0).toUpperCase() + action.slice(1) } : user
        );
        type === 'candidate' ? setCandidates(updated) : setVoters(updated);
        resolve(`${type.charAt(0).toUpperCase() + type.slice(1)} ${action}d successfully!`);
      }
      catch (error) {
        console.error(`Failed to ${action} ${type}:`, error);
        reject(`Failed to ${action} ${type}`);
      }
    });

    toast.promise(approvalPromise, {
      loading: `Processing ${action}...`,
      success: (msg) => msg,
      error: (err) => err,
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setElectionDates(prev => ({ ...prev, [name]: value }));
  };

  const saveDates = () => {
    // Call API to save electionDates
    console.log('Election Dates Updated:', electionDates);
    alert('Election dates updated');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <Tabs defaultValue="candidates">
        <TabsList className="flex bg-gray-100 dark:bg-gray-900 rounded-full p-1 shadow-inner w-fit mx-auto mb-6">
            <TabsTrigger
                value="candidates"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 
                        px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 
                        rounded-full transition-all hover:bg-white/70 dark:hover:bg-gray-800/70"
            >
                Candidate Requests
            </TabsTrigger>
            <TabsTrigger
                value="voters"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 
                        px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 
                        rounded-full transition-all hover:bg-white/70 dark:hover:bg-gray-800/70"
            >
                Voter Requests
            </TabsTrigger>
            <TabsTrigger
                value="election"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 
                        px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 
                        rounded-full transition-all hover:bg-white/70 dark:hover:bg-gray-800/70"
            >
                Election Settings
            </TabsTrigger>
            </TabsList>

        <TabsContent value="candidates">
            <Card>
              { candidates.length === 0 ? (
                <CardContent className="p-4 text-center">
                  <p className="text-gray-500">No candidate requests available.</p>
                </CardContent>
              ) : (
                <CardContent className="p-4">
                  <table className="w-full table-auto border text-sm">
                      <thead className="bg-gray-100">
                      <tr className="text-left">
                          <th className="p-2 border">Sr No</th>
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">Status</th>
                          <th className="p-2 border">Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      {candidates.map((candidate, index) => (
                          <tr key={candidate.id} className="border-t hover:bg-gray-50">
                          <td className="p-2 border">{index + 1}</td>
                          <td className="p-2 border">{candidate.name}</td>
                          <td className="p-2 border capitalize">
                              <span
                              className={`font-medium ${
                                  candidate.status === "approved"
                                  ? "text-green-600"
                                  : candidate.status === "rejected"
                                  ? "text-red-600"
                                  : "text-yellow-500"
                              }`}
                              >
                              {candidate.status}
                              </span>
                          </td>
                          <td className="p-2 border">
                              <div className="flex gap-2">
                                <UserModal
                                  type="candidate"
                                  user={candidate}
                                  index={index}
                                  handleApproval={handleApproval}
                                  isAdmin={true}
                                />

                                {/* ✅ Approve / ❌ Reject */}
                                {candidate.status === "pending" && (
                                    <>
                                    <button
                                        title="Approve"
                                        className="text-green-600 hover:text-green-800"
                                        onClick={() => handleApproval("candidate", candidate.wallet, "approved")}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        title="Reject"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleApproval("candidate", candidate.wallet, "rejected")}
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    </>
                                )}
                              </div>
                          </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
                </CardContent>
              )}
            </Card>
            </TabsContent>


        <TabsContent value="voters">
          <Card>
            { voters.length === 0 ? (
              <CardContent className="p-4 text-center">
                <p className="text-gray-500">No voter requests available.</p>
              </CardContent>
            ) : (
              <CardContent className="p-4">
                <table className="w-full table-auto border text-sm">
                      <thead className="bg-gray-100">
                      <tr className="text-left">
                          <th className="p-2 border">Sr No</th>
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">Status</th>
                          <th className="p-2 border">Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      {voters.map((voter, index) => (
                          <tr key={voter.id} className="border-t hover:bg-gray-50">
                          <td className="p-2 border">{index + 1}</td>
                          <td className="p-2 border">{voter.name}</td>
                          <td className="p-2 border capitalize">
                              <span
                              className={`font-medium ${
                                  voter.status === "approved"
                                  ? "text-green-600"
                                  : (voter.status === "rejected"
                                  ? "text-red-600"
                                  : "text-yellow-500")
                              }`}
                              >
                              {voter.status}
                              </span>
                          </td>
                          <td className="p-2 border">
                              <div className="flex gap-2">
                                <UserModal
                                  type="voter"
                                  user={voter}
                                  index={index}
                                  handleApproval={handleApproval}
                                  isAdmin={true}
                                />

                                {/* ✅ Approve / ❌ Reject */}
                                {voter.status === "pending" && (
                                    <>
                                    <button
                                        title="Approve"
                                        className="text-green-600 hover:text-green-800"
                                        onClick={() => handleApproval("voter", voter.wallet, "approved")}
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        title="Reject"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleApproval("voter", voter.wallet, "rejected")}
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    </>
                                )}
                              </div>
                          </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="election">
          <Card className="rounded-2xl shadow-md border border-gray-200">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Set Election Dates</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="start" className="text-sm font-medium text-gray-700">Election Start Date</label>
                  <Input
                    id="start"
                    type="datetime-local"
                    name="start"
                    value={electionDates.start}
                    onChange={handleDateChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="end" className="text-sm font-medium text-gray-700">Election End Date</label>
                  <Input
                    id="end"
                    type="datetime-local"
                    name="end"
                    value={electionDates.end}
                    onChange={handleDateChange}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={saveDates}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Save Election Dates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
