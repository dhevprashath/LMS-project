import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Attendance from './pages/Attendance';
import LearningPathways from './pages/LearningPathways';
import Assessments from './pages/Assessments';
import Certification from './pages/Certification';
import Login from './pages/Login';
import Register from './pages/Register';
import CoursePlayer from './pages/CoursePlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/course/:courseId/play" element={<CoursePlayer />} />

        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />
        <Route path="/attendance" element={<MainLayout><Attendance /></MainLayout>} />
        <Route path="/pathways" element={<MainLayout><LearningPathways /></MainLayout>} />
        <Route path="/assessments" element={<MainLayout><Assessments /></MainLayout>} />
        <Route path="/certification" element={<MainLayout><Certification /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
