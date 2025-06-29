import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


const mockCandidates = [
  {
    id: 1,
    name: 'John Doe',
    status: 'pending',
    wallet: '0xAbC1234567890DefABC1234567890DefABC12345',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    status: 'pending',
    wallet: '0xDeF9876543210AbcDEF9876543210AbcDEF98765',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];


const mockVoters = [
  { id: 3, name: 'Alice', status: 'pending' },
  { id: 4, name: 'Bob', status: 'pending' },
];

export default function SystemSettings() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [voters, setVoters] = useState(mockVoters);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedVoter, setSelectedVoter] = useState(null);

  const [electionDates, setElectionDates] = useState({
    start: '2025-06-28T00:00:00',
    end: '2025-06-28T11:59:59',
  });

  const handleApproval = (type, id, action) => {
    const list = type === 'candidate' ? [...candidates] : [...voters];
    const updated = list.map(user =>
      user.id === id ? { ...user, status: action } : user
    );
    type === 'candidate' ? setCandidates(updated) : setVoters(updated);
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
                            {/* 👁️ Eye Dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        onClick={() => setSelectedCandidate(candidate)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="View"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md w-full px-6 py-4 box-border">
                                <DialogHeader className="text-left">
                                    <DialogTitle className="text-xl font-semibold">Candidate Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 text-left">
                                    <div className="flex justify-center">
                                        <img
                                            src={selectedCandidate?.photo}
                                            alt={selectedCandidate?.name}
                                            className="w-24 h-24 rounded-full"
                                        />
                                        
                                    </div>
                                    <p className='text-center'><strong>{selectedCandidate?.name}</strong></p>
                                    <p><strong>ID:</strong> #{selectedCandidate?.id}</p>
                                    <p><strong>Wallet:</strong>{selectedCandidate?.wallet}</p>
                                    
                                    <p><strong>Status:</strong> {selectedCandidate?.status}</p>
                                </div>
                                <DialogFooter className="mt-4 flex justify-start">
                                    {selectedCandidate?.status === "pending" ? (
                                    <>
                                        <Button
                                        variant="success"
                                        onClick={() =>
                                            handleApproval("candidate", selectedCandidate.id, "approved")
                                        }
                                        >
                                        Approve
                                        </Button>
                                        <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleApproval("candidate", selectedCandidate.id, "rejected")
                                        }
                                        >
                                        Reject
                                        </Button>
                                    </>
                                    ) : (
                                    <span
                                        className={`text-sm font-semibold ${
                                        selectedCandidate?.status === "approved"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                    >
                                        {selectedCandidate?.status.charAt(0).toUpperCase() +
                                        selectedCandidate?.status.slice(1)}
                                    </span>
                                    )}
                                </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* ✅ Approve / ❌ Reject */}
                            {candidate.status === "pending" && (
                                <>
                                <button
                                    title="Approve"
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => handleApproval("candidate", candidate.id, "approved")}
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <button
                                    title="Reject"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleApproval("candidate", candidate.id, "rejected")}
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
            </Card>
            </TabsContent>


        <TabsContent value="voters">
          <Card>
            <CardContent className="p-4 space-y-3">
              {voters.map(voter => (
                <div key={voter.id} className="flex justify-between items-center border p-3 rounded-lg shadow">
                    <div>
                    <strong>{voter.name}</strong>
                    </div>
                    <div className="space-x-2">
                    {voter.status === 'pending' ? (
                        <>
                        <Button
                            variant="success"
                            onClick={() => handleApproval('voter', voter.id, 'approved')}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleApproval('voter', voter.id, 'rejected')}
                        >
                            Reject
                        </Button>
                        </>
                    ) : (
                        <span
                        className={`text-sm font-semibold ${
                            voter.status === 'approved' ? 'text-green-600' : 'text-red-600'
                        }`}
                        >
                        {voter.status.charAt(0).toUpperCase() + voter.status.slice(1)}
                        </span>
                    )}
                    </div>
                </div>
                ))}

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="election">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block mb-1">Election Start Date</label>
                <Input type="datetime-local" name="start" value={electionDates.start} onChange={handleDateChange} />
              </div>
              <div>
                <label className="block mb-1">Election End Date</label>
                <Input type="datetime-local" name="end" value={electionDates.end} onChange={handleDateChange} />
              </div>
              <Button onClick={saveDates}>Save Election Dates</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
