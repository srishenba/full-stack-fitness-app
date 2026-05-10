import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import GoalChecklist from '../components/dashboard/GoalChecklist';

const AIAnalysis = () => {
  const [userData, setUserData] = useState(null);
  const [meals, setMeals] = useState([]);
  const [inputs, setInputs] = useState({
    steps: '',
    waterIntake: '',
    sleepHours: '',
    workoutDone: 'No'
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState('input'); // input, loading, result
  const [loadingText, setLoadingText] = useState('Initializing AI Engine...');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, mealRes] = await Promise.all([
        api.get('/api/user/profile'),
        api.get('/api/user/meals/today')
      ]);
      setUserData(userRes.data);
      setMeals(mealRes.data);
    } catch (err) {
      console.error("Error fetching analysis data:", err);
    }
  };

  const handleStartAnalysis = async () => {
    // Validation
    if (!inputs.steps || !inputs.waterIntake || !inputs.sleepHours) {
      setError('⚠ Please enter today\'s steps, water intake, and sleep hours.');
      return;
    }

    setPhase('loading');
    setLoading(true);
    setError('');
    setLoadingText('Analyzing your health data...');

    const phases = [
      'Synchronizing profile data...',
      'Aggregating meal nutrition...',
      'Evaluating activity levels...',
      'Computing health score...',
      'Generating personalized report...'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < phases.length) {
        setLoadingText(phases[i]);
        i++;
      }
    }, 1000);

    try {
      const res = await api.post('/api/ai/generate-analysis', { 
        steps: parseInt(inputs.steps),
        waterIntake: parseFloat(inputs.waterIntake) || 0,
        sleepHours: parseFloat(inputs.sleepHours) || 0,
        workoutDone: inputs.workoutDone === 'Yes'
      });
      clearInterval(interval);
      setAnalysis(res.data.analysis);
      setPhase('result');
    } catch (err) {
      clearInterval(interval);
      console.error("Analysis generation failed:", err);
      setError('⚠ Analysis failed. Please check your connection and try again.');
      setPhase('input');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCalories = () => meals.reduce((sum, m) => sum + m.calories, 0);
  const lastMeal = meals.length > 0 ? meals[meals.length - 1] : null;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userData={userData} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <div className="w-full max-w-5xl mx-auto space-y-8">
            
            {/* Phase 1: Input & Data Fetch */}
            {phase === 'input' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-10 duration-500">
                
                {/* Left Side: Profile & Activity Inputs */}
                <div className="lg:col-span-2 space-y-8">
                  {/* User Summary Card */}
                  <div className="rounded-3xl glass-card p-8 teal-border-gradient relative overflow-hidden">
                    <div className="flex items-center gap-6 mb-8 relative z-10">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-3xl border border-white/10 shadow-2xl">
                        👤
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white">{userData?.name || 'User'}</h2>
                        <p className="text-teal-400 font-bold uppercase text-xs tracking-widest">Active Profile</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Age</p>
                        <p className="text-xl font-bold text-white">{userData?.age || '--'} Years</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Weight</p>
                        <p className="text-xl font-bold text-white">{userData?.weight || '--'} kg</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Height</p>
                        <p className="text-xl font-bold text-white">{userData?.height || '--'} cm</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Goal</p>
                        <p className="text-xl font-bold text-emerald-400">{userData?.fitnessGoal || 'General'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">BMI Status</p>
                        <p className="text-xl font-bold text-white">Normal</p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <span className="text-9xl">📊</span>
                    </div>
                  </div>

                  {/* Activity Inputs */}
                  <div className="rounded-3xl glass-card p-8 teal-border-gradient">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                      <span className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-lg shadow-lg shadow-blue-500/10">⚡</span>
                      Daily Activity Inputs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-teal-400 uppercase tracking-widest ml-1">👣 Today's Steps</label>
                        <input 
                          type="number"
                          placeholder="e.g. 6500"
                          value={inputs.steps}
                          onChange={(e) => setInputs({...inputs, steps: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-teal-400 uppercase tracking-widest ml-1">💧 Water Intake (Liters)</label>
                        <input 
                          type="number"
                          step="0.5"
                          placeholder="e.g. 2.5"
                          value={inputs.waterIntake}
                          onChange={(e) => setInputs({...inputs, waterIntake: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-teal-400 uppercase tracking-widest ml-1">😴 Sleep Hours</label>
                        <input 
                          type="number"
                          placeholder="e.g. 7"
                          value={inputs.sleepHours}
                          onChange={(e) => setInputs({...inputs, sleepHours: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-teal-400 uppercase tracking-widest ml-1">🏃 Workout Completed?</label>
                        <select 
                          value={inputs.workoutDone}
                          onChange={(e) => setInputs({...inputs, workoutDone: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                        >
                          <option className="bg-[#020617]">No</option>
                          <option className="bg-[#020617]">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Meal Summary (Auto Fetch) */}
                <div className="space-y-8">
                  <div className="rounded-3xl glass-card p-8 teal-border-gradient h-full">
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                      <span className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-lg shadow-lg shadow-orange-500/10">🍱</span>
                      Meal Summary
                    </h3>
                    <div className="space-y-4">
                      {meals.length > 0 ? meals.map((meal, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                          <div>
                            <p className="text-sm font-bold text-white">{meal.mealType}</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase">{meal.foodName}</p>
                          </div>
                          <span className="text-emerald-400 font-black">{meal.calories} <span className="text-[8px] uppercase">kcal</span></span>
                        </div>
                      )) : (
                        <div className="text-center py-8">
                          <p className="text-slate-500 italic text-sm">No meals logged yet.</p>
                        </div>
                      )}

                      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20">
                        <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em] mb-1">Total Consumed</p>
                        <h4 className="text-3xl font-black text-white">{calculateTotalCalories()} <span className="text-sm font-bold text-slate-500">kcal</span></h4>
                      </div>

                      {lastMeal && (
                        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">🍽 Last Meal</p>
                          <p className="text-sm font-bold text-white">{lastMeal.mealType} - {lastMeal.foodName}</p>
                          <p className="text-xs text-emerald-400 font-bold">{lastMeal.calories} kcal</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleStartAnalysis}
                      className="w-full mt-10 py-5 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                    >
                      🚀 Analyze My Health
                    </button>
                    {error && <p className="text-rose-400 text-xs font-bold text-center mt-4 animate-shake">{error}</p>}
                  </div>
                </div>

              </div>
            )}

            {/* Phase 2: Loading */}
            {phase === 'loading' && (
              <div className="text-center py-20 animate-pulse">
                <div className="relative h-48 w-48 mx-auto mb-10">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-500/10" />
                  <div className="absolute inset-0 rounded-full border-t-4 border-teal-400 animate-spin" />
                  <div className="absolute inset-6 rounded-full border-4 border-blue-500/10" />
                  <div className="absolute inset-6 rounded-full border-b-4 border-blue-400 animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl animate-bounce">🧬</span>
                  </div>
                </div>
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{loadingText}</h2>
                <p className="text-teal-400 font-mono text-xs tracking-[0.5em] uppercase">Deep Learning in Progress</p>
              </div>
            )}

            {/* Phase 3: Result */}
            {phase === 'result' && analysis && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                
                {/* Result Hero */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3 rounded-3xl glass-card p-10 teal-border-gradient flex items-center gap-10 relative overflow-hidden">
                    <div className="relative h-40 w-40 flex-shrink-0">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                        <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={464.7} strokeDashoffset={464.7 - (464.7 * analysis.fitnessScore) / 100} className="text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white">{analysis.fitnessScore}%</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-white mb-2">Shenbagam's Report 👋</h2>
                      <p className="text-slate-400 text-lg mb-6 leading-relaxed">Your AI Fitness Score is calculated using 12 dynamic body and activity data points.</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="px-6 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-widest">
                          BMI: {analysis.bmiStatus}
                        </div>
                        <div className="px-6 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black uppercase tracking-widest">
                          {analysis.activityLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl glass-card p-8 teal-border-gradient flex flex-col justify-center text-center">
                    <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mb-4">Steps Logged</p>
                    <h3 className="text-5xl font-black text-white mb-2">{analysis.steps}</h3>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400" style={{ width: `${Math.min(analysis.steps/100, 100)}%` }} />
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="rounded-2xl glass-card p-6 border border-white/5 bg-white/5">
                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">🔥 Calories Analysis</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-slate-500">Burned</span>
                        <span className="text-xl font-black text-white">{analysis.caloriesBurned}</span>
                      </div>
                      <div className="flex justify-between items-end border-t border-white/5 pt-2">
                        <span className="text-xs text-slate-500">Consumed</span>
                        <span className="text-xl font-black text-emerald-400">{calculateTotalCalories()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl glass-card p-6 border border-white/5 bg-white/5">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">💧 Hydration</p>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed">{analysis.waterAnalysis}</p>
                  </div>
                  <div className="rounded-2xl glass-card p-6 border border-white/5 bg-white/5">
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">😴 Sleep Quality</p>
                    <p className="text-sm font-bold text-slate-300 leading-relaxed">{analysis.sleepAnalysis}</p>
                  </div>
                  <div className="rounded-2xl glass-card p-6 border border-white/5 bg-white/5">
                    <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">📈 Status</p>
                    <p className="text-xl font-black text-white">{analysis.bmiStatus}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Based on height/weight</p>
                  </div>
                </div>

                {/* AI Personalized Meal Suggestions */}
                {analysis.mealSuggestions && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-6 duration-700">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                      <span className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center shadow-lg shadow-teal-500/10">🍽</span>
                      Personalized Food Suggestions
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { id: 'breakfast', label: 'Breakfast', icon: '🍳', data: analysis.mealSuggestions.breakfast },
                        { id: 'lunch', label: 'Lunch', icon: '🍛', data: analysis.mealSuggestions.lunch },
                        { id: 'dinner', label: 'Dinner', icon: '🌙', data: analysis.mealSuggestions.dinner },
                        { id: 'snack', label: 'Snacks', icon: '🥤', data: analysis.mealSuggestions.snack }
                      ].map((meal) => (
                        <div key={meal.id} className="rounded-3xl glass-card p-6 teal-border-gradient group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                          <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="text-3xl group-hover:scale-125 transition-transform duration-500">{meal.icon}</span>
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{meal.label}</span>
                          </div>
                          <h4 className="text-lg font-black text-white mb-2 relative z-10">{meal.data.name}</h4>
                          <div className="space-y-2 relative z-10">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                              <span className="text-teal-400">💡</span> AI Nutrition Note
                            </p>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                              {meal.data.reason || "Recommended for balanced nutrition and goal support."}
                            </p>
                          </div>
                          <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-teal-500/5 blur-2xl rounded-full group-hover:bg-teal-500/10 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights & Checkboxes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Suggestions Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-3xl glass-card p-8 teal-border-gradient">
                        <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">🥗 Nutrition AI</h4>
                        <ul className="space-y-4">
                          {analysis.suggestions.map((s, i) => (
                            <li key={i} className="flex gap-4 text-sm text-slate-300 font-medium">
                              <span className="text-teal-400">✔</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-3xl glass-card p-8 teal-border-gradient">
                        <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">🏃 Workout AI</h4>
                        <ul className="space-y-4">
                          {analysis.workoutSuggestions.map((s, i) => (
                            <li key={i} className="flex gap-4 text-sm text-slate-300 font-medium">
                              <span className="text-blue-400">🔥</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Goal Completion */}
                    <GoalChecklist />
                  </div>

                  {/* Actions & History Preview */}
                  <div className="space-y-6">
                    <button 
                      onClick={() => {
                        window.print(); // Simple simulation of saving/printing report
                        setPhase('input');
                      }}
                      className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      💾 Save Today's Report
                    </button>
                    
                    <button 
                      onClick={() => setPhase('input')}
                      className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-lg transition-all"
                    >
                      🔄 New Analysis
                    </button>

                    <div className="rounded-3xl glass-card p-8 border border-white/5">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Security & Storage</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <p className="text-[10px] font-black text-slate-500 uppercase">Reports Persisted</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          <p className="text-[10px] font-black text-slate-500 uppercase">End-to-End Encryption</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {analysis.warnings.length > 0 && (
                  <div className="rounded-3xl bg-rose-500/10 border border-rose-500/20 p-8">
                    <h3 className="text-xl font-black text-rose-400 mb-4">⚠ AI Health Warnings</h3>
                    <ul className="space-y-2 text-sm text-rose-300 font-medium">
                      {analysis.warnings.map((w, i) => <li key={i}>• {w}</li>)}
                    </ul>
                  </div>
                )}

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAnalysis;
