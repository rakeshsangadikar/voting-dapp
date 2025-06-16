import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaSignInAlt, FaUniversity, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const updateRole = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    };

    // Initial check
    updateRole();

    // Listen for custom login/logout events
    window.addEventListener('userRoleChange', updateRole);
    return () => window.removeEventListener('userRoleChange', updateRole);
  }, []);

  const handleLogout = () => {
    const role = localStorage.getItem('userRole');
    localStorage.removeItem('userRole');
    setUserRole(null);
    router.push('voter' == role ? '/voter/login' : '/institute/login'); // Redirect to home or login page
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#f5f5f5',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }}>
      {/* Left Links */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {
            !userRole ? (
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaHome /> Home
              </Link>
            ) : <Link href={`/${userRole}/dashboard`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaTachometerAlt /> Dashboard
                </Link>
        }
      </div>

      {/* Center Heading */}
      <h1 style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '1.5rem',
        fontWeight: 'bold',
      }}>
        Voting DApp
      </h1>

      {/* Right Section */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
        {!userRole ? (
          <>
            <Link href="../voter/login" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaSignInAlt /> Voter Login
            </Link>
            <Link href="../institute/login" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaUniversity /> Institute Login
            </Link>
          </>
        ) : (
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
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}
