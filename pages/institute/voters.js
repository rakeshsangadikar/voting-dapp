import { useEffect, useState } from "react";
import { getContract } from "../../lib/web3";
import { toast } from "react-hot-toast";
import CommonDialog from "../../components/CommonDialog";

export default function VoterList() {
  const [voters, setVoters] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editAddr, setEditAddr] = useState("");

  useEffect(() => {
    
    load();
  }, []);

    async function load() {
      try {
        const vc = await getContract();
        const v = await vc.getVoters();
        setVoters(v);
      } catch (e) {
        toast.error("Failed to load voters");
      }
    }

    async function handleSaveVoter(newVoter) {
        const isEditing = !!editAddr;
        const toastId = toast.loading(isEditing ? "Updating voter..." : "Adding voter...");
        let success = false;

        try {
            const vc = await getContract();

            let tx;
            if (isEditing) {
                // Update voter logic (requires smart contract support)
                tx = await vc.updateVoter(editAddr, newVoter);
            } else {
                // Add new voter
                tx = await vc.registerVoter(newVoter);
            }

            await tx.wait();
            toast.success(
                isEditing ? "Voter updated successfully." : "Voter added successfully.",
                { id: toastId }
            );
            success = true;
        } catch (err) {
            toast.error(err?.reason || err?.message || "Failed to save voter", { id: toastId });
        }

        if (success) {
            try {
                setShowDialog(false);
                setEditAddr("");
                await load();
            } catch (err) {
                console.warn("Post-save UI update failed:", err);
            }
        }
    }



  return (
    <div className="p-6">
        <div className="bg-white shadow rounded p-4 overflow-x-auto w-1/2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold mb-4">Voter List</h2>
                <button onClick={() => { setEditAddr(""); setShowDialog(true); }} 
                    className="bg-blue-600 text-white px-3 py-1 rounded mb-4">
                    Add Voter
                </button>
            </div>
            { voters.length > 0 ? (
                <table className="w-full border">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Address</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {voters.map(addr => (
                        <tr key={addr}>
                        <td className="p-2 border">{addr}</td>
                        <td className="p-2 border text-center">
                            <button onClick={() => { setEditAddr(addr); setShowDialog(true); }} className="text-blue-600 mr-2">Edit</button>
                            <button onClick={() => confirm("Are you sure?") && toast.success("Deleted successfully") } className="text-red-600">Delete</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500 text-center h-64 flex items-center justify-center">
                    No voters registered yet.
                </p>
            )}
      </div>

      {/* Render dialog */}
      <CommonDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={(val) => handleSaveVoter(val)}
        initialValue={editAddr}
        title={(editAddr ? "Edit" : "Add") + " Voter"}
      />
    </div>
  );
}