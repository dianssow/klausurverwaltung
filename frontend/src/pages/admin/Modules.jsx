import { useState } from 'react';
import api, { get } from '../../api/client';
import { Field, Notice, PageHeader, State } from '../../components/ui';
import { useForm, useLoad } from '../../hooks';
import { asList, errMsg } from '../../utils';

const EMPTY = { code: '', name: '', credits: 6, recommendedSemester: 1, maxAttempts: 3, departmentId: '', professorId: '' };

export default function Modules() {
  const depts = useLoad(() => get('/api/admin/departments'));
  const profs = useLoad(() => get('/api/admin/professors'));
  const list = useLoad(() => get('/api/admin/modules'));
  const [form, bind, reset, setForm] = useForm(EMPTY);
  const [msg, setMsg] = useState(null);

  const departments = asList(depts.data).filter((d) => d.active !== false);
  // Un module ne peut être assigné qu'à un professeur du même département
  const professors = asList(profs.data).filter(
    (p) => p.active !== false && String(p.departmentId) === String(form.departmentId)
  );
  const rows = asList(list.data);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api.post('/api/admin/modules', {
        ...form,
        credits: Number(form.credits),
        recommendedSemester: Number(form.recommendedSemester),
        maxAttempts: Number(form.maxAttempts),
        departmentId: Number(form.departmentId),
        professorId: Number(form.professorId),
      });
      setMsg({ kind: 'ok', text: `Module ${form.code} créé.` });
      reset();
      list.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    }
  };

  return (
    <>
      <PageHeader title="Modules" sub="Le catalogue est géré ici ; le professeur responsable crée ensuite les examens." />

      <form className="panel" onSubmit={submit}>
        <h2>Neues Modul</h2>
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        <div className="form-grid">
          <Field label="Code" hint="Ex. INF101"><input {...bind('code')} required /></Field>
          <Field label="Intitulé"><input {...bind('name')} required /></Field>
          <Field label="Crédits (CP)"><input type="number" min="1" {...bind('credits')} required /></Field>
          <Field label="Semestre recommandé"><input type="number" min="1" {...bind('recommendedSemester')} required /></Field>
          <Field label="Tentatives maximum"><input type="number" min="1" {...bind('maxAttempts')} required /></Field>
          <Field label="Département">
            <select
              value={form.departmentId}
              onChange={(e) => setForm((v) => ({ ...v, departmentId: e.target.value, professorId: '' }))}
              required
            >
              <option value="">Bitte auswählen…</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Professeur responsable" hint="Limité au département choisi.">
            <select {...bind('professorId')} required disabled={!form.departmentId}>
              <option value="">Bitte auswählen…</option>
              {professors.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </Field>
        </div>
        <button className="btn btn-primary">Modul erstellen</button>
      </form>

      <div className="panel flush">
        <div className="panel-title">Vorhandene Module</div>
        <State loading={list.loading} error={list.error} empty={rows.length === 0} emptyText="Aucun module pour l'instant." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Code</th><th>Modulname</th><th className="num">LP</th><th className="num">Sem.</th><th className="num">Versuche</th><th>Fachbereich</th><th>Lehrkraft</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td>{m.code}</td>
                    <td>{m.name}</td>
                    <td className="num">{m.credits}</td>
                    <td className="num">{m.recommendedSemester}</td>
                    <td className="num">{m.maxAttempts}</td>
                    <td>{m.departmentName}</td>
                    <td>{m.professorFirstName} {m.professorLastName}</td>
                    <td>{m.active ? 'Aktiv' : 'Inaktiv'}</td>
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
