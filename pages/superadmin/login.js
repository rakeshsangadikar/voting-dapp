import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getReadOnlyContract } from "../../lib/web3";

export default function SuperAdminLogin() {
  const [wallet, setWallet] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      toast.error("Invalid Ethereum wallet address");
      return;
    }

    try {
      const contract = await getReadOnlyContract();
      const isAdmin = await contract.isSuperAdmin(wallet);

      if (!isAdmin) {
        toast.error("Unauthorized: This wallet is not a super admin.");
        return;
      }

      toast.success("Super Admin Login Successful");
      localStorage.setItem("userRole", "superadmin");
      router.push("/superadmin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong while validating address.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 shadow-2xl rounded-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-4">Super Admin Login</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your Ethereum wallet address to verify your Super Admin access.
        </p>
        <form onSubmit={handleLogin}>
          <label className="block text-gray-700 mb-2 font-medium">Wallet Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
