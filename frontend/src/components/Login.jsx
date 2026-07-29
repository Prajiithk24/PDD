import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { தரவை_அனுப்பு } from '../lib/api';

function profileFromUser(user) {
  return {
    பெயர்: user.fullName || user.username,
    கைபேசி: user.mobileNumber || '',
    ஊர்: user.village || '',
    மாவட்டம்: user.district || '',
  };
}

function saveSession(payload) {
  localStorage.setItem('auth-token', payload.token);
  localStorage.setItem('user', JSON.stringify(payload.user));
  localStorage.setItem('grama-profile', JSON.stringify(profileFromUser(payload.user)));
}

function isAdminRole(role) {
  return role === 'ADMIN' || role === 'OFFICER';
}

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('citizen'); // 'citizen' or 'official'
  const [mode, setMode] = useState('login'); // 'login' or 'register' (register only available for citizen)
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    mobileNumber: '',
    village: '',
    district: '',
  });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus('');
    try {
      const isRegister = userType === 'citizen' && mode === 'register';
      const payload = isRegister
        ? form
        : { username: form.username, password: form.password };
      const response = await தரவை_அனுப்பு(`/auth/${isRegister ? 'register' : 'login'}`, payload);
      saveSession(response);
      navigate(isAdminRole(response.user.role) ? '/நிர்வாக-முகப்பு' : '/');
    } catch (error) {
      if (mode === 'register' && error.response?.status === 409) {
        setStatus('இந்த பயனர் பெயர் அல்லது கைபேசி ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.');
      } else {
        setStatus(error.response?.data?.message || 'உள்நுழைவு விவரங்களை சரிபார்க்கவும்.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-panel" aria-label="Login">
        <div className="login-brand">
          <div className="login-emblem">{userType === 'official' ? 'அ' : 'கி'}</div>
          <div>
            <p>தமிழ் குரல் வழிக் குறைதீர் சேவை தளம்</p>
            <h2>{userType === 'official' ? 'அரசுத் துறை / நிர்வாக உள்நுழைவு' : 'பொதுமக்கள் உள்நுழைவு'}</h2>
          </div>
        </div>

        {/* 1. Main Category Tabs: Citizen vs Department Official */}
        <div className="login-tabs" role="tablist" aria-label="User category">
          <button
            type="button"
            className={userType === 'citizen' ? 'active' : ''}
            onClick={() => {
              setUserType('citizen');
              setMode('login');
              setStatus('');
            }}
          >
            👤 பொதுமக்கள் (Citizens)
          </button>
          <button
            type="button"
            className={userType === 'official' ? 'active' : ''}
            onClick={() => {
              setUserType('official');
              setMode('login');
              setStatus('');
            }}
          >
            🏛️ துறை அலுவலர்கள் (Departments)
          </button>
        </div>

        {/* 2. Secondary Tabs: Login vs Register (ONLY for Citizens) */}
        {userType === 'citizen' && (
          <div className="login-tabs" role="tablist" aria-label="Account mode" style={{ marginTop: '10px' }}>
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => { setMode('login'); setStatus(''); }}
            >
              உள்நுழைவு (Login)
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => { setMode('register'); setStatus(''); }}
            >
              புதிய கணக்கு (Sign Up)
            </button>
          </div>
        )}

        {userType === 'official' && (
          <p className="login-hint" style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
            அரசுத்துறை அலுவலர்கள் மற்றும் நிர்வாகிகளுக்கான பிரத்யேக உள்நுழைவு பக்கம்.
          </p>
        )}

        <form className="login-form" onSubmit={submit} style={{ marginTop: '16px' }}>
          <label>
            <span>பயனர் பெயர் (Username)</span>
            <input
              type="text"
              value={form.username}
              onChange={(event) => update({ username: event.target.value })}
              placeholder={userType === 'official' ? 'எ.கா: water_kallakurichi, roads_chennai...' : 'உங்கள் பயனர் பெயரை உள்ளிடவும்'}
              required
            />
          </label>

          <label>
            <span>கடவுச்சொல் (Password)</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => update({ password: event.target.value })}
              placeholder="உங்கள் கடவுச்சொல்லை உள்ளிடவும்"
              required
            />
          </label>

          {userType === 'citizen' && mode === 'register' && (
            <>
              <label>
                <span>முழு பெயர் (Full Name)</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) => update({ fullName: event.target.value })}
                  placeholder="உங்கள் முழு பெயர்"
                  required
                />
              </label>
              <label>
                <span>கைபேசி எண் (Mobile Number)</span>
                <input
                  type="tel"
                  value={form.mobileNumber}
                  onChange={(event) => update({ mobileNumber: event.target.value })}
                  placeholder="10 இலக்க கைபேசி எண்"
                  pattern="\d{10}"
                  required
                />
              </label>
              <label>
                <span>ஊர் (Village)</span>
                <input
                  type="text"
                  value={form.village}
                  onChange={(event) => update({ village: event.target.value })}
                  placeholder="ஊர் பெயர்"
                />
              </label>
              <label>
                <span>மாவட்டம் (District)</span>
                <input
                  type="text"
                  value={form.district}
                  onChange={(event) => update({ district: event.target.value })}
                  placeholder="மாவட்டம்"
                />
              </label>
            </>
          )}

          {status && (
            <div className="login-error">
              <p>{status}</p>
              {userType === 'citizen' && mode === 'register' && status.includes('ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது') && (
                <button
                  type="button"
                  className="attachment-button attachment-button-primary"
                  style={{ marginTop: '10px' }}
                  onClick={() => { setMode('login'); setStatus(''); }}
                >
                  உள்நுழையவும் (Login)
                </button>
              )}
            </div>
          )}

          <button type="submit" className="login-submit" disabled={busy}>
            {busy ? 'சரிபார்க்கிறது...' : (userType === 'citizen' && mode === 'register') ? 'பதிவு செய் (Sign Up)' : 'உள்நுழை (Login)'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Login;
