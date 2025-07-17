import { useState } from "react";
import Head from 'next/head';
import Layout from "../components/Common/Layout";
import Dashboard from "./dashboard";
import CandidatesPage from "./candidate-list";
import SystemSettings from "./system-setting";
import RegisterCandidate from "./register-candidate";
import RegisterVoter from "./register-voter";
import VoterList from "./voter-list";
import VotePage from "./vote";

export default function Home() {
  const [view, setView] = useState("dashboard");

  const renderContent = () => {
    switch (view) {
      case "candidate-list":
        return <CandidatesPage />;
      case "voter-list":
        return <VoterList />;
      case "register-candidate":
        return <RegisterCandidate />;
      case "register-voter":
        return <RegisterVoter />;
      case "vote":
        return <VotePage />;
      case "system-setting":
        return <SystemSettings />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Head>
        <title>Voting App</title>
        <meta name="description" content="Decentralized Blockchain Voting System" />
        <link rel="icon" href="./favicon.ico" />
      </Head>

      {/* Page content */}
      <Layout onNavigate={setView} activeView={view}>
        {renderContent()}
      </Layout>
    </>
  );
}
