import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  CreditCard, 
  ShieldCheck, 
  BarChart3, 
  Users2, 
  ArrowRight,
  UserPlus
} from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    
    setLoading(true);
    const result = await signup(email, password, name);
    if (result.success) {
      toast.success('Account created! Welcome to LendLedger.');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const features = [
    { icon: CreditCard, text: "Track loans effortlessly" },
    { icon: BarChart3, text: "Monitor repayments" },
    { icon: Users2, text: "Identify risky borrowers" },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] overflow-hidden">
      {/* Left Side: Brand & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-blue-900 to-[#0a0b10] p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-20" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[160px] opacity-20" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 group w-fit">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">LendLedger</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Scale your lending<br />
            <span className="text-indigo-400">with confidence.</span>
          </h2>
          
          <div className="space-y-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                  <feature.icon className="w-5 h-5" />
                </div>
                <p className="text-lg font-medium text-slate-300">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>No credit card required to start</span>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-8 flex justify-center">
             <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">LendLedger</span>
            </div>
          </div>

          <div className="glass-card p-8 sm:p-10">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">Create Account</h1>
              <p className="text-[var(--text-secondary)] font-medium">Join 1,000+ lenders managing portfolios</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-premium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-4 h-14"
              >
                <span className="font-black uppercase tracking-widest">{loading ? 'Creating Account...' : 'Get Started'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--text-secondary)] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 font-bold hover:text-blue-600 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;