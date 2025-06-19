import { useEffect, useState } from "react";
import { getContract } from "../../lib/web3";
import { toast } from "react-hot-toast";
import CommonDialog from "../../components/Common/CommonDialog";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editCand, setEditCand] = useState("");

    useEffect(() => {
      load();
    }, []);

    async function load() {
        try {
            const vc = await getContract();
            const c = await vc.getCandidates();
            setCandidates(c);
        } catch (e) {
            toast.error("Failed to load candidates");
        }
    }

    async function handleSaveCandidate(newCandidate) {
        const isEditing = !!editCand;
        const toastId = toast.loading(isEditing ? "Updating candidate..." : "Adding candidate...");
        let success = false;

        try {
            const vc = await getContract();
            let tx;
            if (isEditing) {
                // Update candidate
                tx = await vc.updateCandidate(editCand, newCandidate);
            } else {
                // Add candidate
                tx = await vc.addCandidate(newCandidate);
            }

            await tx.wait();

            toast.success(
                isEditing ? "Candidate updated successfully." : "Candidate added successfully.",
                { id: toastId }
            );
            success = true;
        } catch (err) {
            toast.error(err?.reason || err?.message || "Operation failed", { id: toastId });
        }

        if (success) {
            try {
                setEditCand("");
                setShowDialog(false);
                await load(); // Reload updated data
            } catch (err) {
                console.warn("Non-critical error after save:", err);
            }
        }
    }

  return (
    <div className="p-6">
        
        <div className="bg-white shadow rounded p-4 overflow-x-auto w-1/2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold mb-4">Candidate List</h1>
                <button onClick={() => { setEditCand(""); setShowDialog(true); }} 
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mb-4">
                    Add Candidate
                </button>
            </div>
            { candidates.length > 0 ? (
                <table className="w-full border mb-4">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Candidate</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidates.map(c => (
                        <tr key={c}>
                        <td className="p-2 border">{c}</td>
                        <td className="p-2 border text-center">
                            <button onClick={() => { setEditCand(c); setShowDialog(true); }} 
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2">Edit</button>
                            <button onClick={() => confirm("Are you sure?") && toast.success("Deleted successfully") } 
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500 text-center h-64 flex items-center justify-center">
                    No candidates available yet.
                </p>
            )}
        </div>

      {/* Render dialog */}
      <CommonDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={(val) => handleSaveCandidate(val)}
        initialValue={editCand}
        title={(editCand ? "Edit" : "Add") + " Candidate"}
      />
    </div>
  );
}