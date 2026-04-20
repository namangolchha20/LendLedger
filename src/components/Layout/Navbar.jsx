import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LayoutDashboard, CreditCard, Users, UserCircle, LogOut, Menu, X, Sun, Moon, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { logout, user, userName } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/loans', label: 'Loans', icon: CreditCard },
    { path: '/borrowers', label: 'Borrowers', icon: Users },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    const result = await logout();
    if (result.success) {
      toast.success('Logged out safely');
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  // Fallback for username display
  const displayUserName = userName || user?.email?.split('@')[0] || 'User';
  const userInitial = displayUserName[0]?.toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-all duration-300">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[var(--text-primary)]">LendLedger</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="h-8 w-px bg-[var(--border-color)] mx-4" />

            <div className="flex items-center space-x-6">
              {/* Premium Theme Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="w-14 h-7 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full relative transition-all duration-500 hover:scale-105 active:scale-95 group"
              >
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${darkMode ? 'translate-x-7 bg-indigo-500' : 'translate-x-0 bg-amber-400'}`}>
                  {darkMode ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-white" />}
                </div>
                <div className="flex justify-between px-2 w-full">
                  <Sun className={`w-3 h-3 transition-opacity duration-300 ${darkMode ? 'opacity-20' : 'opacity-0'}`} />
                  <Moon className={`w-3 h-3 transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-20'}`} />
                </div>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-2xl hover:bg-[var(--bg-input)] transition-all border border-transparent hover:border-[var(--border-color)] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-[var(--border-color)] flex items-center justify-center text-blue-500 font-black shadow-inner overflow-hidden group-hover:scale-105 transition-transform">
                    {userInitial}
                  </div>
                  <div className="text-left hidden lg:block pr-2">
                    <div className="text-sm font-black text-[var(--text-primary)] tracking-tight leading-none mb-0.5">{displayUserName}</div>
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">Verified Account</div>
                  </div>
                </button>

                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 glass-card border border-[var(--border-color)] shadow-2xl py-2 z-20 animate-fade-in">
                      <div className="px-4 py-3 border-b border-[var(--border-color)] mb-1">
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-sm font-black text-[var(--text-primary)] truncate">{user?.email}</p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-black text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/5 transition-all"
                      >
                        <UserCircle className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-[11px]">Personal Profile</span>
                      </Link>
                      
                      <div className="h-px bg-[var(--border-color)] my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-black text-rose-500 hover:bg-rose-500/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="uppercase tracking-widest text-[11px]">Terminate Session</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
             <button 
                onClick={toggleDarkMode}
                className="w-12 h-6 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full relative transition-all duration-500"
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${darkMode ? 'translate-x-6 bg-indigo-500' : 'translate-x-0 bg-amber-400'}`}>
                  {darkMode ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-white" />}
                </div>
              </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[var(--text-muted)]">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-[var(--border-color)] space-y-2 animate-fade-in">
            <div className="px-4 py-4 mb-4 bg-[var(--bg-input)] rounded-2xl border border-[var(--border-color)] flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xl">
                {userInitial}
              </div>
              <div>
                <p className="text-sm font-black text-[var(--text-primary)]">{displayUserName}</p>
                <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
              </div>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  isActive(item.path)
                    ? 'bg-[var(--active-bg)] text-[var(--active-text)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--active-bg)] hover:text-[var(--active-text)]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="h-px bg-[var(--border-color)] my-4" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>


  );
};


export default Navbar;