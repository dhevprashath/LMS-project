import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    CheckCircle,
    PlayCircle,
    ArrowLeft,
    Maximize,
    Subtitles
} from 'lucide-react';
import api from '../api/axios';

interface Lesson {
    id: number;
    title: string;
    video_url?: string;
    duration: number; // in minutes
    content?: string;
    completed?: boolean; // Frontend state
}

interface CourseData {
    id: number;
    title: string;
    description: string;
    instructor?: string;
    modules: Lesson[]; // Mapping "Lesson" to "modules" for player
}

const CoursePlayer: React.FC = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [course, setCourse] = useState<CourseData | null>(null);
    const [quality, setQuality] = useState('1080p');
    const [captions, setCaptions] = useState(false);
    const [loading, setLoading] = useState(true);

    const playerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadCourseData = async () => {
            // Define markAttendance helper function locally
            const markAttendance = async (cId: number, lId?: number) => {
                const userJson = localStorage.getItem('user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    try {
                        await api.post(`/attendance/?user_id=${user.id}`, {
                            course_id: cId,
                            lesson_id: lId,
                            status: 'present'
                        });
                        console.log("Attendance marked");
                    } catch (err) {
                        console.error("Failed to mark attendance", err);
                    }
                }
            };

            // Handle mock courses passed via state
            if (location.state?.videoUrl) {
                // Auto-mark attendance for mock course
                markAttendance(Number(courseId) || 999, 1); // Mock lesson ID is 1

                setCourse({
                    id: Number(courseId) || 999,
                    title: location.state.title || "Trending Course",
                    description: location.state.description || "Course Content",
                    instructor: "Expert Instructor",
                    modules: [{
                        id: 1, // This is the mock lesson ID
                        title: "Introduction",
                        video_url: location.state.videoUrl,
                        duration: 15,
                        content: "Video content for " + (location.state.title || "this course"),
                        completed: false
                    }]
                });
                setLoading(false);
            } else {
                try {
                    if (!courseId) return;
                    const courseRes = await api.get(`/courses/${courseId}`);
                    const lessonsRes = await api.get(`/courses/${courseId}/lessons`);

                    const mappedLessons = lessonsRes.data.map((l: any) => ({
                        id: l.id,
                        title: l.title,
                        video_url: l.video_url,
                        duration: l.duration,
                        content: l.content,
                        completed: false
                    }));

                    const firstLessonId = mappedLessons.length > 0 ? mappedLessons[0].id : undefined;

                    // Auto-mark attendance for fetched course
                    markAttendance(courseRes.data.id, firstLessonId);

                    setCourse({
                        id: courseRes.data.id,
                        title: courseRes.data.title,
                        description: courseRes.data.description,
                        instructor: courseRes.data.instructor || 'Instructor',
                        modules: mappedLessons.length > 0 ? mappedLessons : [{ title: 'No lessons available', video_url: 'w7ejDZ8SWv8', duration: 0, id: 0, content: 'No content', completed: false }]
                    });
                } catch (err) {
                    console.error("Failed to fetch course data", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadCourseData();
    }, [courseId, location.state]);

    const handleMarkComplete = async () => {
        if (!course) return;
        const updatedModules = [...course.modules];
        updatedModules[currentModuleIndex].completed = true;
        setCourse({ ...course, modules: updatedModules });

        if (currentModuleIndex < course.modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
            // Course Completed
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                try {
                    await api.post(`/courses/${courseId}/complete`, { user_id: user.id });
                    alert("Course Completed! Certificate Generated.");
                    navigate('/certification');
                } catch (err) {
                    console.error("Failed to complete course", err);
                    alert("Failed to mark course as complete. Please try again.");
                }
            } else {
                navigate('/login');
            }
        }
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // Helper to get Youtube ID
    const getYoutubeId = (url?: string) => {
        if (!url) return 'w7ejDZ8SWv8'; // Fallback
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : 'w7ejDZ8SWv8';
    };

    if (loading) return <div className="p-10 text-white">Loading course...</div>;
    if (!course) return <div className="p-10 text-white">Course not found</div>;

    const currentModule = course.modules[currentModuleIndex];
    if (!currentModule) return <div className="p-10 text-white">No module selected</div>;
    const videoId = getYoutubeId(currentModule.video_url);

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)} // Or just back to courses
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-sm font-medium text-gray-400">Course Content</h1>
                        <h2 className="text-lg font-bold text-white truncate max-w-md">{course.title}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Auto-saving progress
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Player Area */}
                <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">

                    {/* Video Player Container */}
                    <div ref={playerContainerRef} className="w-full aspect-video bg-black relative group shadow-2xl">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Toolbar / Actions */}
                    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                        {/* Controls (Captions, Quality etc) - Keep mostly mock for now */}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setCaptions(!captions)}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${captions ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Subtitles size={20} />
                                {captions ? 'Captions On' : 'Captions'}
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleFullScreen}
                                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                <Maximize size={20} /> Fullscreen
                            </button>
                        </div>
                    </div>

                    {/* Lesson Details */}
                    <div className="p-8 max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{currentModule.title}</h2>
                                <p className="text-gray-400">{course.description}</p>
                            </div>
                            <button
                                onClick={handleMarkComplete}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentModule.completed
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95'
                                    }`}
                            >
                                {currentModule.completed ? (
                                    <>
                                        <CheckCircle size={20} /> Completed
                                    </>
                                ) : (
                                    'Mark as Complete'
                                )}
                            </button>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300">
                                {currentModule.content || "No detailed content for this lesson."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Curriculum) */}
                <div className="w-80 sm:w-96 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="font-bold text-white text-lg">Course Content</h3>
                        <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                            <span>{course.modules.filter(m => m.completed).length}/{course.modules.length} Completed</span>
                            <span>{Math.round((course.modules.filter(m => m.completed).length / course.modules.length) * 100)}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-gray-800 rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${(course.modules.filter(m => m.completed).length / course.modules.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {course.modules.map((module, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentModuleIndex(index)}
                                className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-800/50 transition-colors border-l-4 ${currentModuleIndex === index
                                    ? 'bg-gray-800 border-indigo-500'
                                    : 'border-transparent'
                                    }`}
                            >
                                <div className={`mt-0.5 shrink-0 ${module.completed ? 'text-green-500' : 'text-gray-600'}`}>
                                    {module.completed ? <CheckCircle size={18} fill="currentColor" className="text-green-900" /> : <PlayCircle size={18} />}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-medium mb-1 ${currentModuleIndex === index ? 'text-white' : 'text-gray-400'}`}>
                                        {module.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <PlayCircle size={12} /> {module.duration} min
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
