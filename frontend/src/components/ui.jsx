import { useState } from 'react';

export function PageHeader({ title, sub, children }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </div>
  );
}

export function Notice({ kind = 'info', children }) {
  if (!children) return null;
  return (
    <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}

const LABELS = {
  ANGEMELDET: 'Angemeldet',
  ABGEMELDET: 'Abgemeldet',
  OPEN: 'Ouvert',
  CLOSED: 'Clôturé',
  GRADED: 'Noté',
};
const SOLID = ['ANGEMELDET', 'OPEN'];

export function Badge({ status }) {
  const cls = SOLID.includes(status) ? 'badge-solid' : status === 'GRADED' ? 'badge-tint' : 'badge-outline';
  return <span className={`badge ${cls}`}>{LABELS[status] ?? status}</span>;
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function State({ loading, error, empty, emptyText }) {
  if (loading) return <p className="muted pad">Wird geladen…</p>;
  if (error) return <Notice kind="error">{error}</Notice>;
  if (empty) return <p className="muted pad">{emptyText}</p>;
  return null;
}

// Affiche le mot de passe temporaire renvoyé une seule fois par l'admin
export function TempPassword({ account, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!account) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.temporaryPassword);
      setCopied(true);
    } catch {
      /* presse-papier indisponible */
    }
  };
  return (
    <div className="temp-box">
      <p>
        Konto erstellt für <strong>{account.email}</strong>. Dieses temporäre Passwort wird nicht
        erneut angezeigt: Gib es jetzt weiter.
      </p>
      <div className="temp-row">
        <code>{account.temporaryPassword}</code>
        <button type="button" className="btn btn-secondary" onClick={copy}>
          {copied ? 'Kopiert' : 'Kopieren'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Schließen
        </button>
      </div>
    </div>
  );
}
