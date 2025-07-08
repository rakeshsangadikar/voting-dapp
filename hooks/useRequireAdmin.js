// hooks/useRequireAdmin.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWalletManager } from '../utils/walletManager'; // adjust path if needed

/**
 * Redirects the user to `/dashboard` if not an admin.
 */
export function useRequireAdmin(redirectTo = '/dashboard') {
  const router = useRouter();
  const { isAdmin, walletReady } = useWalletManager();

  useEffect(() => {
    if (walletReady && !isAdmin) {
      router.replace(redirectTo);
    }
  }, [walletReady, isAdmin, router, redirectTo]);
}
