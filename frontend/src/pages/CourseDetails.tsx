import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Star, BookOpen, CheckCircle, PlayCircle, BarChart, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

// Mock Data for Fallback
const MOCK_COURSES = [
    {
        id: '1',
        title: 'Machine Learning A-Z',
        description: 'Master Machine Learning with this comprehensive course. Covers Python, R, and deeply explains the math behind the algorithms.',
        level: 'Advanced',
        total_duration: '42h',
        category: 'AI',
        instructor: 'Kirill Eremenko',
        rating: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
        modules: [
            {
                title: 'Data Preprocessing',
                lessons: [
                    { title: 'Importing Libraries', duration_minutes: 10 },
                    { title: 'Importing the Dataset', duration_minutes: 15 }
                ]
            }
        ]
    },
    {
        id: '2',
        title: 'Fullstack Web Dev 2024',
        description: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!',
        level: 'Intermediate',
        total_duration: '55h',
        category: 'Development',
        instructor: 'Dr. Angela Yu',
        rating: 4.9,
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
        modules: [
            {
                title: 'Frontend Development',
                lessons: [
                    { title: 'HTML Basics', duration_minutes: 25 },
                    { title: 'CSS Styling', duration_minutes: 35 }
                ]
            },
            {
                title: 'Backend Development',
                lessons: [
                    { title: 'Node.js Introduction', duration_minutes: 30 },
                    { title: 'Express Server', duration_minutes: 40 }
                ]
            }
        ]
    },
    {
        id: '3',
        title: 'Cybersecurity Essentials',
        description: 'Learn the fundamentals of Cybersecurity and how to protect digital assets. Ideal for beginners starting their security journey.',
        level: 'Beginner',
        total_duration: '20h',
        category: 'Security',
        instructor: 'Nathan House',
        rating: 4.7,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        modules: [
            {
                title: 'Introduction to Cyber Threats',
                lessons: [
                    { title: 'Malware Types', duration_minutes: 20 },
                    { title: 'Phishing Attacks', duration_minutes: 25 }
                ]
            }
        ]
    },
    {
        id: '4',
        title: 'Digital Marketing Master',
        description: 'The complete digital marketing course. Master Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics and more!',
        level: 'Beginner',
        total_duration: '32h',
        category: 'Marketing',
        instructor: 'Robin & Jesper',
        rating: 4.6,
        thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80',
        modules: [
            {
                title: 'Market Research',
                lessons: [
                    { title: 'Understanding your Audience', duration_minutes: 30 },
                    { title: 'Competitor Analysis', duration_minutes: 40 }
                ]
            }
        ]
    }
];

interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
    total_duration: number | string;
    instructor?: string;
    category?: string;
    thumbnail?: string;
    rating?: number;
    modules?: {
        title: string;
        lessons: { title: string; duration_minutes: number }[];
    }[];
}

const CourseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                // Try fetching specific course first
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.warn("Failed to fetch specific course, trying fallback find...", err);
                try {
                    // Fallback: Fetch all and find
                    const res = await api.get('/courses/');
                    const foundCourse = res.data.find((c: any) => c._id === id || c.id === id);
                    if (foundCourse) {
                        setCourse(foundCourse);
                    } else {
                        // Final Fallback: Mock Data
                        const mockFound = MOCK_COURSES.find(c => c.id === id);
                        setCourse(mockFound || null);
                    }
                } catch (fallbackErr) {
                    console.error("All fetch attempts failed, using mock data", fallbackErr);
                    const mockFound = MOCK_COURSES.find(c => c.id === id);
                    setCourse(mockFound || null);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleEnroll = async () => {
        try {
            await api.post('/api/enroll', { course_id: id });
            alert("Enrolled successfully! Redirecting to player...");
            navigate(`/course/${id}/play`);
        } catch (err) {
            console.log("Mock enrollment");
            // alert("Enrolled successfully! (Mock) Redirecting...");
            navigate(`/course/${id}/play`);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500 font-medium">Loading course details...</p>
            </div>
        </div>
    );

    if (!course) return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-red-500 opacity-50" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
                <p className="text-gray-500 mb-6">The course you are looking for does not exist or has been removed.</p>
                <button onClick={() => navigate('/courses')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors w-full">
                    Back to Courses
                </button>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500 pb-12">

            {/* Back Button */}
            <button
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Courses
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Hero Section */}
                <div className="relative h-80 md:h-96">
                    <img
                        src={course.thumbnail || 'https://via.placeholder.com/1200x400'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {course.category || 'General'}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                <BarChart size={12} /> {course.level}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 shadow-sm">{course.title}</h1>
                        <p className="text-gray-200 text-lg md:w-2/3 line-clamp-2">{course.description}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Main Content */}
                    <div className="lg:w-2/3 p-8 md:p-12">
                        <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {course.instructor ? course.instructor.charAt(0) : 'I'}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Instructor</p>
                                    <p className="font-semibold text-gray-900">{course.instructor || 'Unknown'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Duration</p>
                                <div className="flex items-center gap-2 font-semibold text-gray-900">
                                    <Clock size={18} className="text-indigo-600" /> {course.total_duration}
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Rating</p>
                                <div className="flex items-center gap-2 font-semibold text-gray-900">
                                    <Star size={18} className="text-amber-400 fill-amber-400" /> {course.rating || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen size={24} className="text-indigo-600" /> Course Description
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {course.description}
                                <br /><br />
                                This comprehensive course is designed to take you from {course.level.toLowerCase()} to advanced.
                                You will work on real-world projects and gain hands-on experience.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PlayCircle size={24} className="text-indigo-600" /> Curriculum
                            </h3>

                            {course.modules && course.modules.length > 0 ? (
                                <div className="space-y-4">
                                    {course.modules.map((module, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors bg-gray-50/50">
                                            <div className="p-4 bg-white border-b border-gray-100 font-semibold text-gray-800 flex justify-between items-center">
                                                <span>Module {idx + 1}: {module.title}</span>
                                                <span className="text-gray-400 text-sm">{module.lessons.length} Lessons</span>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {module.lessons.map((lesson, lIdx) => (
                                                    <div key={lIdx} className="p-4 flex justify-between items-center text-sm hover:bg-white transition-colors">
                                                        <span className="flex items-center gap-3 text-gray-600">
                                                            <PlayCircle size={16} className="text-indigo-400" />
                                                            {lesson.title}
                                                        </span>
                                                        <span className="text-gray-400">{lesson.duration_minutes} min</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500 border border-dashed border-gray-200">
                                    <BookOpen size={24} className="mx-auto text-gray-300 mb-2" />
                                    Curriculum details coming soon.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="lg:w-1/3 bg-gray-50 p-8 md:p-12 border-l border-gray-100 flex flex-col">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Subscribe to Premium</h3>
                            <div className="text-3xl font-bold text-indigo-600 mb-6">$0 <span className="text-sm text-gray-500 font-normal">/ month (Free Beta)</span></div>

                            <button
                                onClick={handleEnroll}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 mb-4"
                            >
                                Enroll Now
                            </button>

                            <p className="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle size={18} className="text-green-500" /> Full Lifetime Access
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle size={18} className="text-green-500" /> Certificate of Completion
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle size={18} className="text-green-500" /> Premium Support
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
