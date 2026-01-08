import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, BookOpen, Award, CheckCircle, TrendingUp, ArrowRight, Play, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
    total_courses: number;
    enrolled_courses: number;
    attendance_percentage: number;
    certificates_earned: number;
}

const StatCard: React.FC<{ icon: any, label: string, value: string | number, color: string, trend?: string }> = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
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

const CourseProgressCard: React.FC<{ title: string, progress: number, image: string, category: string, id: number, total_hours: number, video_url?: string }> = ({ title, progress, image, category, id, total_hours, video_url }) => {
    const learnedHours = Math.round((progress / 100) * total_hours);

    return (
        <Link
            to={`/course/${id}/play`}
            state={{ videoUrl: video_url, title: title, description: `Resume your ${title} course.` }}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-md group block"
        >
            <img src={image} alt={title} className="w-20 h-20 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-300" />
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{category}</span>
                    <span className="text-xs text-gray-500 font-medium">{progress}%</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{title}</h4>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Clock size={10} /> {learnedHours}h / {total_hours}h learned</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-xs font-medium text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Resume Learning <ArrowRight size={12} />
                </div>
            </div>
        </Link>
    );
};

const TrendingCourseCard: React.FC<{ title: string, rating: number, students: number, image: string, category: string, id: number, video_url?: string }> = ({ title, rating, students, image, category, id, video_url }) => (
    <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
        <Link to={`/courses/${id}`} className="block relative h-32 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-amber-500 flex items-center gap-1">
                <Star size={10} fill="currentColor" /> {rating}
            </div>
        </Link>
        <div className="p-4">
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-2 inline-block">{category}</span>
            <Link to={`/courses/${id}`} className="block">
                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 hover:text-indigo-600 transition-colors">{title}</h4>
            </Link>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <span className="flex items-center gap-1"><Users size={12} /> {students} students</span>
                <Link
                    to={`/course/${id}/play`}
                    state={{ videoUrl: video_url, title, description: `Quick access to ${title}` }}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors font-semibold flex items-center gap-1"
                >
                    Enroll <Play size={12} />
                </Link>
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
    const [user, setUser] = useState<{ fullname: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        let userId = 1;
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.id) userId = parsedUser.id;
        }

        const fetchStats = async () => {
            try {
                const res = await api.get(`/api/dashboard/stats?user_id=${userId}`);
                const streakRes = await api.get(`/attendance/${userId}/streak`);

                setStats({
                    ...res.data,
                    average_attendance: streakRes.data.streak
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setStats({
                    total_courses: 0,
                    enrolled_courses: 0,
                    attendance_percentage: 0,
                    certificates_earned: 0
                });
            }
        };
        fetchStats();
    }, []);

    // Mock data for UI demonstration
    const recentCourses = [
        { id: 1, title: 'Java Programming', progress: 75, category: 'Development', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&q=80', total_hours: 45, video_url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
        { id: 2, title: 'Python for Data Science', progress: 30, category: 'Data', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&q=80', total_hours: 60, video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
        { id: 3, title: 'AI Bootcamp', progress: 90, category: 'AI', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&q=80', total_hours: 28, video_url: 'https://www.youtube.com/watch?v=bhiB15W0R5U' },
    ];

    // Pick the first recent course as the "Main" resume course
    const lastCourse = recentCourses[0];

    const trendingCourses = [
        { id: 1, title: 'Machine Learning A-Z', rating: 4.8, students: 1205, category: 'AI', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&q=80', video_url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg' },
        { id: 2, title: 'Fullstack Web Dev 2024', rating: 4.9, students: 3420, category: 'Development', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=300&q=80', video_url: 'https://youtu.be/nu_pCVPKzTk?si=s_IUII6yQNQ66m89' },
        { id: 3, title: 'Cybersecurity Essentials', rating: 4.7, students: 850, category: 'Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&q=80', video_url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE' },
        { id: 4, title: 'Digital Marketing Master', rating: 4.6, students: 2100, category: 'Marketing', image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=300&q=80', video_url: 'https://www.youtube.com/watch?v=BZLUEKnMfIY' },
    ];



    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullname?.split(' ')[0] || 'Student'}! 👋</h1>
                        <p className="text-indigo-100 max-w-lg mb-6 leading-relaxed">
                            You've learned <span className="font-semibold text-white">80%</span> more this week. Keep up the great work and finish your <span className="font-semibold text-white">{lastCourse.title}</span> course today.
                        </p>
                        <Link to={`/course/${lastCourse.id}/play`} className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                            <Play size={20} fill="currentColor" /> Resume Learning
                        </Link>
                    </div>
                    <div className="hidden md:block relative">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-64">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={lastCourse.image} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="overflow-hidden">
                                    <p className="text-xs text-indigo-200">Processing</p>
                                    <p className="text-sm font-bold truncate">{lastCourse.title}</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 w-3/4 rounded-full"></div>
                            </div>
                        </div>
                    </div>
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
                    label="Daily Streak"
                    value={`${(stats as any).average_attendance || 0} Days`}
                    color="bg-green-500"
                    trend="+1"
                />
                <StatCard
                    icon={Award}
                    label="Certificates"
                    value={stats.certificates_earned}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Main Content Column */}
                <div className="space-y-8">

                    {/* Continue Learning */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Clock size={20} className="text-indigo-600" /> Continue Learning
                            </h3>
                            <Link to="/courses" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 group">
                                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentCourses.map(course => (
                                <CourseProgressCard key={course.id} {...course} />
                            ))}
                        </div>
                    </div>

                    {/* Trending Courses */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp size={20} className="text-rose-500" /> Trending Now
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {trendingCourses.map(course => (
                                <TrendingCourseCard key={course.id} {...course} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
