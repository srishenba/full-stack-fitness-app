import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Loader from '../components/ui/Loader';
import { useNavigate } from 'react-router-dom';
import GoalChecklist from '../components/dashboard/GoalChecklist';




const ProgressSection = ({ title }) => (
  <div className="rounded-2xl glass-card p-6 teal-border-gradient group hover:teal-glow-hover transition-all duration-300">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded-lg text-slate-400 uppercase tracking-wider">Live</span>
    </div>
    <div className="h-32 flex items-end justify-between gap-2 px-2">
      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
        <div key={i} className="flex-1 group relative">
          <div 
            className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-t-lg transition-all duration-500 ease-out" 
            style={{ height: `${h}%` }}
          />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {h}%
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-slate-500">
      <span>Mon</span>
      <span>Tue</span>
      <span>Wed</span>
      <span>Thu</span>
      <span>Fri</span>
      <span>Sat</span>
      <span>Sun</span>
    </div>
  </div>
);

const MealTracker = ({ meals, onAdd }) => (
  <div className="rounded-2xl glass-card p-6 teal-border-gradient group hover:teal-glow-hover transition-all duration-300">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-white">Today's Meals</h2>
      <button onClick={onAdd} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">+ Add</button>
    </div>
    <div className="space-y-3">
      {meals.length > 0 ? meals.map((meal, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:border-emerald-500/20 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍲</span>
            <div>
              <p className="text-sm font-semibold text-slate-200">{meal.mealType} - {meal.foodName}</p>
              <p className="text-xs text-slate-500">Quantity: {meal.quantity || 1}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-emerald-400">{meal.calories} kcal</span>
        </div>
      )) : (
        <p className="text-sm text-slate-500 text-center py-4 italic">No meals logged today.</p>
      )}
    </div>
  </div>
);

const ProfileCard = ({ user, onEdit }) => (
  <div className="rounded-2xl glass-card p-6 teal-border-gradient group hover:teal-glow-hover transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-xl font-bold text-white">Personal Profile</h2>
        <p className="text-sm text-slate-400">Manage your physical metrics</p>
      </div>
      <button 
        onClick={onEdit}
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
      >
        Edit Profile
      </button>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Age</p>
        <p className="text-lg font-semibold text-slate-200">{user.age || 'N/A'} years</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Weight</p>
        <p className="text-lg font-semibold text-slate-200">{user.weight || 'N/A'} kg</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Height</p>
        <p className="text-lg font-semibold text-slate-200">{user.height || 'N/A'} cm</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Gender</p>
        <p className="text-lg font-semibold text-slate-200 capitalize">{user.gender || 'N/A'}</p>
      </div>
    </div>
  </div>
);

const HealthMetricsCard = ({ user }) => (
  <div className="rounded-2xl glass-card p-6 teal-border-gradient group hover:teal-glow-hover transition-all duration-300">
    <h2 className="text-xl font-bold text-white mb-6">Health Indicators</h2>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
        <span className="text-slate-400">Blood Pressure</span>
        <span className="text-white font-medium">{user.bloodPressure || 'Normal'}</span>
      </div>
      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
        <span className="text-slate-400">Sugar Level</span>
        <span className="text-white font-medium">{user.sugarLevel || 'Stable'}</span>
      </div>
      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
        <span className="text-slate-400">Water Intake</span>
        <span className="text-blue-400 font-medium">{user.waterIntake || '8 glasses'}</span>
      </div>
      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
        <span className="text-slate-400">Sleep</span>
        <span className="text-indigo-400 font-medium">{user.sleepHours || '7 hours'}</span>
      </div>
    </div>
  </div>
);

const EditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...user });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Update Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {Object.keys(formData).filter(key => ['name', 'age', 'weight', 'height', 'fitnessGoal', 'activityLevel'].includes(key)).map(key => (
            <div key={key} className="space-y-2">
              <label className="text-sm text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input 
                name={key} 
                value={formData[key] || ''} 
                onChange={(e) => setFormData({...formData, [key]: e.target.value})} 
                className="w-full bg-slate-800 rounded-xl px-4 py-2 text-white border border-slate-700 focus:border-emerald-500 outline-none" 
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">Cancel</button>
          <button onClick={() => onSave(formData)} className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-emerald-500/20">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const MealModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: 'Breakfast', calories: 300, foodItems: '' });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Log Meal</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Meal Type</label>
            <select value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white border border-slate-700 focus:border-emerald-500 outline-none">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Calories (kcal)</label>
            <input type="number" value={formData.calories} onChange={(e) => setFormData({...formData, calories: e.target.value})} className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white border border-slate-700 focus:border-emerald-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Food Items</label>
            <input placeholder="e.g. Eggs, Toast, Coffee" value={formData.foodItems} onChange={(e) => setFormData({...formData, foodItems: e.target.value})} className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white border border-slate-700 focus:border-emerald-500 outline-none" />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">Cancel</button>
          <button onClick={() => onSave(formData)} className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-emerald-500/20">Log Meal</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchInitialData();
  }, [token]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [userRes, mealRes] = await Promise.all([
        api.get('/api/user/profile'),
        api.get('/api/user/meals/today')
      ]);
      setUserData(userRes.data);
      setMeals(mealRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      await api.put('/api/user/profile', updatedData);
      setUserData(updatedData);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleAddMeal = async (mealData) => {
    try {
      await api.post('/api/user/meals', mealData);
      const res = await api.get('/api/user/meals/today');
      setMeals(res.data);
      setIsMealModalOpen(false);
    } catch (err) {
      console.error("Meal add error:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userData={userData} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <div className="w-full">
              <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 p-6 sm:p-8 border border-teal-500/20 min-h-[240px] flex flex-col justify-center shadow-2xl">
                <div className="relative z-10">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                    Welcome, <span className="text-emerald-400">{userData?.name || 'Shenbagam'}</span>! 👋
                  </h1>
                  <p className="mt-2 text-lg text-slate-300 max-w-2xl font-medium">Ready to crush your fitness goals today? Your personalized AI analysis is waiting.</p>
                  
                  <button 
                    onClick={() => navigate('/ai-analysis')}
                    className="mt-6 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-lg flex items-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:scale-95 group w-fit"
                  >
                    <span className="text-xl">🚀</span> Start AI Analysis
                    <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute left-1/2 bottom-0 -mb-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
              </header>
            </div>
            {userData && (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                  <ProfileCard user={userData} onEdit={() => setIsEditModalOpen(true)} />
                  <div className="grid gap-8 md:grid-cols-2">
                    <ProgressSection title="Weekly Steps" />
                    <ProgressSection title="Calorie Trend" />
                  </div>
                </div>
                <div className="space-y-8">
                  <GoalChecklist compact={true} />
                  <HealthMetricsCard user={userData} />
                  <MealTracker meals={meals} onAdd={() => setIsMealModalOpen(true)} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {isEditModalOpen && <EditModal user={userData} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateProfile} />}
      {isMealModalOpen && <MealModal onClose={() => setIsMealModalOpen(false)} onSave={handleAddMeal} />}
    </div>
  );
};

export default Dashboard;