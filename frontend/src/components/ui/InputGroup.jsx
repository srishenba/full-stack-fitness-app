import React from 'react';

function InputGroup({
  label,
  type = 'text',
  value,
  onValueChange,
  icon,
  rightIcon,
  onRightIconClick,
  placeholder,
  required = true,
  autoComplete,
  name,
  id,
  inputClassExtra,
  error,
  success,
  containerClass = "",
}) {
  const inputId = id || (name ? `field-${name}` : undefined);

  // Common styles extracted
  const baseInputClass = "w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:outline-none transition-all font-bold text-sm";
  
  const borderClass = error 
    ? "border-red-500 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
    : success
    ? "border-green-500 focus:border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
    : "border-white/10 focus:border-teal-500/50 focus:bg-teal-500/5";

  const iconColorClass = error 
    ? "text-red-500" 
    : success 
    ? "text-green-500" 
    : "text-slate-500 group-focus-within:text-teal-400";

  return (
    <div className={`space-y-2 ${containerClass}`}>
      <label
        htmlFor={inputId}
        className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2"
      >
        {label}
      </label>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all font-black ${iconColorClass}`}>
          {icon}
        </div>
        <input
          id={inputId}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${baseInputClass} ${borderClass} ${inputClassExtra || ""}`}
          placeholder={placeholder}
        />
        {rightIcon && (
          <div 
            onClick={onRightIconClick}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all cursor-pointer p-1 ${error ? "text-red-500/60 hover:text-red-400" : success ? "text-green-500/60 hover:text-green-400" : "text-slate-500 hover:text-teal-400"}`}
          >
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(InputGroup);
