import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>LMS Portal</h3>
            </div>
            <ul className="sidebar-menu">
                <li><Link to="/dashboard" className="active">Dashboard</Link></li>
                <li><Link to="/courses">Course Enrollment</Link></li>
                <li><Link to="/attendance">Attendance Tracking</Link></li>
                <li><Link to="/pathways">Learning Pathways</Link></li>
                <li><Link to="/assessments">Assessments</Link></li>
                <li><Link to="/certification">Certification</Link></li>
            </ul>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </div>
    );
};

export default Sidebar;
