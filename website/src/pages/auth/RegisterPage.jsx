import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, Upload } from 'lucide-react';
import useAuthStore from '../../store/authStore';
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
      toast.success('Account created! Please login with your credentials');
      navigate('/login');
    } else {
      toast.error(result.message);
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
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80" alt="" className="auth-bg-img" />
      </div>

      <motion.div
        className="auth-container auth-container-wide"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-card glass-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="logo-icon"><Globe size={22} /></div>
              <span>Globe<span style={{color:'var(--accent)'}}>Trotter</span></span>
            </Link>
            <h1>Start your journey</h1>
            <p>Create your free travel account</p>
          </div>

          {/* Avatar Upload */}
          <div className="avatar-upload">
            <label className="avatar-upload-label">
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              {preview ? (
                <img src={preview} alt="Preview" className="avatar avatar-xl" style={{border:'3px solid var(--primary)'}} />
              ) : (
                <div className="avatar-placeholder">
                  <Upload size={24} />
                  <span>Photo</span>
                </div>
              )}
            </label>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="John" value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="Doe" value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input type="tel" className="form-control" placeholder="+1 234 567 890" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <div className="input-wrapper">
                  <MapPin size={16} className="input-icon" />
                  <input type="text" className="form-control" placeholder="New York" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div className="input-wrapper">
                <Globe size={16} className="input-icon" />
                <input type="text" className="form-control" placeholder="United States" value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Min 6 characters"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{paddingRight:'3rem'}} />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="Repeat password"
                    value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}} /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
