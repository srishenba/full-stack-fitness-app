import React, { useState } from 'react';
import api from '../services/api';

const inputClass =
  'w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400';

const EditProfile = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    health: { ...user?.health },
    lifestyle: { ...user?.lifestyle },
    diet: { ...user?.diet },
    fitness: { ...user?.fitness },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateNested = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put('/api/user/update', form);
      await onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/10">X</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <input className={inputClass} value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Full Name" />
            <input className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" />
            <input className={inputClass} type="number" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} placeholder="Age" />
            <input className={inputClass} type="number" value={form.height} onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))} placeholder="Height" />
            <input className={inputClass} type="number" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} placeholder="Weight" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className={inputClass} value={form.health?.bloodSugar || ''} onChange={(e) => updateNested('health', 'bloodSugar', e.target.value)} placeholder="Blood Sugar" />
            <input className={inputClass} value={form.health?.bloodPressure || ''} onChange={(e) => updateNested('health', 'bloodPressure', e.target.value)} placeholder="Blood Pressure" />
            <input className={inputClass} value={form.health?.cholesterol || ''} onChange={(e) => updateNested('health', 'cholesterol', e.target.value)} placeholder="Cholesterol" />
            <input className={inputClass} value={form.health?.medicalConditions || ''} onChange={(e) => updateNested('health', 'medicalConditions', e.target.value)} placeholder="Medical Conditions" />
            <input className={inputClass} value={form.lifestyle?.activityLevel || ''} onChange={(e) => updateNested('lifestyle', 'activityLevel', e.target.value)} placeholder="Activity Level" />
            <input className={inputClass} value={form.lifestyle?.waterIntake || ''} onChange={(e) => updateNested('lifestyle', 'waterIntake', e.target.value)} placeholder="Water Intake" />
            <input className={inputClass} value={form.lifestyle?.sleepDuration || ''} onChange={(e) => updateNested('lifestyle', 'sleepDuration', e.target.value)} placeholder="Sleep Duration" />
            <input className={inputClass} value={form.lifestyle?.stressLevel || ''} onChange={(e) => updateNested('lifestyle', 'stressLevel', e.target.value)} placeholder="Stress Level" />
            <input className={inputClass} value={form.diet?.dietType || ''} onChange={(e) => updateNested('diet', 'dietType', e.target.value)} placeholder="Diet Type" />
            <input className={inputClass} value={form.diet?.favoriteFoods || ''} onChange={(e) => updateNested('diet', 'favoriteFoods', e.target.value)} placeholder="Favorite Foods" />
            <input className={inputClass} value={form.fitness?.goal || ''} onChange={(e) => updateNested('fitness', 'goal', e.target.value)} placeholder="Goal" />
            <input className={inputClass} value={form.fitness?.targetWeight || ''} onChange={(e) => updateNested('fitness', 'targetWeight', e.target.value)} placeholder="Target Weight" />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
