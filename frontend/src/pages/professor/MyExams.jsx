import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { get } from '../../api/client';
import { Badge, Field, Notice, PageHeader, State } from '../../components/ui';
import { useForm, useLoad } from '../../hooks';
import { errMsg, fmtDate, toInput, toIso } from '../../utils';

const EMPTY = {
  moduleId: '',
  term: '',
  examDate: '',
  examRoom: '',
  registrationDeadline: '',
  deregistrationDeadline: '',
  maxParticipants: '',
};

export default function MyExams() {
  const modules = useLoad(() => get('/api/professor/modules'));
  const exams = useLoad(() => get('/api/professor/exams'));
  const [form, bind, reset, setForm] = useForm(EMPTY);
  const [editing, setEditing] = useState(null); 
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);

  const activeModules = (modules.data ?? []).filter((m) => m.active);
  const rows = exams.data ?? [];

  const startCreate = () => {
    setEditing(null);
    reset();
    setMsg(null);
    setOpen(true);
  };

  const startEdit = (e) => {
    setEditing(e);
    setForm({
      moduleId: e.moduleId,
      term: e.term,
      examDate: toInput(e.examDate),
      examRoom: e.examRoom ?? '',
      registrationDeadline: toInput(e.registrationDeadline),
      deregistrationDeadline: toInput(e.deregistrationDeadline),
      maxParticipants: e.maxParticipants ?? '',
    });
    setMsg(null);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setMsg(null);
    const body = {
      examDate: toIso(form.examDate),
      examRoom: form.examRoom || null,
      registrationDeadline: toIso(form.registrationDeadline),
      deregistrationDeadline: toIso(form.deregistrationDeadline),
      maxParticipants: form.maxParticipants === '' ? null : Number(form.maxParticipants),
    };
    try {
      if (editing) {
        await api.put(`/api/professor/exams/${editing.id}`, body);
        setMsg({ kind: 'ok', text: 'Examen modifié.' });
      } else {
        await api.post('/api/professor/exams', { ...body, moduleId: Number(form.moduleId), term: form.term });
        setMsg({ kind: 'ok', text: 'Examen créé.' });
      }
      close();
      exams.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    }
  };

  const cancel = async (e) => {
    if (!window.confirm(`Annuler l'examen ${e.moduleCode} (${e.term}) ? Cette action est définitive.`)) return;
    try {
      await api.delete(`/api/professor/exams/${e.id}`);
      setMsg({ kind: 'ok', text: 'Examen annulé.' });
      exams.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    }
  };

  return (
    <>
      <PageHeader title="Mes examens" sub="Examens des modules dont tu es responsable.">
        {!open && <button className="btn btn-primary" onClick={startCreate}>Neue Prüfung</button>}
      </PageHeader>

      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

      {open && (
        <form className="panel" onSubmit={submit}>
          <h2>{editing ? `${editing.moduleCode} (${editing.term}) bearbeiten` : 'Neue Prüfung'}</h2>
          <div className="form-grid">
            <Field label="Module">
              <select {...bind('moduleId')} required disabled={!!editing}>
                <option value="">Bitte auswählen…</option>
                {activeModules.map((m) => <option key={m.id} value={m.id}>{m.code} · {m.name}</option>)}
              </select>
            </Field>
            <Field label="Semestre d'examen" hint="Ex. WS2026. Un seul examen par module et par semestre.">
              <input {...bind('term')} required maxLength={10} disabled={!!editing} />
            </Field>
            <Field label="Date et heure de l'examen" hint={editing ? 'Non modifiable si des étudiants sont inscrits.' : undefined}>
              <input type="datetime-local" {...bind('examDate')} required />
            </Field>
            <Field label="Salle"><input {...bind('examRoom')} /></Field>
            <Field label="Clôture des inscriptions"><input type="datetime-local" {...bind('registrationDeadline')} required /></Field>
            <Field label="Clôture des désinscriptions" hint="Au plus tard à la clôture des inscriptions.">
              <input type="datetime-local" {...bind('deregistrationDeadline')} required />
            </Field>
            <Field label="Places maximum" hint="Laisser vide pour ne pas limiter.">
              <input type="number" min="1" {...bind('maxParticipants')} />
            </Field>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary">{editing ? 'Änderungen speichern' : 'Prüfung erstellen'}</button>
            <button type="button" className="btn btn-ghost" onClick={close}>Abbrechen</button>
          </div>
        </form>
      )}

      <div className="panel flush">
        <State loading={exams.loading} error={exams.error} empty={rows.length === 0} emptyText="Tu n'as pas encore créé d'examen." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Modul</th><th>Semester</th><th>Datum</th><th>Raum</th><th>Anmeldefrist</th><th className="num">Angemeldet</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td><strong>{e.moduleCode}</strong><br /><span className="muted">{e.moduleName}</span></td>
                    <td>{e.term}</td>
                    <td>{fmtDate(e.examDate)}</td>
                    <td>{e.examRoom || '–'}</td>
                    <td>{fmtDate(e.registrationDeadline)}</td>
                    <td className="num">{e.registeredCount}{e.maxParticipants ? ` / ${e.maxParticipants}` : ''}</td>
                    <td><Badge status={e.status} /></td>
                    <td>
                      <div className="row-actions">
                        <Link className="btn btn-secondary btn-sm" to={`${e.id}/grades`}>Noten</Link>
                        {e.status === 'OPEN' && (
                          <>
                            <button className="btn btn-secondary btn-sm" onClick={() => startEdit(e)}>Bearbeiten</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => cancel(e)}>Absagen</button>
                          </>
                        )}
                      </div>
                    </td>
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
