import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const AddMeal = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    foodName: '',
    mealType: 'Breakfast',
    quantity: 1
  });
  const [nutrition, setNutrition] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/api/user/profile');
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleGetCalories = async (e) => {
    e.preventDefault();
    if (!formData.foodName) {
      setMessage('⚠ Please enter a food name.');
      return;
    }

    setDetecting(true);
    setMessage('');
    setShowResult(false);
    
    try {
      const res = await api.post('/api/ai/detect-nutrition', { 
        foodName: formData.foodName.trim(), 
        quantity: formData.quantity 
      });
      
      const data = res.data;
      setNutrition(data);
      setShowResult(true);

      if (data.isEstimate || data.error) {
        setMessage('⚠ Nutrition estimate unavailable for exact food. Using approximate values.');
      }
    } catch (err) {
      console.error("Detection error:", err);
      // Client-side fallback
      setNutrition({
        calories: 250,
        protein: 8,
        carbs: 35,
        fat: 6,
        isEstimate: true
      });
      setShowResult(true);
      setMessage('⚠ AI connection slow. Using approximate calorie values.');
    } finally {
      setDetecting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nutrition) return;
    
    setSaving(true);
    try {
      await api.post('/api/user/meals', {
        ...formData,
        ...nutrition,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      });
      setMessage('Meal saved successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage('Error saving meal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userData={userData} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            
            <div className="text-center">
              <h1 className="text-4xl font-black text-white mb-2">Add New Meal</h1>
              <p className="text-slate-400">Log your nutrition with automatic AI detection.</p>
            </div>

            <div className="rounded-3xl glass-card p-8 sm:p-10 teal-border-gradient shadow-2xl relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Food Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-teal-400 uppercase tracking-widest ml-1">Food Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Masala Dosa, Grilled Chicken, Idly with Sambar"
                      value={formData.foodName}
                      onChange={(e) => setFormData({...formData, foodName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all placeholder:text-slate-600 shadow-inner"
                      required
                    />
                  </div>

                  {/* Meal Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-teal-400 uppercase tracking-widest ml-1">Meal Type</label>
                    <select 
                      value={formData.mealType}
                      onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-[#020617]">Breakfast</option>
                      <option className="bg-[#020617]">Lunch</option>
                      <option className="bg-[#020617]">Dinner</option>
                      <option className="bg-[#020617]">Snacks</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-teal-400 uppercase tracking-widest ml-1">Quantity</label>
                    <input 
                      type="number"
                      min="1"
                      step="0.5"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                <button 
                  onClick={handleGetCalories}
                  disabled={detecting || !formData.foodName}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {detecting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing nutrition...</span>
                    </>
                  ) : (
                    <>🔥 Get Calories</>
                  )}
                </button>

                {/* Live Meal Analysis Card */}
                {showResult && nutrition && (
                  <div className="p-8 rounded-3xl bg-white/5 border border-teal-500/30 animate-in slide-in-from-bottom-6 duration-500 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-wider">🍽 Meal Analysis</h3>
                        {nutrition.isEstimate && (
                          <span className="text-[9px] font-black bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest mt-1 inline-block">Approximate Estimate</span>
                        )}
                      </div>
                      <span className="text-3xl">🍲</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Food</p>
                        <p className="text-lg font-bold text-white">{formData.foodName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Meal Type</p>
                        <p className="text-lg font-bold text-white">{formData.mealType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Quantity</p>
                        <p className="text-lg font-bold text-white">{formData.quantity}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1">Total Calories</p>
                        <p className="text-2xl font-black text-white">{nutrition.calories} <span className="text-xs text-slate-500">kcal</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-[10px] text-blue-400 font-black uppercase mb-1">Protein</p>
                        <p className="text-xl font-black text-white">{nutrition.protein}g</p>
                      </div>
                      <div className="text-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">Carbs</p>
                        <p className="text-xl font-black text-white">{nutrition.carbs}g</p>
                      </div>
                      <div className="text-center p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                        <p className="text-[10px] text-rose-400 font-black uppercase mb-1">Fat</p>
                        <p className="text-xl font-black text-white">{nutrition.fat}g</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full py-5 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white rounded-2xl font-black text-xl shadow-2xl shadow-teal-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 mt-4"
                    >
                      {saving ? (
                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>💾 Save Meal</>
                      )}
                    </button>
                  </div>
                )}

                {message && (
                  <p className={`text-center font-bold text-sm ${message.includes('successfully') ? 'text-emerald-400' : 'text-rose-400'} animate-in fade-in duration-300`}>
                    {message}
                  </p>
                )}
              </div>

              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-teal-500/10 blur-3xl rounded-full" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-500/10 blur-3xl rounded-full" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMeal;
