"use client";

import { useEffect, useState } from "react";

export default function CandidateModal({ isOpen, onClose, onSubmit, mode = "add", initialData = {} }) {
  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    instituteAddress: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        slogan: initialData.slogan || "",
        instituteAddress: initialData.instituteAddress || "",
      });
    } else {
      setFormData({ name: "", slogan: "", instituteAddress: "" });
    }
    setError("");
  }, [isOpen, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { name, slogan, instituteAddress } = formData;

    if (!name.trim()) {
      setError("Candidate name is required.");
      return;
    }

    if (!slogan.trim()) {
      setError("Slogan is required.");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(instituteAddress)) {
      setError("Enter a valid Ethereum address.");
      return;
    }

    setError("");
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {mode === "edit" ? "Edit Candidate" : "Add New Candidate"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slogan</label>
            <input
              name="slogan"
              type="text"
              value={formData.slogan}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Institute Wallet Address</label>
            <input
              name="instituteAddress"
              type="text"
              value={formData.instituteAddress}
              onChange={handleChange}
              placeholder="0x..."
              disabled={mode === "edit"}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
