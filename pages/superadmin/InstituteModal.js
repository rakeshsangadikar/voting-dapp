import { useEffect, useState } from "react";

export default function InstituteModal({ isOpen, onClose, onSubmit, mode = "add", initialData = {} }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setAddress(initialData.address || "");
    } else {
      setName("");
      setAddress("");
    }
    setError("");
  }, [isOpen, mode, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Institute name is required.");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Enter a valid Ethereum address.");
      return;
    }

    setError("");
    onSubmit({ name, address });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {mode === "edit" ? "Edit Institute" : "Add New Institute"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Institute Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={mode === "edit"} // lock address if editing
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {mode === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
