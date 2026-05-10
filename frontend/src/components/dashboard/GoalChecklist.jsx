import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const GoalChecklist = ({ compact = false }) => {
  const [goals, setGoals] = useState({ workout: false, water: false, sleep: false, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/api/goals/today');
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = async (task) => {
    try {
      const currentStatus = goals[task];
      const res = await api.post('/api/goals/update', { task, status: !currentStatus });
      setGoals(res.data);
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  if (loading && !compact) return <div className="animate-pulse h-40 bg-white/5 rounded-3xl" />;
  if (loading && compact) return <div className="animate-pulse h-20 bg-white/5 rounded-2xl" />;

  const tasks = [
    { id: 'workout', label: 'Workout Completed', compactLabel: 'Workout', icon: '🏋️‍♂️' },
    { id: 'water', label: 'Water Goal Completed', compactLabel: 'Water', icon: '💧' },
    { id: 'sleep', label: 'Sleep Goal Completed', compactLabel: 'Sleep', icon: '😴' },
  ];

  const allCompleted = goals.percentage === 100;

  if (compact) {
    return (
      <div className="rounded-2xl glass-card p-4 teal-border-gradient group hover:teal-glow-hover transition-all duration-300">
        <h3 className="text-sm font-black text-teal-400 uppercase tracking-widest mb-3">Today's Goals</h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => toggleGoal(task.id)}
              className="flex items-center justify-between cursor-pointer group/item"
            >
              <div className="flex items-center gap-2">
                <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${goals[task.id] ? 'bg-teal-500 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'border-white/20 bg-white/5'}`}>
                  {goals[task.id] && <span className="text-[10px] text-white">✔</span>}
                </div>
                <span className={`text-xs font-bold ${goals[task.id] ? 'text-white' : 'text-slate-400 group-hover/item:text-slate-200'}`}>{task.compactLabel}</span>
              </div>
              <span className="text-xs">{task.icon}</span>
            </div>
          ))}
        </div>
        {allCompleted && (
          <p className="mt-3 text-[10px] font-black text-emerald-400 animate-bounce text-center">🎉 All Goals Done!</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass-card p-8 teal-border-gradient relative overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center shadow-lg shadow-teal-500/10">✅</span>
          Today's Goal Completion
        </h3>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-teal-400">{goals.percentage}%</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => toggleGoal(task.id)}
            className={`
              p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center gap-3 group
              ${goals[task.id] 
                ? 'bg-teal-500/10 border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.1)]' 
                : 'bg-white/5 border-white/10 hover:border-teal-500/30'
              }
            `}
          >
            <div className="flex justify-between w-full items-start">
              <span className="text-2xl group-hover:scale-110 transition-transform">{task.icon}</span>
              <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${goals[task.id] ? 'bg-teal-500 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]' : 'border-white/20 bg-white/5'}`}>
                {goals[task.id] && <span className="text-xs text-white">✔</span>}
              </div>
            </div>
            <span className={`text-sm font-bold text-center ${goals[task.id] ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
              {goals[task.id] ? task.label.replace('Pending', 'Completed') : task.label.replace('Completed', 'Pending')}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(20,184,166,0.5)]"
          style={{ width: `${goals.percentage}%` }}
        />
      </div>

      {allCompleted && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center animate-in slide-in-from-top-4 duration-500">
          <p className="text-emerald-400 font-black text-lg">🎉 Daily Goals Completed! You're crushing it!</p>
        </div>
      )}

      {/* Background glow */}
      <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-teal-500/5 blur-3xl rounded-full" />
    </div>
  );
};

export default GoalChecklist;
