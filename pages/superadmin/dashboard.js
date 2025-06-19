import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getReadOnlyContract } from "../../lib/web3";
import AdminTableView from "../../components/Common/AdminTableView";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("institutes");
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "superadmin") {
      router.push("/superadmin/login");
    }
    localStorage.setItem("userRole", "superadmin");
    window.dispatchEvent(new Event("userRoleChange"));
  }, [router]);

  // 🔁 Dynamic props for AdminTableView
  const tabConfigs = {
    institutes: {
      title: "Manage Institutes",
      columnsDef: [
        { Header: "ID", accessor: "id" },
        { Header: "Name", accessor: "name" },
        { Header: "Wallet Address", accessor: "address" },
      ],
      fetchData: async () => {
        const contract = await getReadOnlyContract();
        const count = (await contract.getInstituteCount()).toNumber();
        const items = [];
        for (let i = 0; i < count; i++) {
          const inst = await contract.institutes(i);
          items.push({ id: i + 1, name: inst.name, address: inst.addr });
        }
        return items;
      },
      modalType: "institute",
    },

    candidates: {
      title: "Manage Candidates",
      columnsDef: [
        { Header: "ID", accessor: "id" },
        { Header: "Name", accessor: "name" },
        { Header: "Slogan", accessor: "slogan" },
        { Header: "Institute", accessor: "institute" },
      ],
      fetchData: async () => {
        const contract = await getReadOnlyContract();
        const count = (await contract.getCandidateCount()).toNumber();
        const items = [];
        for (let i = 0; i < count; i++) {
          const c = await contract.getCandidates(i);
          items.push({
            id: i + 1,
            name: c.name,
            slogan: c.slogan,
            institute: c.institute,
          });
        }
        return items;
      },
      modalType: "candidate",
    },

    voters: {
      title: "Manage Voters",
      columnsDef: [
        { Header: "ID", accessor: "id" },
        { Header: "Wallet Address", accessor: "address" },
        { Header: "Institute", accessor: "institute" },
        { Header: "Has Voted", accessor: "hasVoted" },
      ],
      fetchData: async () => {
        const contract = await getReadOnlyContract();
        const count = (await contract.getVoterCount()).toNumber();
        const items = [];
        for (let i = 0; i < count; i++) {
          const v = await contract.getVoters(i);
          items.push({
            id: i + 1,
            address: v.addr,
            institute: v.institute,
            hasVoted: v.hasVoted ? "Yes" : "No",
          });
        }
        return items;
      },
      modalType: "voter",
    },
  };

  const currentTab = tabConfigs[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">
        Super Admin Dashboard
      </h1>

      {/* Tab Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {Object.entries(tabConfigs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`p-6 rounded-xl shadow-md text-center border font-semibold transition ${
              activeTab === key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
            }`}
          >
            <h2 className="text-lg">{config.title}</h2>
            <p className={`text-sm mt-2 ${activeTab === key ? "text-white" : "text-blue-600"}`}>
              View, update, and manage {key}
            </p>
          </button>
        ))}
      </div>

      {/* Dynamic Table View */}
      <AdminTableView
        title={currentTab.title}
        fetchData={currentTab.fetchData}
        columnsDef={currentTab.columnsDef}
        modalType={currentTab.modalType}
      />
    </div>
  );
}
