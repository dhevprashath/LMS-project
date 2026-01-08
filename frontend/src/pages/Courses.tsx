import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Clock, Search, Filter, BookOpen, Star, User } from 'lucide-react';

interface Course {
    id: string | number;
    title: string;
    description: string;
    level: string;
    total_duration: number | string;
    instructor?: string;
    category?: string; // Not in DB, derived or fallback
    thumbnail?: string;
    rating?: number;
    resource_url?: string;
    video_url?: string;
}

const CATEGORIES = ['All', 'Development', 'Design', 'Data Science', 'Business', 'Marketing', 'AI'];

const Courses: React.FC = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses/');
                // Map DB response to UI model (handle missing category)
                const mappedCourses = res.data.map((c: any) => ({
                    ...c,
                    category: 'Development', // Default category since not in DB schema yet
                    total_duration: `${Math.round(c.total_duration / 60)}h` // Convert min to hours string
                }));

                const EXTRA_COURSES: Course[] = [
                    { id: 1, title: 'Java Programming', description: 'Master Java from scratch.', level: 'Intermediate', total_duration: '45h', category: 'Development', rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', instructor: 'Tech Guru', video_url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
                    { id: 2, title: 'Fullstack Web Dev 2024', description: 'Become a full-stack developer.', level: 'Advanced', total_duration: '55h', category: 'Development', rating: 4.9, thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80', instructor: 'Angela', video_url: 'https://www.youtube.com/watch?v=nu_pCVPcVz0' },
                    { id: 3, title: 'AI Bootcamp', description: 'Learn Artificial Intelligence.', level: 'Advanced', total_duration: '28h', category: 'AI', rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', instructor: 'AI Expert', video_url: 'https://www.youtube.com/watch?v=bhiB15W0R5U' },
                    { id: 4, title: 'Digital Marketing Master', description: 'Master Digital Marketing.', level: 'Beginner', total_duration: '32h', category: 'Marketing', rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80', instructor: 'Marketing Pro', video_url: 'https://www.youtube.com/watch?v=BZLUEKnMfIY' },
                ];

                // Merge and deduplicate by ID
                const allCourses = [...EXTRA_COURSES, ...mappedCourses.filter((m: any) => !EXTRA_COURSES.find(e => e.id == m.id))];
                setCourses(allCourses);
            } catch (err) {
                console.error("Failed to fetch courses", err);
                // Fallback if API fails
                const EXTRA_COURSES: Course[] = [
                    { id: 1, title: 'Java Programming', description: 'Master Java from scratch.', level: 'Intermediate', total_duration: '45h', category: 'Development', rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', instructor: 'Tech Guru', video_url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
                    { id: 2, title: 'Fullstack Web Dev 2024', description: 'Become a full-stack developer.', level: 'Advanced', total_duration: '55h', category: 'Development', rating: 4.9, thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80', instructor: 'Angela', video_url: 'https://www.youtube.com/watch?v=nu_pCVPcVz0' },
                    { id: 3, title: 'AI Bootcamp', description: 'Learn Artificial Intelligence.', level: 'Advanced', total_duration: '28h', category: 'AI', rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', instructor: 'AI Expert', video_url: 'https://www.youtube.com/watch?v=bhiB15W0R5U' },
                    { id: 4, title: 'Digital Marketing Master', description: 'Master Digital Marketing.', level: 'Beginner', total_duration: '32h', category: 'Marketing', rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80', instructor: 'Marketing Pro', video_url: 'https://www.youtube.com/watch?v=BZLUEKnMfIY' },
                ];
                setCourses(EXTRA_COURSES);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseClick = (courseId: string | number) => {
        navigate(`/courses/${courseId}`);
    };

    const handleEnroll = async (e: React.MouseEvent, course: Course) => {
        e.stopPropagation();

        // 1. Direct External Link (No Login Required)
        if (course.resource_url) {
            window.open(course.resource_url, '_blank');
            return;
        }

        // 2. Internal Course Enrollment (Login Required)
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            alert("Please login to enroll");
            navigate('/login');
            return;
        }
        const user = JSON.parse(userJson);
        console.log("Enrolling in:", course); // DEBUG

        const navigateToCourse = () => {
            if (course.resource_url) {
                window.open(course.resource_url, '_blank');
            } else {
                navigate(`/course/${course.id}/play`, { state: { videoUrl: course.video_url, title: course.title, description: course.description } });
            }
        };

        try {
            await api.post(`/courses/${course.id}/enroll`, { user_id: user.id });
            navigateToCourse();
        } catch (err: any) {
            console.error("Enrollment failed", err);
            // Even if enrollment fails (e.g. already enrolled), proceed to course
            navigateToCourse();
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section with Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Browse Courses</h2>
                    <p className="text-gray-500 mt-1">Discover new skills and advance your career</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all w-64 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-2 px-2">
                        <Filter size={18} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Filters</span>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Trending Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Star size={20} className="text-amber-500" /> Trending Now
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { id: 1, title: 'Machine Learning A-Z', rating: 4.8, students: 1205, category: 'AI', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&q=80', video_url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg' },
                        { id: 2, title: 'Fullstack Web Dev 2024', rating: 4.9, students: 3420, category: 'Development', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=300&q=80', video_url: 'https://www.youtube.com/watch?v=nu_pCVPcVz0' },
                        { id: 3, title: 'Cybersecurity Essentials', rating: 4.7, students: 850, category: 'Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&q=80', video_url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE' },
                        { id: 4, title: 'Digital Marketing Master', rating: 4.6, students: 2100, category: 'Marketing', image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=300&q=80', video_url: 'https://www.youtube.com/watch?v=BZLUEKnMfIY' },
                    ].map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                            <div
                                onClick={() => navigate(`/courses/${course.id}`)}
                                className="block relative h-32 overflow-hidden cursor-pointer"
                            >
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-amber-500 flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> {course.rating}
                                </div>
                            </div>
                            <div className="p-4">
                                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-2 inline-block">{course.category}</span>
                                <h4
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                    className="font-bold text-gray-900 mb-1 line-clamp-1 hover:text-indigo-600 transition-colors cursor-pointer"
                                >
                                    {course.title}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                                    <span className="flex items-center gap-1"><User size={12} /> {course.students} students</span>
                                    <button
                                        onClick={() => navigate(`/course/${course.id}/play`, { state: { videoUrl: course.video_url, title: course.title, description: 'Quick access via Trending' } })}
                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors font-semibold flex items-center gap-1"
                                    >
                                        Enroll
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                        {/* Thumbnail */}
                        <div className="h-48 relative overflow-hidden" onClick={() => handleCourseClick(course.id)} style={{ cursor: 'pointer' }}>
                            <img
                                src={course.thumbnail || 'https://via.placeholder.com/400x200'}
                                alt={course.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <span className="text-white font-medium text-sm flex items-center gap-1">
                                    <BookOpen size={16} /> View Details
                                </span>
                            </div>
                            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
                                {course.level}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{course.category || 'General'}</span>
                                {course.rating && (
                                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                        <Star size={14} fill="currentColor" />
                                        <span>{course.rating}</span>
                                    </div>
                                )}
                            </div>

                            <h3
                                onClick={() => handleCourseClick(course.id)}
                                className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer"
                            >
                                {course.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>

                            <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-4">
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <User size={16} />
                                        <span>{course.instructor || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} />
                                        <span>{course.total_duration}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleCourseClick(course.id)}
                                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={(e) => handleEnroll(e, course)}
                                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-indigo-200"
                                    >
                                        {course.resource_url ? 'Link' : 'Enroll'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">No courses found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Courses;
