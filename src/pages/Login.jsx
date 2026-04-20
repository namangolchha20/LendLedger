import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  LogIn, 
  CreditCard, 
  ShieldCheck, 
  BarChart3, 
  Users2, 
  Github, 
  Chrome,
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
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
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-900 to-[#0a0b10] p-12 flex-col justify-between overflow-hidden">
        {/* Abstract Background elements */}
        <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-20" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-20" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-[160px] opacity-20" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 group w-fit">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">LendLedger</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Smart Lending.<br />
            <span className="text-blue-400">Zero Chaos.</span>
          </h2>
          
          <div className="space-y-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-5 h-5" />
                </div>
                <p className="text-lg font-medium text-slate-300 group-hover:text-white transition-colors">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bank-grade security & encryption</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-overlay opacity-50 pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-12 flex justify-center">
             <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
               <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">LendLedger</span>
            </div>
          </div>

            <div className="glass-card p-8 sm:p-10">
            <div className="mb-10 text-center lg:text-left">
               <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">Welcome back</h1>
              <p className="text-[var(--text-secondary)] font-medium">Sign in to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
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
                <div className="flex justify-end px-1">
                  <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-4 h-14"
              >
                <span className="font-black uppercase tracking-widest">{loading ? 'Verifying...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

             <div className="my-8 flex items-center space-x-4">
               <div className="flex-1 h-px bg-[var(--border-color)]" />
               <span className="text-[10px] font-black text-[var(--text-muted)] tracking-widest uppercase">OR CONTINUE WITH</span>
               <div className="flex-1 h-px bg-[var(--border-color)]" />
             </div>

            <p className="mt-10 text-center text-sm text-[var(--text-secondary)] font-medium">
              New to LendLedger?{' '}
              <Link to="/signup" className="text-blue-500 font-bold hover:text-blue-600 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
