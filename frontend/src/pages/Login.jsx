import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeFor, useAuth } from '../auth/AuthContext';
import { Field, Notice } from '../components/ui';
import { errMsg } from '../utils';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await login(email, password);
      navigate(data.mustChangePassword ? '/change-password' : homeFor(data.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-side">
        <h1>Klausurverwaltung</h1>
        <p>Klausuren, Prüfungen und Noten in einer Anwendung</p>
      </div>
      <div className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <div> 
            <h2>Anmeldung</h2>Die Konten werden von der Administration erstellt.
            <p className="muted"></p>
          </div>
          <Notice kind="error">{error}</Notice>
          <Field label="Adresse e-mail">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </Field>
          <Field label="Mot de passe">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Anmeldung…' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
