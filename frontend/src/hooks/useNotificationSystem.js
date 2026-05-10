import { useEffect } from 'react';
import { checkReminders } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

export const useNotificationSystem = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Check reminders immediately on load
    checkReminders(user?.name);

    // Then check every minute
    const interval = setInterval(() => {
      checkReminders(user?.name);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [user]);
};
