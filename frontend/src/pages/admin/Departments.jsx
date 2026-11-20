import { useState } from 'react';
import api, { get } from '../../api/client';
import { Notice, PageHeader, State } from '../../components/ui';
import { Field } from '../../components/ui';
import { useForm, useLoad } from '../../hooks';
import { asList, errMsg } from '../../utils';

export default function Departments() {
  const list = useLoad(() => get('/api/admin/departments'));
  const [form, bind, reset] = useForm({ code: '', name: '' });
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api.post('/api/admin/departments', form);
      setMsg({ kind: 'ok', text: `Département « ${form.name} » créé.` });
      reset();
      list.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    }
  };

  const rows = asList(list.data);

  return (
    <>
      <PageHeader title="Départements" sub="Chaque étudiant, professeur et module appartient à un département." />

      <form className="panel" onSubmit={submit}>
        <h2>Neuer Fachbereich</h2>
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        <div className="form-grid">
          <Field label="Code" hint="Ex. INF"><input {...bind('code')} required /></Field>
          <Field label="Nom" hint="Ex. Informatik"><input {...bind('name')} required /></Field>
        </div>
        <button className="btn btn-primary">Fachbereich erstellen</button>
      </form>

      <div className="panel flush">
        <div className="panel-title">Vorhandene Fachbereiche</div>
        <State loading={list.loading} error={list.error} empty={rows.length === 0} emptyText="Aucun département pour l'instant." />
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Code</th><th>Name</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>{d.code}</td>
                    <td>{d.name}</td>
                    <td>{d.active === false ? 'Inaktiv' : 'Aktiv'}</td>
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
