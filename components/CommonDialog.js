import { Dialog } from "@headlessui/react";
import { useState } from "react";

export default function CommonDialog({ isOpen, onClose, onSave, initialValue = "", title = "" }) {
  const [value, setValue] = useState(initialValue);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white p-6 rounded shadow z-20 w-80">
        <Dialog.Title className="text-lg font-bold mb-2">{title}</Dialog.Title>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="border w-full p-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-300" onClick={onClose}>Cancel</button>
          <button
            className="px-3 py-1 bg-blue-600 text-white"
            onClick={() => {
              onSave(value);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
}