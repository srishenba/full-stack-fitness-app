import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0);

  const begin = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const end = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  const value = useMemo(
    () => ({
      active: count > 0,
      begin,
      end,
    }),
    [count, begin, end]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return ctx;
}
