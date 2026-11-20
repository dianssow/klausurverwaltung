import { useState } from 'react';
import api, { get } from '../../api/client';
import { Field, Notice, PageHeader, State, TempPassword } from '../../components/ui';
import { useForm, useLoad } from '../../hooks';
import { asList, errMsg } from '../../utils';

export default function Professors() {
  const depts = useLoad(() => get('/api/admin/departments'));
  const list = useLoad(() => get('/api/admin/professors'));
  const [form, bind, reset] = useForm({ email: '', firstName: '', lastName: '', code: '', departmentId: '' });
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);
  const [q, setQ] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setCreated(null);
    try {
      const { data } = await api.post('/api/admin/professors', { ...form, departmentId: Number(form.departmentId) });
      setCreated(data);
      reset();
      list.reload();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const departments = asList(depts.data).filter((d) => d.active !== false);
  const rows = asList(list.data).filter((p) =>
    `${p.firstName} ${p.lastName} ${p.email ?? ''} ${p.code}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Professeurs" sub="Un mot de passe temporaire est généré à la création du compte." />

      <TempPassword account={created} onClose={() => setCreated(null)} />

      <form className="panel" onSubmit={submit}>
        <h2>Neuer Professor</h2>
        <Notice kind="error">{error}</Notice>
        <div className="form-grid">
          <Field label="Adresse e-mail"><input type="email" {...bind('email')} required /></Field>
          <Field label="Prénom"><input {...bind('firstName')} required /></Field>
          <Field label="Nom"><input {...bind('lastName')} required /></Field>
          <Field label="Code professeur"><input {...bind('code')} required /></Field>
          <Field label="Département">
            <select {...bind('departmentId')} required>
              <option value="">Bitte auswählen…</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
        </div>
        <button className="btn btn-primary">Konto erstellen</button>
      </form>

      <div className="panel flush">
        <div className="panel-title">
          Vorhandene Professoren
          <input className="search" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <State loading={list.loading} error={list.error} empty={rows.length === 0} emptyText="Aucun professeur trouvé." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Code</th><th>Name</th><th>E-Mail</th><th>Fachbereich</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td>{p.code}</td>
                    <td>{p.firstName} {p.lastName}</td>
                    <td>{p.email ?? '–'}</td>
                    <td>{p.departmentName ?? '–'}</td>
                    <td>{p.active === false ? 'Inaktiv' : 'Aktiv'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
