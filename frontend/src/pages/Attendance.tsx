
import React from 'react';
import '../styles/Attendance.css';

const MOCK_ATTENDANCE = [
    { id: 1, date: '2023-10-25', course: 'Introduction to React', status: 'Present', time: '09:00 AM' },
    { id: 2, date: '2023-10-24', course: 'UI/UX Design Fundamentals', status: 'Present', time: '11:30 AM' },
    { id: 3, date: '2023-10-23', course: 'Advanced Python', status: 'Absent', time: '-' },
    { id: 4, date: '2023-10-22', course: 'Introduction to React', status: 'Present', time: '09:00 AM' },
    { id: 5, date: '2023-10-21', course: 'Project Management', status: 'Late', time: '02:15 PM' },
];

const Attendance: React.FC = () => {
    return (
        <div className="attendance-page">
            <div className="attendance-main">
                <header className="attendance-header">
                    <h1>Attendance Tracking</h1>
                </header>

                <div className="attendance-stats">
                    <div className="att-stat-card">
                        <h3>Total Classes</h3>
                        <p className="att-stat-value">45</p>
                        <span className="att-stat-label">This Semester</span>
                    </div>
                    <div className="att-stat-card">
                        <h3>Present</h3>
                        <p className="att-stat-value" style={{ color: '#48bb78' }}>40</p>
                        <span className="att-stat-label">Days</span>
                    </div>
                    <div className="att-stat-card">
                        <h3>Absent</h3>
                        <p className="att-stat-value" style={{ color: '#f56565' }}>5</p>
                        <span className="att-stat-label">Days</span>
                    </div>
                    <div className="att-stat-card">
                        <h3>Attendance Rate</h3>
                        <p className="att-stat-value">88.9%</p>
                        <span className="att-stat-label">Target: 90%</span>
                    </div>
                </div>

                <div className="attendance-history">
                    <h2>Recent History</h2>
                    <table className="att-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Course</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ATTENDANCE.map(record => (
                                <tr key={record.id}>
                                    <td>{record.date}</td>
                                    <td>{record.course}</td>
                                    <td>{record.time}</td>
                                    <td>
                                        <span className={`status-badge ${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
