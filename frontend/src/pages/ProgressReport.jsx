import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Flame, 
  Footprints, 
  Droplets, 
  Trophy, 
  Download, 
  ChevronRight, 
  Clock, 
  Target, 
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Loader from '../components/ui/Loader';
import './ProgressReport.css';

const ProgressReport = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [userRes, historyRes, progressRes, mealRes] = await Promise.all([
        api.get('/api/user/profile'),
        api.get('/api/ai/history'),
        api.get('/api/user/progress'),
        api.get('/api/user/meals/today')
      ]);

      setUserData(userRes.data);
      setHistory(historyRes.data);
      setProgress(progressRes.data);
      setMeals(mealRes.data);
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // In a real app, this would generate a PDF or CSV
    // For now, we'll simulate it
    const reportData = {
      user: userData?.name,
      history: history.map(h => ({ date: h.date, score: h.fitnessScore })),
      totalSteps: history.reduce((sum, h) => sum + (h.steps || 0), 0),
      totalCalories: history.reduce((sum, h) => sum + (h.caloriesBurned || 0), 0)
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MealMove_Progress_Report_${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;

  // Calculate some derived metrics
  const totalCaloriesBurned = history.reduce((sum, h) => sum + (h.caloriesBurned || 0), 0);
  const totalSteps = history.reduce((sum, h) => sum + (h.steps || 0), 0);
  const workoutsCompleted = history.filter(h => h.workoutDone).length;
  
  const weeklyProgress = 12.5; // Simulated growth
  const goalCompletion = progress?.goalCompletion || 75;
  const activityImprovement = 18;

  const weightProgress = userData?.targetWeight ? 
    Math.round(((userData.weight - userData.targetWeight) / (userData.weight)) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userData={userData} />
        
        <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          {/* Header & Export */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-black tracking-tight text-white mb-2">Progress Analytics</h1>
              <p className="text-slate-400 font-medium">Deep dive into your fitness journey and AI-driven insights.</p>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="export-btn flex items-center gap-2"
            >
              <Download size={20} /> Download Report
            </motion.button>
          </div>

          {/* 1. TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Calories Burned', value: `${totalCaloriesBurned.toLocaleString()} kcal`, icon: <Flame className="text-orange-500" />, color: 'orange' },
              { label: 'Total Steps', value: totalSteps.toLocaleString(), icon: <Footprints className="text-emerald-500" />, color: 'emerald' },
              { label: 'Water Goal Completion', value: '92%', icon: <Droplets className="text-blue-500" />, color: 'blue' },
              { label: 'Workouts Completed', value: workoutsCompleted, icon: <Zap className="text-yellow-500" />, color: 'yellow' }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-${card.color}-500/10 border border-${card.color}-500/20 group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lifetime</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">{card.label}</p>
                <h3 className="text-3xl font-black text-white">{card.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 2. AI FITNESS SCORE HISTORY */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass-panel"
            >
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <TrendingUp size={24} className="text-teal-400" />
                AI Score History
              </h3>
              <div className="space-y-4">
                {history.length > 0 ? history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center font-black text-teal-400">
                        {item.fitnessScore}%
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Analysis Report</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-600" />
                  </div>
                )) : (
                  <p className="text-slate-500 text-sm italic text-center py-10">No scores recorded yet.</p>
                )}
              </div>
            </motion.div>

            {/* 3. DAILY STEPS CHART */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-panel"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Footprints size={24} className="text-emerald-400" />
                  Daily Steps Progress
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Weekly View</span>
                </div>
              </div>

              <div className="chart-container">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const steps = [4500, 6200, 8300, 7000, 5800, 9200, 7500][i];
                  const height = (steps / 10000) * 100;
                  return (
                    <div key={i} className="chart-bar-wrapper">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="chart-bar group/bar"
                        style={{ color: '#10b981' }}
                      >
                        <div className="chart-tooltip">{steps.toLocaleString()} steps</div>
                      </motion.div>
                      <span className="chart-label">{day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="insight-box">
                <p className="text-sm font-bold text-slate-200">
                  <span className="text-emerald-400">💡 AI Insight:</span> Your step count improved by {activityImprovement}% this week. Consistently hitting 8k+ steps on Wed/Sat helped boost your metabolic rate.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* DAILY CALORIES CHART */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-panel"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Flame size={24} className="text-orange-400" />
                  Daily Calories Chart
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Consumed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Burned</span>
                  </div>
                </div>
              </div>

              <div className="chart-container">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const consumed = [1800, 2100, 1650, 2200, 1900, 2400, 2000][i];
                  const burned = [400, 650, 450, 800, 500, 900, 550][i];
                  return (
                    <div key={i} className="chart-bar-group">
                      <div className="chart-bar-wrapper">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(consumed/3000)*100}%` }}
                          className="chart-bar consumed group/bar"
                          style={{ color: '#3b82f6' }}
                        >
                          <div className="chart-tooltip">{consumed} kcal</div>
                        </motion.div>
                      </div>
                      <div className="chart-bar-wrapper">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(burned/1500)*100}%` }}
                          className="chart-bar burned group/bar"
                          style={{ color: '#f59e0b' }}
                        >
                          <div className="chart-tooltip">{burned} kcal</div>
                        </motion.div>
                      </div>
                      <span className="chart-label mt-auto absolute -bottom-6">{day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="insight-box" style={{ borderLeftColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
                <p className="text-sm font-bold text-slate-200">
                  <span className="text-orange-400">🔥 AI Insight:</span> Calories burned increased significantly on workout days (Thu/Sat). Maintain this balance to reach your target weight of {userData?.targetWeight}kg faster.
                </p>
              </div>
            </motion.div>

            {/* OPTIONAL ANALYTICS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass-panel flex flex-col justify-between"
            >
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Sparkles size={24} className="text-teal-400" />
                Performance Metrics
              </h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Weekly Progress', value: weeklyProgress, color: 'emerald' },
                  { label: 'Goal Completion', value: goalCompletion, color: 'blue' },
                  { label: 'Activity Improvement', value: activityImprovement, color: 'teal' }
                ].map((metric, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{metric.label}</span>
                      <span className={`text-lg font-black text-${metric.color}-400`}>{metric.value}%</span>
                    </div>
                    <div className="progress-track">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className="progress-fill"
                        style={{ background: `linear-gradient(90deg, var(--${metric.color}-500), var(--teal-400))` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-3xl bg-teal-500/5 border border-teal-500/10">
                <p className="text-xs font-bold text-slate-400 italic">"Consistency is the key to lasting change. Your metrics show a strong positive trend this week."</p>
              </div>
            </motion.div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 4. MEAL COMPLETION HISTORY */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass-panel"
            >
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-400" />
                Meal Completion
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Breakfast', status: 'Completed', time: '08:15 AM', icon: '🍳' },
                  { name: 'Lunch', status: 'Completed', time: '01:30 PM', icon: '🍛' },
                  { name: 'Snacks', status: 'Completed', time: '04:45 PM', icon: '🥤' },
                  { name: 'Dinner', status: 'Pending', time: '08:00 PM', icon: '🌙' }
                ].map((meal, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{meal.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{meal.name}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase">{meal.time}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${meal.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {meal.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <div className="inline-block p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Completion Rate</p>
                  <p className="text-3xl font-black text-white">75%</p>
                </div>
              </div>
            </motion.div>

            {/* 5. WEIGHT PROGRESS TRACKER */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass-panel"
            >
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Target size={24} className="text-orange-400" />
                Weight Progress
              </h3>
              
              <div className="space-y-8 py-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Weight</p>
                    <p className="text-4xl font-black text-white">{userData?.weight || 54} <span className="text-sm text-slate-500">kg</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Weight</p>
                    <p className="text-4xl font-black text-teal-400">{userData?.targetWeight || 50} <span className="text-sm text-slate-500">kg</span></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Progress</span>
                    <span>{weightProgress > 0 ? weightProgress : 60}%</span>
                  </div>
                  <div className="progress-track">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${weightProgress > 0 ? weightProgress : 60}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="progress-fill" 
                    />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl">
                    ⚖️
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Keep it up!</p>
                    <p className="text-xs text-slate-400">You are only {Math.abs(userData?.weight - userData?.targetWeight) || 4}kg away from your goal.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 6. DAILY ACTIVITY TIMELINE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass-panel"
            >
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Clock size={24} className="text-purple-400" />
                Activity Timeline
              </h3>
              <div className="space-y-0">
                {[
                  { time: '08:00 AM', title: 'Breakfast', desc: 'Oatmeal & Fruits', icon: '🥣' },
                  { time: '01:00 PM', title: 'Lunch', desc: 'Grilled Chicken Salad', icon: '🥗' },
                  { time: '06:00 PM', title: 'Evening Workout', desc: '30 mins Cardio', icon: '🏃' },
                  { time: '09:00 PM', title: 'Dinner', desc: 'Quinoa & Salmon', icon: '🍣' }
                ].map((item, i) => (
                  <div key={i} className="timeline-item">
                    <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">{item.time}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-sm font-black text-white">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 7. ACHIEVEMENT SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
            >
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                <Trophy size={24} className="text-yellow-400" />
                Achievements
              </h3>
              <div className="badge-grid">
                {[
                  { name: '7 Day Streak', icon: '🏆', active: true },
                  { name: 'Hydration Master', icon: '💧', active: true },
                  { name: 'Calorie Burner', icon: '🔥', active: true },
                  { name: 'Early Bird', icon: '🌅', active: false },
                  { name: 'Weight Loss', icon: '⚖️', active: true },
                  { name: 'Power Walker', icon: '👟', active: false }
                ].map((badge, i) => (
                  <div key={i} className={`badge-item ${badge.active ? 'active' : ''}`}>
                    <div className="badge-icon">
                      {badge.icon}
                    </div>
                    <span className="text-[10px] font-black text-center text-slate-400 uppercase">{badge.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 8. AI INSIGHTS SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles size={120} className="text-teal-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                <Sparkles size={24} className="text-teal-400" />
                AI Smart Insights
              </h3>
              <div className="space-y-6 relative z-10">
                {[
                  "Your activity improved by 18% this week compared to last month.",
                  "Sleep consistency improved by 20 mins, leading to better focus.",
                  "Protein intake is slightly low; consider adding Greek yogurt to snacks.",
                  "You've hit your water goal 6 out of the last 7 days. Amazing consistency!"
                ].map((insight, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 hover:bg-teal-500/10 transition-all cursor-default">
                    <span className="h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center text-[10px] text-black font-bold shrink-0">💡</span>
                    <p className="text-sm font-bold text-slate-200 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Footer Branding */}
          <div className="text-center py-10 opacity-30">
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-xl font-black uppercase tracking-tighter">Meal <span className="text-emerald-400">Move</span></span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Advanced Fitness Intelligence</p>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ProgressReport;
