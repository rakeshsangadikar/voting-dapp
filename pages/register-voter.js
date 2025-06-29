import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadToPinata } from './api/uploadToPinata';
import { useWalletClientSafe } from '../hooks/useWalletClientSafe';
import { getWriteContract } from '@/lib/contract';

export default function RegisterVoter() {
  const [formData, setFormData] = useState({
    name: '',
    wallet: '',
    document: null,
  });

  const [errors, setErrors] = useState({});
  const walletClient = useWalletClientSafe();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    const { name, wallet, document } = formData;

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!wallet.trim()) newErrors.wallet = 'Wallet address is required.';
    else if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) newErrors.wallet = 'Invalid Ethereum address.';

    if (!document) newErrors.document = 'Document is required.';
    else if (
      ![
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(document.type)
    ) {
      newErrors.document = 'Document must be PDF or DOC.';
    } else if (document.size > 5 * 1024 * 1024) {
      newErrors.document = 'Document must be under 5MB.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        const docUrl = await uploadToPinata(formData.document);

        const contract = getWriteContract(walletClient);
        const tx = await contract.write.registerVoter([
          formData.wallet,
          formData.name,
          docUrl,
        ]);
        await tx.wait();

        setFormData({
          name: '',
          wallet: '',
          document: null,
        });
        setErrors({});
        resolve('Voter registered successfully!');
      } catch (error) {
        console.error(error);
        reject('Registration failed.');
      }
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading document...',
      success: (msg) => msg,
      error: (err) => err,
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Register as Voter
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500' : 'focus:ring-blue-500'
            }`}
            placeholder="Alice Johnson"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
          <input
            type="text"
            name="wallet"
            value={formData.wallet}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.wallet ? 'border-red-500' : 'focus:ring-blue-500'
            }`}
            placeholder="0x1234...abcd"
          />
          {errors.wallet && <p className="text-red-500 text-sm mt-1">{errors.wallet}</p>}
        </div>

        {/* Supporting Document */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting Document
          </label>
          <div
            className={`relative flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
              errors.document ? 'border-red-500' : ''
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              name="document"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {formData.document ? (
              <>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, document: null })}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 rounded-full hover:bg-red-600"
                  title="Remove file"
                >
                  ✕
                </button>

                {formData.document.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(formData.document)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 mb-1 text-blue-500" />
                    <span className="text-sm text-gray-700 text-center mt-1">
                      {formData.document.name}
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 mb-1 text-blue-500" />
                <span className="text-sm text-gray-600">Choose file (PDF, DOC, Image)</span>
              </>
            )}
          </div>
          {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document}</p>}
        </div>


        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
