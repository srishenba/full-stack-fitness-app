import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Calendar, Activity, Weight, Ruler, ChevronLeft, 
  Heart, Droplets, Baby, AlertCircle, Apple, Zap, Coffee, Medal,
  Upload, CheckCircle2, XCircle, FileText, Smartphone, Camera,
  Eye, EyeOff, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

// Sub-component for form sections
const FormSection = ({ title, icon, children, active = true }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex flex-col gap-8 glass p-8 md:p-10 rounded-[2.5rem] border border-white/5 relative bg-white/[0.02] shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
  >
    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
      <div className="p-3.5 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-400">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black uppercase tracking-widest text-white">{title}</h3>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </motion.div>
);

// Styled Input component specific for Signup requirements
const SignupInput = ({ label, icon, value, error, success, onValueChange, onBlur, shake, type = "text", ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <div className={`flex flex-col gap-2 ${shake ? 'animate-shake' : ''}`}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2 leading-none">
        {label}
      </label>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all font-black ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-slate-500 group-focus-within:text-teal-400'}`}>
          {icon}
        </div>
        <input
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-800 transition-all font-bold text-sm outline-none ${
            error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
            success ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 
            'border-white/10 focus:border-white/40'
          }`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {error && <XCircle size={16} className="text-red-500 animate-in fade-in zoom-in duration-300" />}
          {success && <CheckCircle2 size={16} className="text-green-500 animate-in fade-in zoom-in duration-300" />}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-teal-400 transition-colors ml-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-[10px] font-bold mt-1 px-2">{error}</p>}
    </div>
  );
};

const SignupSelect = ({ label, icon, value, error, success, onValueChange, onBlur, options, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2 leading-none">
      {label}
    </label>
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all font-black z-10 ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-slate-500 group-focus-within:text-teal-400'}`}>
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white transition-all font-bold text-sm outline-none appearance-none cursor-pointer ${
          error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
          success ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 
          'border-white/10 focus:border-white/40'
        }`}
        {...props}
      >
        <option value="" className="bg-slate-900 text-white py-2">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white py-2">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
        {error && <XCircle size={14} className="text-red-500" />}
        {success && <CheckCircle2 size={14} className="text-green-500" />}
        <Smartphone size={14} className="rotate-90 text-slate-500" />
      </div>
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 px-2">{error}</p>}
  </div>
);

const SignupFile = ({ label, icon, onFileChange, fileName, error, success, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2 leading-none">
      {label}
    </label>
    <label className={`relative flex items-center gap-4 bg-white/5 border rounded-2xl py-4 px-4 transition-all cursor-pointer hover:bg-white/[0.08] ${
      error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
      success ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 
      'border-white/10 hover:border-white/30'
    }`}>
      <div className={`${error ? 'text-red-500' : success ? 'text-green-500' : 'text-teal-400'}`}>
        {error ? <XCircle size={18} /> : success ? <CheckCircle2 size={18} /> : icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className={`text-sm font-bold truncate ${fileName ? 'text-white' : 'text-slate-600'}`}>
          {fileName || `Upload ${label}`}
        </p>
      </div>
      <input type="file" className="hidden" onChange={(e) => onFileChange(e.target.files[0])} />
      <Upload size={16} className="text-slate-600" />
    </label>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 px-2">{error}</p>}
  </div>
);

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', age: '', gender: '', height: '', weight: '',
    sugarLevel: '', diabetes: '', bloodPressure: '', cholesterolLevel: '', allergies: '', medicalConditions: '',
    activityLevel: '', waterIntake: '', sleepHours: '', stressLevel: '',
    foodType: '', favoriteFoods: '', foodsToAvoid: '',
    fitnessGoal: '', mealFrequency: '', workoutPreference: '', targetWeight: ''
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    sugarReportFile: null,
    bloodPressureReport: null,
    cholesterolReport: null
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [shake, setShake] = useState(false);
  const [strength, setStrength] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Persistence: Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('signupFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved signup data", e);
      }
    }
  }, []);

  // Persistence: Save to localStorage on change
  React.useEffect(() => {
    localStorage.setItem('signupFormData', JSON.stringify(formData));
  }, [formData]);

  const completionPercentage = useMemo(() => {
    const relevantFields = [
      'name', 'email', 'password', 'confirmPassword', 'age', 'gender', 'height', 'weight',
      'diabetes', 'activityLevel', 'waterIntake', 'sleepHours', 'stressLevel', 
      'foodType', 'fitnessGoal', 'mealFrequency', 'workoutPreference', 'targetWeight'
    ];
    const filledCount = relevantFields.filter(f => formData[f] !== '').length;
    return Math.round((filledCount / relevantFields.length) * 100);
  }, [formData]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 3) return "Full name must be at least 3 characters.";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Please enter a valid name (letters only).";
        return null;
      case 'email':
        if (!value.trim()) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address (e.g., name@example.com).";
        return null;
      case 'password':
        if (!value) return "Password is required.";
        if (value.length < 6 || !(/[a-zA-Z]/.test(value) && /[0-9]/.test(value))) 
          return "Password must be at least 6 characters and include letters and numbers.";
        return null;
      case 'confirmPassword':
        if (!value) return "Please confirm your password.";
        if (value !== formData.password) return "Passwords do not match.";
        return null;
      case 'age':
        if (!value) return "Age is required.";
        const age = parseInt(value);
        if (isNaN(age) || age < 10 || age > 100) return "Please enter a valid age between 10 and 100.";
        return null;
      case 'gender':
        if (!value) return "Please select your gender.";
        return null;
      case 'height':
        if (!value) return "Please enter a valid height (50–250 cm).";
        const h = parseFloat(value);
        if (isNaN(h) || h < 50 || h > 250) return "Please enter a valid height (50–250 cm).";
        return null;
      case 'weight':
        if (!value) return "Please enter a valid weight (20–300 kg).";
        const w = parseFloat(value);
        if (isNaN(w) || w < 20 || w > 300) return "Please enter a valid weight (20–300 kg).";
        return null;
      case 'sugarLevel':
        if (value) {
          const s = parseFloat(value);
          if (isNaN(s) || s < 70 || s > 200) return "Enter a valid blood sugar level (70–200 mg/dL).";
        }
        return null;
      case 'diabetes':
        if (!value) return "Please select your diabetes status.";
        return null;
      case 'bloodPressure':
        if (value && !/^\d{2,3}\/\d{2,3}$/.test(value)) return "Enter blood pressure in format (e.g., 120/80).";
        return null;
      case 'cholesterolLevel':
        if (value) {
          const c = parseFloat(value);
          if (isNaN(c) || c < 50 || c > 500) return "Enter a valid cholesterol level.";
        }
        return null;
      case 'activityLevel':
        if (!value) return "Please select your activity level.";
        return null;
      case 'waterIntake':
        if (value) {
          const wi = parseFloat(value);
          if (isNaN(wi) || wi < 1 || wi > 10) return "Enter a valid daily water intake.";
        }
        return null;
      case 'sleepHours':
        if (value) {
          const sh = parseFloat(value);
          if (isNaN(sh) || sh < 3 || sh > 12) return "Enter valid sleep duration (3–12 hours).";
        }
        return null;
      case 'stressLevel':
        if (!value) return "Please select your stress level.";
        return null;
      case 'foodType':
        if (!value) return "Please select your diet type.";
        return null;
      case 'fitnessGoal':
        if (!value) return "Please select your fitness goal.";
        return null;
      case 'mealFrequency':
        if (value) {
          const mf = parseInt(value);
          if (isNaN(mf) || mf < 1 || mf > 8) return "Enter valid meals per day.";
        }
        return null;
      case 'workoutPreference':
        if (!value) return "Please select your workout preference.";
        return null;
      case 'targetWeight':
        if (value) {
          const tw = parseFloat(value);
          if (isNaN(tw) || tw < 20 || tw > 300) return "Enter a valid target weight.";
        }
        return null;
      default:
        return null;
    }
  };

  const validateFile = (name, file) => {
    if (name === 'profilePhoto') {
      if (!file) return null;
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) return "Please upload a valid image (JPG/PNG, max 2MB).";
      if (file.size > 2 * 1024 * 1024) return "Please upload a valid image (JPG/PNG, max 2MB).";
    }
    return null;
  };

  const handleValueChange = (name, value) => {
    let finalValue = value;
    
    // Numeric restrictions for height and weight
    if (name === 'height' || name === 'weight' || name === 'targetWeight') {
      finalValue = value.replace(/[^0-9.]/g, ''); // Numeric only
      if (finalValue) {
        const val = parseFloat(finalValue);
        if (name === 'height' && val > 250) finalValue = '250';
        if ((name === 'weight' || name === 'targetWeight') && val > 300) finalValue = '300';
      }
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
    if (name === 'password') setStrength(checkStrength(value));
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (name, file) => {
    setFiles(prev => ({ ...prev, [name]: file }));
    const error = validateFile(name, file);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const checkStrength = (pass) => {
    if (!pass) return "";
    if (pass.length < 6) return "Weak";
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) return "Strong";
    return "Medium";
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    Object.keys(files).forEach(key => {
      const error = validateFile(key, files[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Please fix the errors before submitting.");
      
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = document.querySelector('.border-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Send data as simple JSON object
      const res = await api.post('/api/auth/signup', formData);
      const data = res.data;

      // Accept either { success: true, token } or { token } (old backend format)
      if (data.token) {
        login(data.token, data.user);
        localStorage.removeItem('signupFormData');
        toast.success(data.message || 'Account created successfully! 🎉');
        window.location.href = '/dashboard';
      } else {
        const msg = data.message || 'Something went wrong. Please try again.';
        toast.error(msg);
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(serverMsg);
      console.error('Signup Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 py-24 relative overflow-x-hidden">
      {/* Dynamic Progress Indicator - Text based below navbar */}
      <div className="fixed top-14 left-0 w-full z-40 bg-white shadow-sm py-2.5 px-6 flex justify-center items-center border-b border-slate-200">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Registration Progress: <span className="text-teal-600 ml-1">{completionPercentage}% completed</span>
        </p>
      </div>

      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={logo} alt="bg" className="w-full h-full object-cover blur-[100px] opacity-20 scale-125" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-black to-slate-950/80" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl flex flex-col gap-12"
      >
        <header className="flex flex-col items-center text-center gap-6">
          <Link to="/" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-teal-500/30 transition-all hover:scale-105 group">
            <img src={logo} alt="Meal Move" className="w-16 h-16 object-contain" />
          </Link>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
              Create Your <span className="text-teal-400">Account</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] mt-3">Health Details</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          {/* Section 1: Basic Info */}
          <FormSection title="Personal Details" icon={<User size={20} />}>
            <SignupInput 
              label="Full Name" icon={<User size={18} />} 
              value={formData.name} onValueChange={(v) => handleValueChange('name', v)}
              onBlur={() => handleBlur('name')}
              error={errors.name} success={touched.name && !errors.name}
              shake={shake && errors.name} placeholder="John Doe"
            />
            <div className="relative group">
              <SignupInput 
                label="Email Address" icon={<Mail size={18} />} 
                value={formData.email} onValueChange={(v) => handleValueChange('email', v)}
                onBlur={() => handleBlur('email')}
                error={errors.email} success={touched.email && !errors.email}
                shake={shake && errors.email} placeholder="john@example.com"
                list="email-suggestions"
              />
              <datalist id="email-suggestions">
                {formData.email.includes('@') ? (
                  ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com'].map(domain => {
                    const [name] = formData.email.split('@');
                    return <option key={domain} value={`${name}@${domain}`} />;
                  })
                ) : (
                  ['@gmail.com', '@outlook.com', '@yahoo.com', '@icloud.com'].map(domain => (
                    <option key={domain} value={`${formData.email}${domain}`} />
                  ))
                )}
              </datalist>
            </div>
            <div className="flex flex-col gap-1">
              <SignupInput 
                label="Password" icon={<Lock size={18} />} 
                value={formData.password} onValueChange={(v) => handleValueChange('password', v)}
                onBlur={() => handleBlur('password')}
                error={errors.password} success={touched.password && !errors.password}
                shake={shake && errors.password} type="password" placeholder="••••••••"
              />
              <p className="text-[9px] text-slate-500/60 font-black uppercase tracking-widest px-2 mt-1 -mb-1">
                Password must be at least 6 characters
              </p>
              {formData.password && (
                <div className="px-2 pt-1">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    strength === "Weak" ? "text-red-400" : strength === "Medium" ? "text-yellow-400" : "text-green-400"
                  }`}>
                    Strength: {strength}
                  </p>
                  <div className="h-1 mt-1.5 rounded-full bg-white/5 overflow-hidden w-full max-w-[120px]">
                    <div 
                      style={{ 
                        width: strength === "Weak" ? "33.33%" : strength === "Medium" ? "66.66%" : "100%",
                        backgroundColor: strength === "Weak" ? "#f87171" : strength === "Medium" ? "#fbbf24" : "#4ade80"
                      }}
                      className="h-full transition-all duration-500"
                    />
                  </div>
                </div>
              )}
            </div>
            <SignupInput 
              label="Confirm Password" icon={<Lock size={18} />} 
              value={formData.confirmPassword} onValueChange={(v) => handleValueChange('confirmPassword', v)}
              onBlur={() => handleBlur('confirmPassword')}
              error={errors.confirmPassword} success={touched.confirmPassword && !errors.confirmPassword}
              shake={shake && errors.confirmPassword} type="password" placeholder="••••••••"
            />
            <SignupInput 
              label="Age" icon={<Calendar size={18} />} 
              value={formData.age} onValueChange={(v) => handleValueChange('age', v)}
              onBlur={() => handleBlur('age')}
              error={errors.age} success={touched.age && !errors.age}
              shake={shake && errors.age} type="number" placeholder="24"
            />
            <SignupSelect 
              label="Gender" icon={<Baby size={18} />}
              value={formData.gender} onValueChange={(v) => handleValueChange('gender', v)}
              onBlur={() => handleBlur('gender')}
              error={errors.gender} success={touched.gender && !errors.gender}
              options={[{label: 'Male', value: 'male'}, {label: 'Female', value: 'female'}, {label: 'Other', value: 'other'}]}
            />
            <div className="grid grid-cols-2 gap-4">
              <SignupInput 
                label="Height (cm)" icon={<Ruler size={18} />} 
                value={formData.height} onValueChange={(v) => handleValueChange('height', v)}
                onBlur={() => handleBlur('height')}
                error={errors.height} success={touched.height && !errors.height}
                shake={shake && errors.height} type="number" placeholder="180"
              />
              <SignupInput 
                label="Weight (kg)" icon={<Weight size={18} />} 
                value={formData.weight} onValueChange={(v) => handleValueChange('weight', v)}
                onBlur={() => handleBlur('weight')}
                error={errors.weight} success={touched.weight && !errors.weight}
                shake={shake && errors.weight} type="number" placeholder="75"
              />
            </div>
            <SignupFile 
              label="Profile Photo" icon={<Camera size={18} />}
              fileName={files.profilePhoto?.name} onFileChange={(f) => handleFileChange('profilePhoto', f)}
              error={errors.profilePhoto} success={!!files.profilePhoto && !errors.profilePhoto}
            />
          </FormSection>

          {/* Section 2: Health Info */}
          <FormSection title="Health Information" icon={<Heart size={20} />}>
            <SignupInput 
              label="Blood Sugar Level" icon={<Droplets size={18} />} 
              value={formData.sugarLevel} onValueChange={(v) => handleValueChange('sugarLevel', v)}
              onBlur={() => handleBlur('sugarLevel')}
              error={errors.sugarLevel} success={touched.sugarLevel && formData.sugarLevel && !errors.sugarLevel}
              placeholder="e.g. 95 mg/dL"
            />
            <SignupSelect 
              label="Do you have Diabetes?" icon={<Activity size={18} />}
              value={formData.diabetes} onValueChange={(v) => handleValueChange('diabetes', v)}
              onBlur={() => handleBlur('diabetes')}
              error={errors.diabetes} success={touched.diabetes && !errors.diabetes}
              options={[{label: 'No', value: 'no'}, {label: 'Yes', value: 'yes'}]}
            />
            <SignupFile 
              label="Upload Blood Sugar Report" icon={<FileText size={18} />}
              fileName={files.sugarReportFile?.name} onFileChange={(f) => handleFileChange('sugarReportFile', f)}
              error={errors.sugarReportFile} success={!!files.sugarReportFile && !errors.sugarReportFile}
            />
            <SignupInput 
              label="Blood Pressure" icon={<Activity size={18} />} 
              value={formData.bloodPressure} onValueChange={(v) => handleValueChange('bloodPressure', v)}
              onBlur={() => handleBlur('bloodPressure')}
              error={errors.bloodPressure} success={touched.bloodPressure && formData.bloodPressure && !errors.bloodPressure}
              placeholder="e.g. 120/80"
            />
            <SignupFile 
              label="Upload Blood Pressure Report" icon={<FileText size={18} />}
              fileName={files.bloodPressureReport?.name} onFileChange={(f) => handleFileChange('bloodPressureReport', f)}
              error={errors.bloodPressureReport} success={!!files.bloodPressureReport && !errors.bloodPressureReport}
            />
            <SignupInput 
              label="Cholesterol Level" icon={<Activity size={18} />} 
              value={formData.cholesterolLevel} onValueChange={(v) => handleValueChange('cholesterolLevel', v)}
              onBlur={() => handleBlur('cholesterolLevel')}
              error={errors.cholesterolLevel} success={touched.cholesterolLevel && formData.cholesterolLevel && !errors.cholesterolLevel}
              placeholder="e.g. 180 mg/dL"
            />
            <SignupFile 
              label="Upload Cholesterol Report" icon={<FileText size={18} />}
              fileName={files.cholesterolReport?.name} onFileChange={(f) => handleFileChange('cholesterolReport', f)}
              error={errors.cholesterolReport} success={!!files.cholesterolReport && !errors.cholesterolReport}
            />
            <SignupInput 
              label="Allergies" icon={<AlertCircle size={18} />} 
              value={formData.allergies} onValueChange={(v) => handleValueChange('allergies', v)}
              onBlur={() => handleBlur('allergies')}
              error={errors.allergies} success={touched.allergies && formData.allergies && !errors.allergies}
              placeholder="e.g. Peanuts, Pollen"
            />
            <SignupInput 
              label="Medical Conditions" icon={<Heart size={18} />} 
              value={formData.medicalConditions} onValueChange={(v) => handleValueChange('medicalConditions', v)}
              onBlur={() => handleBlur('medicalConditions')}
              error={errors.medicalConditions} success={touched.medicalConditions && formData.medicalConditions && !errors.medicalConditions}
              placeholder="Known conditions"
            />
          </FormSection>

          {/* Section 3: Lifestyle */}
          <FormSection title="Lifestyle Details" icon={<Zap size={20} />}>
            <SignupSelect 
              label="Activity Level" icon={<Activity size={18} />}
              value={formData.activityLevel} onValueChange={(v) => handleValueChange('activityLevel', v)}
              onBlur={() => handleBlur('activityLevel')}
              error={errors.activityLevel} success={touched.activityLevel && !errors.activityLevel}
              options={[
                {label: 'Sedentary', value: 'sedentary'},
                {label: 'Light', value: 'light'},
                {label: 'Moderate', value: 'moderate'},
                {label: 'Active', value: 'active'}
              ]}
            />
            <SignupInput 
              label="Water Intake (Liters per day)" icon={<Droplets size={18} />} 
              value={formData.waterIntake} onValueChange={(v) => handleValueChange('waterIntake', v)}
              onBlur={() => handleBlur('waterIntake')}
              error={errors.waterIntake} success={touched.waterIntake && formData.waterIntake && !errors.waterIntake}
              placeholder="Daily average"
            />
            <SignupInput 
              label="Sleep Duration (Hours)" icon={<Coffee size={18} />} 
              value={formData.sleepHours} onValueChange={(v) => handleValueChange('sleepHours', v)}
              onBlur={() => handleBlur('sleepHours')}
              error={errors.sleepHours} success={touched.sleepHours && formData.sleepHours && !errors.sleepHours}
              type="number" placeholder="Hours per night"
            />
            <SignupSelect 
              label="Stress Level" icon={<Activity size={18} />}
              value={formData.stressLevel} onValueChange={(v) => handleValueChange('stressLevel', v)}
              onBlur={() => handleBlur('stressLevel')}
              error={errors.stressLevel} success={touched.stressLevel && !errors.stressLevel}
              options={[{label: 'Low', value: 'low'}, {label: 'Medium', value: 'medium'}, {label: 'High', value: 'high'}]}
            />
          </FormSection>

          {/* Section 4: Food Preferences */}
          <FormSection title="Diet Preferences" icon={<Apple size={20} />}>
            <SignupSelect 
              label="Diet Type" icon={<Apple size={18} />}
              value={formData.foodType} onValueChange={(v) => handleValueChange('foodType', v)}
              onBlur={() => handleBlur('foodType')}
              error={errors.foodType} success={touched.foodType && !errors.foodType}
              options={[{label: 'Veg / Non-Veg / Vegan', value: 'veg'}, {label: 'Non-Vegetarian', value: 'non-veg'}, {label: 'Vegan', value: 'vegan'}]}
            />
            <SignupInput 
              label="Favorite Foods" icon={<Medal size={18} />} 
              value={formData.favoriteFoods} onValueChange={(v) => handleValueChange('favoriteFoods', v)}
              onBlur={() => handleBlur('favoriteFoods')}
              error={errors.favoriteFoods} success={touched.favoriteFoods && formData.favoriteFoods && !errors.favoriteFoods}
              placeholder="Foods you love"
            />
            <SignupInput 
              label="Foods to Avoid" icon={<AlertCircle size={18} />} 
              value={formData.foodsToAvoid} onValueChange={(v) => handleValueChange('foodsToAvoid', v)}
              onBlur={() => handleBlur('foodsToAvoid')}
              error={errors.foodsToAvoid} success={touched.foodsToAvoid && formData.foodsToAvoid && !errors.foodsToAvoid}
              placeholder="To be avoided"
            />
          </FormSection>

          {/* Section 5: Fitness Details */}
          <FormSection title="Fitness Goals" icon={<Medal size={20} />}>
            <SignupSelect 
              label="Goal" icon={<Medal size={18} />}
              value={formData.fitnessGoal} onValueChange={(v) => handleValueChange('fitnessGoal', v)}
              onBlur={() => handleBlur('fitnessGoal')}
              error={errors.fitnessGoal} success={touched.fitnessGoal && !errors.fitnessGoal}
              options={[
                {label: 'Weight Loss', value: 'weight-loss'},
                {label: 'Muscle Gain', value: 'muscle-gain'},
                {label: 'Maintenance', value: 'maintenance'}
              ]}
            />
            <SignupInput 
              label="Meals per Day" icon={<Apple size={18} />} 
              value={formData.mealFrequency} onValueChange={(v) => handleValueChange('mealFrequency', v)}
              onBlur={() => handleBlur('mealFrequency')}
              error={errors.mealFrequency} success={touched.mealFrequency && formData.mealFrequency && !errors.mealFrequency}
              type="number" placeholder="Meals per cycle"
            />
            <SignupInput 
              label="Workout Preference" icon={<Activity size={18} />} 
              value={formData.workoutPreference} onValueChange={(v) => handleValueChange('workoutPreference', v)}
              onBlur={() => handleBlur('workoutPreference')}
              error={errors.workoutPreference} success={touched.workoutPreference && !errors.workoutPreference}
              placeholder="Gym, Yoga, etc."
            />
            <SignupInput 
              label="Target Weight" icon={<Weight size={18} />} 
              value={formData.targetWeight} onValueChange={(v) => handleValueChange('targetWeight', v)}
              onBlur={() => handleBlur('targetWeight')}
              error={errors.targetWeight} success={touched.targetWeight && formData.targetWeight && !errors.targetWeight}
              type="number" placeholder="Desired mass (kg)"
            />
          </FormSection>

          <div className="flex flex-col gap-6 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="relative py-6 rounded-[2rem] bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-[0.3em] text-sm transition-all shadow-[0_20px_40px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 overflow-hidden group flex items-center justify-center gap-3"
            >
              <span className="relative z-10 flex items-center gap-3">
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-white/20 to-teal-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
            <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors">Login</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default React.memo(Signup);
