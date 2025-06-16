import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-8">Blockchain Voting</h1>

        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/voter/login">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-800 transition">
              Voter Login
            </button>
          </Link>

          <Link href="/institute/login">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-800 transition">
              Institute Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
