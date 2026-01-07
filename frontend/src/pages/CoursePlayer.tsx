import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Player.css';

// Mock data, eventually replace with API fetch
const MOCK_COURSE = {
    id: '1',
    title: 'Introduction to React',
    description: 'Master React.js from scratch. This course covers everything from components to hooks.',
    modules: [
        { title: '1. Introduction & Setup', videoId: 'w7ejDZ8SWv8', duration: '10:00', completed: true },
        { title: '2. Components & Props', videoId: 'kVeOpcw4GWY', duration: '15:30', completed: false },
        { title: '3. State & Lifecycle', videoId: 'dGcsHMXbSOA', duration: '20:00', completed: false },
        { title: '4. Hooks Deep Dive', videoId: 'TNhaISOUy6Q', duration: '25:00', completed: false },
        { title: '5. Building a Project', videoId: 'hQAHSlTtcmY', duration: '45:00', completed: false },
    ]
};

const CoursePlayer: React.FC = () => {
    useParams();
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [course, setCourse] = useState(MOCK_COURSE);
    const navigate = useNavigate();

    const currentModule = course.modules[currentModuleIndex];

    const handleMarkComplete = () => {
        // Here we would call API to update progress
        const updatedModules = [...course.modules];
        updatedModules[currentModuleIndex].completed = true;
        setCourse({ ...course, modules: updatedModules });

        if (currentModuleIndex < course.modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
            alert("Course Completed! Redirecting to Certification...");
            navigate('/certification');
        }
    };

    return (
        <div className="player-layout">
            <div className="player-main">
                <div className="player-container">
                    <iframe
                        className="video-responsive"
                        src={`https://www.youtube.com/embed/${currentModule.videoId}?rel=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="player-content">
                    <h1>{currentModule.title}</h1>
                    <p>{course.description}</p>
                    <button className="complete-btn" onClick={handleMarkComplete}>
                        {currentModule.completed ? 'Completed' : 'Mark as Complete'}
                    </button>
                    <button className="complete-btn" style={{ marginLeft: '1rem', backgroundColor: '#e2e8f0', color: '#4a5568' }} onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="player-sidebar">
                <h2>Course Content</h2>
                <ul className="module-list">
                    {course.modules.map((module, index) => (
                        <li
                            key={index}
                            className={`module-item ${index === currentModuleIndex ? 'active' : ''}`}
                            onClick={() => setCurrentModuleIndex(index)}
                        >
                            <div className={`module-status ${module.completed ? 'completed' : ''}`}></div>
                            <div className="module-info">
                                <h3>{module.title}</h3>
                                <span className="module-meta">Video • {module.duration}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CoursePlayer;
