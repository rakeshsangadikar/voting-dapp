import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaHome,
  FaUserLock,
  FaUniversity,
  FaTachometerAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const updateRole = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    };

    updateRole();
    window.addEventListener('userRoleChange', updateRole);
    return () => window.removeEventListener('userRoleChange', updateRole);
  }, []);

  const handleLogout = () => {
    const role = localStorage.getItem('userRole');
    localStorage.removeItem('userRole');
    setUserRole(null);
    router.push(`${role}/login`);
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 500,
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#2563EB', // Tailwind blue-600
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  };

  return (
    <nav style={navStyle}>
      {/* Left Links */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {!userRole ? (
          <Link href="/" style={linkStyle}>
            <FaHome /> Home
          </Link>
        ) : (
          <Link href={`/${userRole}/dashboard`} style={linkStyle}>
            <FaTachometerAlt /> Dashboard
          </Link>
        )}
      </div>

      {/* Center Heading */}
      <h1
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        Voting Application
      </h1>

      {/* Right Section */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
        { userRole &&
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        }
      </div>
    </nav>
  );
}
