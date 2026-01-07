
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Courses.css';

interface Course {
    id: string;
    title: string;
    instructor: string;
    category: string;
    duration: string;
    level: string;
    thumbnailColor: string;
}

const MOCK_COURSES: Course[] = [
    { id: '1', title: 'Introduction to React', instructor: 'Sarah Smith', category: 'Development', duration: '6 weeks', level: 'Beginner', thumbnailColor: '#61dafb' },
    { id: '2', title: 'Advanced Python', instructor: 'Mike Johnson', category: 'Data Science', duration: '8 weeks', level: 'Advanced', thumbnailColor: '#306998' },
    { id: '3', title: 'UI/UX Design Fundamentals', instructor: 'Emily Chen', category: 'Design', duration: '4 weeks', level: 'Beginner', thumbnailColor: '#ff6b6b' },
    { id: '4', title: 'Machine Learning Basics', instructor: 'David Lee', category: 'Data Science', duration: '10 weeks', level: 'Intermediate', thumbnailColor: '#4b0082' },
    { id: '5', title: 'Digital Marketing 101', instructor: 'Jessica Brown', category: 'Marketing', duration: '5 weeks', level: 'Beginner', thumbnailColor: '#ffa500' },
    { id: '6', title: 'Project Management', instructor: 'Robert Wilson', category: 'Business', duration: '6 weeks', level: 'Intermediate', thumbnailColor: '#4299e1' },
];

const CATEGORIES = ['All', 'Development', 'Design', 'Data Science', 'Business', 'Marketing'];

const CourseEnrollment: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredCourses = MOCK_COURSES.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="courses-page">
            <Sidebar />
            <div className="courses-main">
                <div className="courses-header">
                    <h1>Explore Courses</h1>
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="categories-nav">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="courses-grid-large">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="course-card-large">
                            <div className="course-thumbnail" style={{ backgroundColor: course.thumbnailColor }}>
                                <span className="course-badge">{course.category}</span>
                            </div>
                            <div className="course-details">
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-instructor">by {course.instructor}</p>
                                <div className="course-meta">
                                    <span>⏱️ {course.duration}</span>
                                    <span>📊 {course.level}</span>
                                </div>
                                <button className="enroll-btn">Enroll Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseEnrollment;
