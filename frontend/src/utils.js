export const fmtDate = (v) =>
  v ? new Date(v).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) : '–';

export const fmtGrade = (g) => (g === null || g === undefined ? '–' : Number(g).toFixed(1));

export const asList = (d) => (Array.isArray(d) ? d : d?.content ?? []);


export const errMsg = (e) =>
  e?.response?.data?.error ||
  (e?.response ? `Erreur ${e.response.status}` : 'Serveur injoignable');

export const GRADE_VALUES = ['1.0', '1.3', '1.7', '2.0', '2.3', '2.7', '3.0', '3.3', '3.7', '4.0', '5.0'];

// "2027-02-15T09:00" -> "2027-02-15T09:00:00"
export const toIso = (v) => (v && v.length === 16 ? `${v}:00` : v);
export const toInput = (v) => (v ? v.slice(0, 16) : '');
