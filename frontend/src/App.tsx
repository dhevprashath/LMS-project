import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Attendance from './pages/Attendance';
import LearningPathways from './pages/LearningPathways';
import Assessments from './pages/Assessments';
import Certification from './pages/Certification';
import Login from './pages/Login';
import Register from './pages/Register';
import CoursePlayer from './pages/CoursePlayer';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';

import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/course/:courseId/play" element={<CoursePlayer />} />
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />
          <Route path="/courses/:id" element={<MainLayout><CourseDetails /></MainLayout>} />
          <Route path="/attendance" element={<MainLayout><Attendance /></MainLayout>} />
          <Route path="/pathways" element={<MainLayout><LearningPathways /></MainLayout>} />
          <Route path="/assessments" element={<MainLayout><Assessments /></MainLayout>} />
          <Route path="/assessments" element={<MainLayout><Assessments /></MainLayout>} />
          <Route path="/certification" element={<MainLayout><Certification /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
