import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadToPinata } from './api/uploadToPinata';
import { useWalletClientSafe } from "../hooks/useWalletClientSafe";
import { getWriteContract } from '@/lib/contract';

export default function RegisterCandidate() {
  const [formData, setFormData] = useState({
    name: '',
    slogan: '',
    wallet: '',
    photo: null,
    document: null,
  });

  const [errors, setErrors] = useState({});
  const walletClient = useWalletClientSafe();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    const { name, slogan, wallet, photo, document } = formData;

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!slogan.trim()) newErrors.slogan = 'Slogan is required.';
    if (!wallet.trim()) newErrors.wallet = 'Wallet address is required.';
    else if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) newErrors.wallet = 'Invalid Ethereum address.';

    if (!photo) newErrors.photo = 'Photo is required.';
    else if (!photo.type.startsWith('image/')) newErrors.photo = 'Photo must be an image file.';
    else if (photo.size > 2 * 1024 * 1024) newErrors.photo = 'Photo must be under 2MB.';

    if (!document) newErrors.document = 'Document is required.';
    else if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(document.type)) {
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
        const photoUrl = await uploadToPinata(formData.photo);
        const docUrl = await uploadToPinata(formData.document);

        const contract = getWriteContract(walletClient);
        const tx = await contract.write.registerCandidate([
          formData.wallet,
          formData.name,
          formData.slogan,
          photoUrl,
          docUrl
        ]);
        setFormData({
          name: '',
          slogan: '',
          wallet: '',
          photo: null,
          document: null,
        });
        setErrors({});
        resolve("Candidate registered successfully!");
      } catch (error) {
        console.error(error);
        reject("Upload or registration failed.");
      }
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading files to IPFS...',
      success: (msg) => msg,
      error: (err) => err,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register as Candidate</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500' : 'focus:ring-blue-500'}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Slogan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
          <input
            type="text"
            name="slogan"
            value={formData.slogan}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.slogan ? 'border-red-500' : 'focus:ring-blue-500'}`}
            placeholder="For a better tomorrow"
          />
          {errors.slogan && <p className="text-red-500 text-sm mt-1">{errors.slogan}</p>}
        </div>

        {/* Wallet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
          <input
            type="text"
            name="wallet"
            value={formData.wallet}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.wallet ? 'border-red-500' : 'focus:ring-blue-500'}`}
            placeholder="0xAbC123..."
          />
          {errors.wallet && <p className="text-red-500 text-sm mt-1">{errors.wallet}</p>}
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <UploadCloud className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-sm text-gray-600">Choose photo</span>
            <input
              type="file"
              accept="image/*"
              name="photo"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          {formData.photo && (
            <img
              src={URL.createObjectURL(formData.photo)}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
          {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
        </div>

        {/* Document */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Document</label>
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <UploadCloud className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-sm text-gray-600">Choose document (PDF or DOC)</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              name="document"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          {formData.document && (
            <p className="mt-2 text-sm text-gray-500">{formData.document.name}</p>
          )}
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
