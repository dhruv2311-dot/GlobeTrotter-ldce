import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ButtonSpinner } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './Auth.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const fillDemo = () => {
    setForm({
      email: 'demo@globetrotter.com',
      password: 'Demo@123456',
    });
    toast.success('Demo credentials loaded!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      toast.success('Welcome back to GlobeTrotter! ✈️');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
      </div>

      <div className="auth-layout">
        <div className="auth-aside">
          <span className="auth-aside-kicker"><Sparkles size={14} /> GlobeTrotter Travel Planner</span>
          <h2>Turn every destination into a plan worth remembering.</h2>
          <p>Build day-by-day itineraries, compare destinations, and keep your travel budget in view from one calm workspace.</p>
          <ul className="auth-benefits">
            <li><CheckCircle2 size={16} /> Plan trips around real dates and cities</li>
            <li><CheckCircle2 size={16} /> Save activities, costs, and travel notes</li>
            <li><CheckCircle2 size={16} /> Share polished itineraries with your community</li>
          </ul>
        </div>
        <Motion.div
          className="auth-container"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="auth-card glass-card">
          {/* Brand Header */}
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">
                <img src="/logo.svg" alt="GlobeTrotter" />
              </div>
              <span className="auth-logo-text">Globe<span>Trotter</span></span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Access your luxury travel itineraries & destination plans</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                <Mail size={15} /> Email Address
              </label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">
                  <Lock size={15} /> Password
                </label>
              </div>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <ButtonSpinner /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Demo Filler */}
          <button type="button" className="demo-fill-card" onClick={fillDemo}>
            Test credentials
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Create account free</Link>
            </p>
          </div>
        </div>
        </Motion.div>
      </div>
    </div>
  );
}
