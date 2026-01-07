import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, BookOpen, Award, CheckCircle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
    total_courses: number;
    enrolled_courses: number;
    attendance_percentage: number;
    certificates_earned: number;
}

const StatCard: React.FC<{ icon: any, label: string, value: string | number, color: string, trend?: string }> = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
                {trend && <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                    <TrendingUp size={12} /> {trend} since last month
                </p>}
            </div>
            <div className={`p-4 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
    </div>
);

const CourseProgressCard: React.FC<{ title: string, progress: number, image: string, category: string }> = ({ title, progress, image, category }) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
        <img src={image} alt={title} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
        <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{category}</span>
                <span className="text-xs text-gray-500 font-medium">{progress}%</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        total_courses: 0,
        enrolled_courses: 0,
        attendance_percentage: 0,
        certificates_earned: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                // Fallback mock data for demo if API fails
                setStats({
                    total_courses: 12,
                    enrolled_courses: 4,
                    attendance_percentage: 85,
                    certificates_earned: 2
                });
            }
        };
        fetchStats();
    }, []);

    // Mock data for UI demonstration
    const recentCourses = [
        { id: 1, title: 'Advanced React Patterns', progress: 75, category: 'Frontend', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&q=80' },
        { id: 2, title: 'Python for Data Science', progress: 30, category: 'Data', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&q=80' },
        { id: 3, title: 'UI/UX Design Principles', progress: 90, category: 'Design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=150&q=80' },
    ];

    const upcomingAssessments = [
        { id: 1, title: 'React Final Project', date: 'Oct 25, 2024', duration: '2 hours', type: 'Project' },
        { id: 2, title: 'Python Basics Quiz', date: 'Oct 28, 2024', duration: '45 mins', type: 'Quiz' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Dashboard</h2>
                    <p className="text-gray-500 mt-1">Track your learning progress and achievements</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    Last updated: Just now
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={BookOpen}
                    label="Available Courses"
                    value={stats.total_courses}
                    color="bg-blue-500"
                    trend="+2"
                />
                <StatCard
                    icon={Users}
                    label="Active Enrollments"
                    value={stats.enrolled_courses}
                    color="bg-purple-500"
                    trend="+1"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Attendance"
                    value={`${stats.attendance_percentage}%`}
                    color="bg-green-500"
                    trend="+5%"
                />
                <StatCard
                    icon={Award}
                    label="Certificates"
                    value={stats.certificates_earned}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-600" /> Continue Learning
                        </h3>
                        <Link to="/courses" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentCourses.map(course => (
                            <CourseProgressCard key={course.id} {...course} />
                        ))}
                    </div>
                </div>

                {/* Upcoming Assessments */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar size={20} className="text-indigo-600" /> Upcoming Assessments
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                        {upcomingAssessments.map(assessment => (
                            <div key={assessment.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="p-3 rounded-xl bg-orange-50 text-orange-600 font-bold text-center min-w-[60px]">
                                    <span className="block text-xs uppercase tracking-wider">{assessment.date.split(' ')[0]}</span>
                                    <span className="block text-xl">{assessment.date.split(' ')[1].replace(',', '')}</span>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-gray-800">{assessment.title}</h5>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">{assessment.type}</span>
                                        <span>•</span>
                                        <span>{assessment.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Link to="/assessments" className="block w-full text-center py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            View Calendar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
