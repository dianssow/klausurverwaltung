import { Navigate, Route, Routes } from 'react-router-dom';
import { homeFor, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Departments from './pages/admin/Departments';
import Professors from './pages/admin/Professors';
import Students from './pages/admin/Students';
import Modules from './pages/admin/Modules';
import MyExams from './pages/professor/MyExams';
import Grades from './pages/professor/Grades';
import AvailableExams from './pages/student/AvailableExams';
import MyRegistrations from './pages/student/MyRegistrations';
import Status from './pages/student/Status';
import Transcript from './pages/student/Transcript';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user && !user.mustChangePassword ? <Navigate to={homeFor(user.role)} replace /> : <Login />} />
      <Route path="/change-password" element={user ? <ChangePassword /> : <Navigate to="/login" replace />} />

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="departments" replace />} />
          <Route path="departments" element={<Departments />} />
          <Route path="professors" element={<Professors />} />
          <Route path="students" element={<Students />} />
          <Route path="modules" element={<Modules />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="PROFESSOR" />}>
        <Route path="/professor" element={<Layout />}>
          <Route index element={<Navigate to="exams" replace />} />
          <Route path="exams" element={<MyExams />} />
          <Route path="exams/:id/grades" element={<Grades />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="STUDENT" />}>
        <Route path="/student" element={<Layout />}>
          <Route index element={<Navigate to="exams" replace />} />
          <Route path="exams" element={<AvailableExams />} />
          <Route path="registrations" element={<MyRegistrations />} />
          <Route path="status" element={<Status />} />
          <Route path="transcript" element={<Transcript />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={user ? homeFor(user.role) : '/login'} replace />} />
    </Routes>
  );
}
