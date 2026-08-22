import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Globe, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, Camera, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { ButtonSpinner } from '../../components/common/Loader';
import toast from 'react-hot-toast';
import './Auth.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', country: '', password: '', confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'confirmPassword') fd.append(k, v);
    });
    if (profileImage) fd.append('profileImage', profileImage);

    const result = await register(fd);
    if (result.success) {
      toast.success('Account created! Please sign in with your credentials');
      navigate('/login');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
      </div>

      <div className="auth-layout">
        <div className="auth-aside">
          <span className="auth-aside-kicker"><Globe size={14} /> Start your travel workspace</span>
          <h2>One place for the trips you have planned and the places you have not seen yet.</h2>
          <p>Create a personal travel profile, organize destinations, and shape each journey around your own pace.</p>
          <ul className="auth-benefits">
            <li><CheckCircle2 size={16} /> Keep every itinerary easy to find</li>
            <li><CheckCircle2 size={16} /> Add cities, activities, dates, and budgets</li>
            <li><CheckCircle2 size={16} /> Discover ideas shared by other travelers</li>
          </ul>
        </div>
        <Motion.div
          className="auth-container auth-container-wide"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="auth-card glass-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">
                <img src="/logo.svg" alt="GlobeTrotter" />
              </div>
              <span className="auth-logo-text">Globe<span>Trotter</span></span>
            </Link>
            <h1>Start Your Journey</h1>
            <p>Join thousands of global travelers planning dream itineraries</p>
          </div>

          {/* Profile Photo Selector */}
          <div className="avatar-upload">
            <label className="avatar-upload-wrapper">
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <img 
                src={preview || getAvatarUrl(form.firstName, form.lastName)} 
                alt="Avatar" 
                className="avatar avatar-xl avatar-upload-img" 
              />
              <div style={{
                position: 'absolute',
                bottom: 0, right: 0,
                background: '#714B67',
                padding: '0.4rem',
                borderRadius: '50%',
                color: '#212529',
                display: 'flex',
                boxShadow: '0 0 10px rgba(113, 75, 103, 0.5)'
              }}>
                <Camera size={16} />
              </div>
            </label>
            <p style={{ fontSize: '0.8rem', color: '#495057', marginTop: '0.5rem' }}>
              {preview ? 'Photo attached' : 'Click camera icon to upload custom photo'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><User size={15} /> First Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="John" value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label"><User size={15} /> Last Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="Doe" value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Mail size={15} /> Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><Phone size={15} /> Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input type="tel" className="form-control" placeholder="+1 234 567 890" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label"><MapPin size={15} /> City</label>
                <div className="input-wrapper">
                  <MapPin size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="New York" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Globe size={15} /> Country</label>
              <div className="input-wrapper">
                <Globe size={16} className="input-icon" />
                <input type="text" className="form-control" placeholder="United States" value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label"><Lock size={15} /> Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Min 6 characters"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: '3rem' }} />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label"><Lock size={15} /> Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Repeat password"
                    value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <ButtonSpinner /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already registered? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
        </Motion.div>
      </div>
    </div>
  );
}
