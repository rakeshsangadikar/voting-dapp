import { useState } from "react";
import { useRouter } from "next/router";
export default function VoterLogin() {
  const [pwd, setPwd] = useState("");
  const r = useRouter();
  const login = async e => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ role: "institute", password: pwd }),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) r.push("/institute/dashboard");
    else alert("Invalid");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={login} className="bg-white p-6 rounded shadow">
        <h1 className="text-primary mb-4 text-xl">Institute Login</h1>
        <input
          type="password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder="Password"
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-primary text-white p-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}
