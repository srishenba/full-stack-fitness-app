import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Activity, Target, ArrowRight, Ruler, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import InputGroup from '../components/ui/InputGroup';

const selectClassName =
  'w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-teal-500/50 focus:bg-teal-500/5 transition-all font-bold text-sm';

const Details = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'weight-loss',
    activityLevel: 'moderate',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.success('Profile preferences saved locally.');
        navigate('/dashboard');
      } catch (err) {
        toast.error('Something went wrong.');
      } finally {
        setSubmitting(false);
      }
    },
    [navigate]
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-black to-slate-950 z-[-1]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass p-10 md:p-14 rounded-[3rem] border border-teal-500/20 shadow-[0_0_80px_rgba(20,184,166,0.1)] mt-16"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-3">
            TELL US <span className="text-teal-500">MORE</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Personalizing your health roadmap</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <InputGroup
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onValueChange={(v) => setFormData((prev) => ({ ...prev, age: v }))}
              placeholder="25"
              icon={<User size={18} />}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={selectClassName}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <InputGroup
            label="Height (cm)"
            type="number"
            name="height"
            value={formData.height}
            onValueChange={(v) => setFormData((prev) => ({ ...prev, height: v }))}
            placeholder="175"
            icon={<Ruler size={18} />}
          />
          <InputGroup
            label="Weight (kg)"
            type="number"
            name="weight"
            value={formData.weight}
            onValueChange={(v) => setFormData((prev) => ({ ...prev, weight: v }))}
            placeholder="70"
            icon={<Scale size={18} />}
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className={selectClassName}>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={selectClassName}>
              <option value="sedentary">Sedentary</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </select>
          </div>

          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(20,184,166,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                'Processing...'
              ) : (
                <>
                  <Target size={20} /> Finish & Dashboard <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default React.memo(Details);
