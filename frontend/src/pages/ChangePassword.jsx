import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { homeFor, useAuth } from '../auth/AuthContext';
import { Field, Notice } from '../components/ui';
import { errMsg } from '../utils';

export default function ChangePassword() {
  const { user, passwordChanged, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) return setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
    if (newPassword !== confirm) return setError('Les deux mots de passe ne correspondent pas.');
    setBusy(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      passwordChanged();
      navigate(homeFor(user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-side">
        <h1>Neues Passwort</h1>
        <p>
          {user.mustChangePassword
            ? 'Ersetze bei deiner ersten Anmeldung das temporäre Passwort durch ein eigenes.'
            : 'Wähle ein Passwort, das du nirgendwo sonst verwendest.'}
        </p>
      </div>
      <div className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <Notice kind="error">{error}</Notice>
          <Field label="Mot de passe actuel">
            <input type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required autoFocus />
          </Field>
          <Field label="Nouveau mot de passe" hint="8 caractères minimum, différent de l'actuel.">
            <input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} required />
          </Field>
          <Field label="Confirmer le nouveau mot de passe">
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </Field>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Wird gespeichert…' : 'Passwort speichern'}
          </button>
          {user.mustChangePassword ? (
            <button type="button" className="btn btn-ghost" onClick={logout}>Abmelden</button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Abbrechen</button>
          )}
        </form>
      </div>
    </div>
  );
}
