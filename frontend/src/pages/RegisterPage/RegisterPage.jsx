import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingPanchayats, setLoadingPanchayats] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  //  fetchStates().then(setStates).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedState) { setDistricts([]); setSelectedDistrict(''); return; }
    setLoadingDistricts(true);
    setSelectedDistrict(''); setSelectedPanchayat(''); setSelectedWard('');
    setPanchayats([]); setWards([]);
    // fetchDistricts(selectedState).then(setDistricts).catch(console.error).finally(() => setLoadingDistricts(false));
  }, [selectedState]);

  useEffect(() => {
    if (!selectedDistrict) { setPanchayats([]); setSelectedPanchayat(''); return; }
    setLoadingPanchayats(true);
    setSelectedPanchayat(''); setSelectedWard(''); setWards([]);
    // fetchPanchayats(selectedDistrict).then(setPanchayats).catch(console.error).finally(() => setLoadingPanchayats(false));
  }, [selectedDistrict]);

  useEffect(() => {
    if (!selectedPanchayat) { setWards([]); setSelectedWard(''); return; }
    setLoadingWards(true);
    setSelectedWard('');
    // fetchWards(selectedPanchayat).then(setWards).catch(console.error).finally(() => setLoadingWards(false));
  }, [selectedPanchayat]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (mobile.length !== 10) { setError('Please enter a valid 10-digit mobile number.'); return; }
    if (!selectedWard) { setError('Please select your ward.'); return; }
    if (!address.trim()) { setError('Please enter your residential address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please agree to Terms of Service and Privacy Policy.'); return; }
    setLoading(true);
    // await registerUser(...); navigate('/login');
    setLoading(false);
  };

  const EyeIcon = ({ visible }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {visible
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
      }
    </svg>
  );

  return (
    <div className="register-page">
      <header className="register-header">
        <Link to="/login" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Login
        </Link>
      </header>

      <main className="register-main">
        {/* Left green accent panel */}
        <aside className="register-aside">
          <div className="register-aside-logo">🏛️</div>
          <h2 className="register-aside-heading">Create Your<br />Portal Account</h2>

          <div className="register-aside-steps">
            <div className="register-step">
              <div className="register-step-dot">1</div>
              <div className="register-step-label">
                <strong>Personal Details</strong>
                Name & mobile number
              </div>
            </div>
            <div className="register-step">
              <div className="register-step-dot">2</div>
              <div className="register-step-label">
                <strong>Location</strong>
                State, district & ward
              </div>
            </div>
            <div className="register-step">
              <div className="register-step-dot">3</div>
              <div className="register-step-label">
                <strong>Set Password</strong>
                Secure your account
              </div>
            </div>
            <div className="register-step">
              <div className="register-step-dot">✓</div>
              <div className="register-step-label">
                <strong>All Done</strong>
                Start using the portal
              </div>
            </div>
          </div>

          <div className="register-aside-bottom">
            <span className="register-aside-flag">🇮🇳</span>
            <span className="register-aside-powered">Powered by Digital India</span>
          </div>
        </aside>

        {/* Right form content */}
        <div className="register-content">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Fill in the details below to register on the portal</p>

          <form className="register-card" onSubmit={handleRegister}>
            {error && <div className="form-error">{error}</div>}

            {/* — Personal Details — */}
            <div className="form-section-label">Personal Details</div>

            <div className="form-group">
              <label className="form-label">Full Name (as per Aadhaar) <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="input-prefix">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  +91
                </span>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter 10-digit number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/, '').slice(0, 10))}
                  maxLength={10}
                />
              </div>
            </div>

            {/* — Location — */}
            <div className="form-section-label" style={{ marginTop: 4 }}>Location</div>

            <div className="form-group">
              <label className="form-label">State <span className="required">*</span></label>
              <div className="input-wrapper select-wrapper">
                <span className="input-prefix-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <select className="form-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                  <option value="">Select state...</option>
                  {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">District <span className="required">*</span></label>
              <div className="input-wrapper select-wrapper">
                <span className="input-prefix-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <select className="form-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedState || loadingDistricts}>
                  <option value="">{loadingDistricts ? 'Loading...' : 'Select district...'}</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Gram Panchayat <span className="required">*</span></label>
              <div className="input-wrapper select-wrapper">
                <span className="input-prefix-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <select className="form-select" value={selectedPanchayat} onChange={(e) => setSelectedPanchayat(e.target.value)} disabled={!selectedDistrict || loadingPanchayats}>
                  <option value="">{loadingPanchayats ? 'Loading...' : 'Select panchayat...'}</option>
                  {panchayats.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Your Ward <span className="required">*</span></label>
              <div className="input-wrapper select-wrapper">
                <span className="input-prefix-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <select className="form-select" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedPanchayat || loadingWards}>
                  <option value="">{loadingWards ? 'Loading...' : 'Select ward...'}</option>
                  {wards.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>

            {/* — Security — */}
            <div className="form-section-label" style={{ marginTop: 4 }}>Security</div>

            <div className="form-group">
              <label className="form-label">Create Password <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="input-suffix" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input type={showConfirmPassword ? 'text' : 'password'} className="form-input" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="button" className="input-suffix" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>

            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>

            <p className="already-registered">
              Already registered? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}