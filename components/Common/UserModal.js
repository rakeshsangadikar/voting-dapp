import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function UserModal({
  user,
  index,
  type,
  handleApproval,
  isAdmin = false,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-800"
        title="View"
      >
        <Eye className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              {type === "candidate" ? "Candidate Details" : "Voter Details"}
            </h2>

            <div className="space-y-3 text-sm">
              {user?.photoUrl && (
                <div className="flex justify-center">
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-24 h-24 rounded-full"
                  />
                </div>
              )}
              <p className="text-center font-medium">{user.name}</p>
              <p>
                <strong>ID:</strong> #{index + 1}
              </p>
              <p>
                <strong>Wallet:</strong> {user.wallet}
              </p>
              {user?.slogan && (
                <p>
                  <strong>Slogan:</strong> {user.slogan}
                </p>
              )}
              <p>
                <strong>Status:</strong><p className={`text-sm font-semibold ${user.status === "approved"
                ? "text-green-600" : (user.status === 'rejected' ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700') }`}> {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </p>
              </p>
              {user?.docUrl && (
                <p>
                  <strong>Document:</strong>{" "}
                  <a
                    href={user.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Document
                  </a>
                </p>
              )}
            </div>

            <div className="mt-5 flex gap-2 justify-center">
              {isAdmin && user?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleApproval(type, user.wallet, "approved");
                      setOpen(false);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleApproval(type, user.wallet, "rejected");
                      setOpen(false);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
