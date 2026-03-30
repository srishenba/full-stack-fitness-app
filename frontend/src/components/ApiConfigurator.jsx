import { useLayoutEffect } from 'react';
import { setApiHooks } from '../services/api';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';

/**
 * Connects axios interceptors to auth + global loading (must run before async API calls in effects).
 */
export default function ApiConfigurator() {
  const { begin, end } = useLoading();
  const { logout } = useAuth();

  useLayoutEffect(() => {
    setApiHooks({
      getToken: () => localStorage.getItem('token'),
      onUnauthorized: () => logout(),
      beginLoading: begin,
      endLoading: end,
    });
  }, [begin, end, logout]);

  return null;
}
