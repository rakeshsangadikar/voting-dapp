import { useWalletManager } from '../../utils/walletManager';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ClipboardList,
  UserCheck,
  Vote,
  Settings,
} from 'lucide-react';

const MenuItem = ({ label, icon: Icon, viewKey, onNavigate, active }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => onNavigate(viewKey)}
    className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-blue-500 text-white font-semibold shadow'
        : 'hover:bg-blue-200 text-gray-800'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </motion.button>
);

export default function Sidebar({ onNavigate, activeView }) {
  const { isAdmin } = useWalletManager();

  return (
    <div className="bg-blue-100 h-full w-full shadow-md p-4 space-y-2 rounded-r-lg">
      <MenuItem
        label="Dashboard"
        viewKey="dashboard"
        onNavigate={onNavigate}
        active={activeView === 'dashboard'}
        icon={LayoutDashboard}
      />
      <MenuItem
        label="Register Voter"
        viewKey="register-voter"
        onNavigate={onNavigate}
        active={activeView === 'register-voter'}
        icon={UserPlus}
      />
      <MenuItem
        label="Register Candidate"
        viewKey="register-candidate"
        onNavigate={onNavigate}
        active={activeView === 'register-candidate'}
        icon={UserCheck}
      />
      <MenuItem
        label="Voter List"
        viewKey="voter-list"
        onNavigate={onNavigate}
        active={activeView === 'voter-list'}
        icon={ClipboardList}
      />
      <MenuItem
        label="Candidate List"
        viewKey="candidate-list"
        onNavigate={onNavigate}
        active={activeView === 'candidate-list'}
        icon={Users}
      />
      <MenuItem
        label="Cast Your Vote"
        viewKey="vote"
        onNavigate={onNavigate}
        active={activeView === 'vote'}
        icon={Vote}
      />
      {isAdmin && (
        <MenuItem
          label="System Settings"
          viewKey="system-setting"
          onNavigate={onNavigate}
          active={activeView === 'system-setting'}
          icon={Settings}
        />
      )}
    </div>
  );
}
