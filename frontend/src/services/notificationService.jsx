import React from 'react';
import toast from 'react-hot-toast';

const NOTIFICATION_KEY = 'mealmove_notifications';

const getDailyStatus = () => {
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || '{}');
  
  if (stored.date !== today) {
    return {
      date: today,
      waterTaken: false,
      workoutCompleted: false,
      lastWaterReminder: -1, // Hour
      remindersSent: [] // List of IDs like 'breakfast', 'lunch'
    };
  }
  return stored;
};

const saveDailyStatus = (status) => {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(status));
};

export const checkReminders = (userName = 'Shenbagam') => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeStr = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
  const status = getDailyStatus();

  // 💧 Water Reminder (7 AM - 10 PM)
  if (currentHour >= 7 && currentHour <= 22) {
    if (!status.waterTaken && status.lastWaterReminder !== currentHour) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-emerald-500/50 p-4`}>
          <div className="flex-1 w-0 p-1">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 text-2xl">💧</div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white">Hey {userName}!</p>
                <p className="mt-1 text-sm text-slate-400">Drink water now. Stay hydrated and boost your metabolism.</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-slate-800">
            <button
              onClick={() => {
                const newStatus = getDailyStatus();
                newStatus.waterTaken = true;
                saveDailyStatus(newStatus);
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-emerald-500 hover:text-emerald-400 focus:outline-none"
            >
              Done
            </button>
          </div>
        </div>
      ), { duration: 6000 });
      
      status.lastWaterReminder = currentHour;
      saveDailyStatus(status);
    }
  }

  // 🏃 Morning Workout (6:30 AM – 8:00 AM)
  if (currentHour === 6 && currentMinute >= 30 || currentHour === 7) {
    if (!status.workoutCompleted && !status.remindersSent.includes('workout')) {
      toast('🏃 Good morning Shenbagam! Time for your workout. Let’s burn calories today 💪', {
        icon: '🏃',
        duration: 8000,
      });
      status.remindersSent.push('workout');
      saveDailyStatus(status);
    }
  }

  // 🍳 Breakfast (8:00 AM – 9:30 AM)
  if (currentHour === 8 && currentMinute >= 0 && currentHour <= 9) {
    if (!status.remindersSent.includes('breakfast')) {
      toast('🍳 Breakfast time! Don’t skip your healthy start.', { icon: '🍳' });
      status.remindersSent.push('breakfast');
      saveDailyStatus(status);
    }
  }

  // 🍛 Lunch (12:30 PM – 2:00 PM)
  if (currentHour === 12 && currentMinute >= 30 || currentHour === 13) {
    if (!status.remindersSent.includes('lunch')) {
      toast(`🍛 Lunch time ${userName}! Eat balanced and healthy food.`, { icon: '🍛' });
      status.remindersSent.push('lunch');
      saveDailyStatus(status);
    }
  }

  // 🌙 Dinner (7:30 PM – 9:00 PM)
  if (currentHour === 19 && currentMinute >= 30 || currentHour === 20) {
    if (!status.remindersSent.includes('dinner')) {
      toast('🌙 Dinner time! Keep it light and nutritious.', { icon: '🌙' });
      status.remindersSent.push('dinner');
      saveDailyStatus(status);
    }
  }

  // 😴 Sleep Reminder (10:30 PM)
  if (currentHour === 22 && currentMinute >= 30) {
    if (!status.remindersSent.includes('sleep')) {
      toast(`😴 Time to sleep ${userName}! Good sleep improves weight loss and recovery.`, { icon: '😴' });
      status.remindersSent.push('sleep');
      saveDailyStatus(status);
    }
  }
};
