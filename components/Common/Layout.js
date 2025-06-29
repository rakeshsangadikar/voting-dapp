import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children, onNavigate, activeView }) {
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 shadow bg-white">
        <Navbar />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <div className="sticky top-[64px] h-[calc(100vh-64px)] z-40 w-64 bg-white border-r shadow overflow-y-auto">
          <Sidebar onNavigate={onNavigate} activeView={activeView} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
