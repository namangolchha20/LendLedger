import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const sections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { 
          label: 'Interface Theme', 
          description: 'Customize how LendLedger looks on your device.',
          action: (
            <button 
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--bg-secondary)] transition-all"
            >
              {darkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          )
        }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { 
          label: 'Two-Factor Authentication', 
          description: 'Add an extra layer of security to your account.',
          action: (
            <div className="w-12 h-6 bg-[var(--border-color)] rounded-full relative cursor-not-allowed opacity-50">
              <div className="absolute left-1 top-1 w-4 h-4 bg-[var(--text-muted)] rounded-full shadow-sm" />
            </div>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { 
          label: 'WhatsApp Reminders', 
          description: 'Receive alerts when loan repayments are due.',
          action: (
            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">System Configuration</h1>
        <p className="text-[var(--text-secondary)] mt-2 font-medium text-lg">Manage your workspace preferences and security protocols.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="glass-card overflow-hidden">
            <div className="p-8 border-b border-[var(--border-color)] flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <section.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{section.title}</h2>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {section.items.map((item, i) => (
                <div key={i} className="p-8 flex items-center justify-between group hover:bg-[var(--bg-input)]/50 transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-[var(--text-muted)] font-medium">{item.description}</p>
                  </div>
                  {item.action}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
