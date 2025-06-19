"use client";
import { useRouter } from "next/navigation";
import { FaUniversity, FaUserLock, FaUserShield } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full animate-fade-in">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6 tracking-tight">
          Blockchain Voting
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Secure. Transparent. Decentralized.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/voter/login")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            <FaUserLock className="text-lg" />
            Voter Login
          </button>

          <button
            onClick={() => router.push("/institute/login")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            <FaUniversity className="text-lg" />
            Institution/Government Login
          </button>

          <button
            onClick={() => router.push("/superadmin/login")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            <FaUserShield className="text-lg" />
            Super Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
