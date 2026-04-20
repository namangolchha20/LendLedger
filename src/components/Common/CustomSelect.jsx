import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder = "Select an option", label, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">
          {label} {required && <span className="text-blue-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`input-premium flex items-center justify-between cursor-pointer ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : ''}`}
        >
          <span className={`text-sm font-semibold ${!selectedOption ? 'text-[var(--text-muted)] opacity-50' : 'text-[var(--text-primary)]'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="select-menu">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`select-option ${value === option.value ? 'bg-[var(--active-bg)] text-[var(--active-text)]' : ''}`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
