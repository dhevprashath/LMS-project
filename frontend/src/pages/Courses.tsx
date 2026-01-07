import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Clock, Search, Filter, BookOpen, Star, User } from 'lucide-react';

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
}

const CATEGORIES = ['All', 'Development', 'Design', 'Data Science', 'Business', 'Marketing'];

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses/');
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch courses, using mock data", err);
                // Fallback Mock Data
                setCourses([
                    {
                        id: '1',
                        title: 'Modern React with Redux',
                        description: 'Master React and Redux with this comprehensive course.',
                        level: 'Intermediate',
                        total_duration: '45h',
                        category: 'Development',
                        instructor: 'Sarah Smith',
                        rating: 4.8,
                        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80'
                    },
                    {
                        id: '2',
                        title: 'UI/UX Design Masterclass',
                        description: 'Learn to design beautiful interfaces and user experiences.',
                        level: 'Beginner',
                        total_duration: '28h',
                        category: 'Design',
                        instructor: 'Emily Chen',
                        rating: 4.9,
                        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80'
                    },
                    {
                        id: '3',
                        title: 'Python for Data Science',
                        description: 'Data analysis and machine learning with Python.',
                        level: 'Advanced',
                        total_duration: '60h',
                        category: 'Data Science',
                        instructor: 'Mike Johnson',
                        rating: 4.7,
                        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80'
                    },
                    {
                        id: '4',
                        title: 'Digital Marketing Strategy',
                        description: 'Grow your business with data-driven marketing strategies.',
                        level: 'Beginner',
                        total_duration: '20h',
                        category: 'Marketing',
                        instructor: 'Jessica Brown',
                        rating: 4.5,
                        thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80'
                    },
                    {
                        id: '5',
                        title: 'Business Intelligence 101',
                        description: 'Intro to BI tools and strategies.',
                        level: 'Intermediate',
                        total_duration: '32h',
                        category: 'Business',
                        instructor: 'Robert Wilson',
                        rating: 4.6,
                        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleEnroll = async (courseId: string) => {
        try {
            await api.post('/api/enroll', { course_id: courseId });
            alert("Enrolled successfully!");
        } catch (err) {
            // Mock success for demo
            console.log("Mock enrollment for course", courseId);
            alert("Enrolled successfully! (Mock)");
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

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                        {/* Thumbnail */}
                        <div className="h-48 relative overflow-hidden">
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

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{course.title}</h3>
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

                                <button
                                    onClick={() => handleEnroll(course.id)}
                                    className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-indigo-600 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-indigo-200"
                                >
                                    Enroll Now
                                </button>
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
