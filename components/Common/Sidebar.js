import { useContext } from 'react';
import { WalletContext } from '../../context/WalletContext';

const MenuItem = ({ label, viewKey, onNavigate, active }) => (
  <button
    onClick={() => onNavigate(viewKey)}
    className={`w-full text-left px-4 py-2 rounded hover:bg-blue-200 transition-all ${
      active ? 'bg-blue-500 text-white font-semibold' : ''
    }`}
  >
    {label}
  </button>
);

export default function Sidebar({ onNavigate, activeView }) {
  const { isAdmin } = useContext(WalletContext);

  return (
    <div className="bg-blue-100 h-full w-full shadow-md p-4 space-y-2">
      <MenuItem
        label="📊 Dashboard"
        viewKey="dashboard"
        onNavigate={onNavigate}
        active={activeView === 'dashboard'}
      />
      <MenuItem
        label="📝 Register Voter"
        viewKey="register-voter"
        onNavigate={onNavigate}
        active={activeView === 'register-voter'}
      />
      <MenuItem
        label="🧑 Register Candidate"
        viewKey="register-candidate"
        onNavigate={onNavigate}
        active={activeView === 'register-candidate'}
      />
      <MenuItem
        label="📋 Voter List"
        viewKey="voter-list"
        onNavigate={onNavigate}
        active={activeView === 'voter-list'}
      />
      <MenuItem
        label="👥 Candidate List"
        viewKey="candidate-list"
        onNavigate={onNavigate}
        active={activeView === 'candidate-list'}
      />
      <MenuItem
        label="Cast Your Vote"
        viewKey="vote"
        onNavigate={onNavigate}
        active={activeView === 'vote'}
      />
      {isAdmin && (
        <MenuItem
          label="⚙️ System Setting"
          viewKey="system-setting"
          onNavigate={onNavigate}
          active={activeView === 'system-setting'}
        />
      )}
    </div>
  );
}
