import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NAV = {
  ADMIN: [
    ['/admin/departments', 'Départements'],
    ['/admin/professors', 'Professeurs'],
    ['/admin/students', 'Étudiants'],
    ['/admin/modules', 'Modules'],
  ],
  PROFESSOR: [['/professor/exams', 'Mes examens']],
  STUDENT: [
    ['/student/exams', 'Examens ouverts'],
    ['/student/registrations', 'Mes inscriptions'],
    ['/student/status', 'Mon statut'],
    ['/student/transcript', 'Notenspiegel'],
  ],
};
const ROLE_LABEL = { ADMIN: 'Administration', PROFESSOR: 'Professeur', STUDENT: 'Étudiant' };

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-name">Klausurverwaltung</span>
          <span className="brand-role">{ROLE_LABEL[user.role]}</span>
        </div>
        <nav className="nav">
          {(NAV[user.role] ?? []).map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="user-email">{user.email}</span>
          <NavLink to="/change-password" className="foot-link">
            Passwort ändern
          </NavLink>
          <button className="foot-link" onClick={logout}>
            Abmelden
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
