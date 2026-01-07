
import React from 'react';
import { CheckCircle, Lock, Map, ChevronRight, Trophy, BookOpen } from 'lucide-react';

const PathwaysData = [
    {
        id: 1,
        title: "Frontend Developer Path",
        description: "Master modern web development with React, TypeScript, and Tailwind CSS.",
        progress: 60,
        totalCourses: 5,
        completedCourses: 3,
        image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=500&q=80",
        steps: [
            { id: 101, title: "HTML & CSS Fundamentals", status: "completed", duration: "2 weeks" },
            { id: 102, title: "JavaScript Essentials", status: "completed", duration: "3 weeks" },
            { id: 103, title: "React.js Deep Dive", status: "in-progress", duration: "4 weeks" },
            { id: 104, title: "Advanced State Management", status: "locked", duration: "2 weeks" },
            { id: 105, title: "Frontend System Design", status: "locked", duration: "3 weeks" },
        ]
    },
    {
        id: 2,
        title: "Data Science Specialization",
        description: "From Python basics to Machine Learning and AI applications.",
        progress: 0,
        totalCourses: 6,
        completedCourses: 0,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80",
        steps: [
            { id: 201, title: "Python for Data Science", status: "locked", duration: "3 weeks" },
            { id: 202, title: "Data Analysis with Pandas", status: "locked", duration: "2 weeks" },
            { id: 203, title: "Data Visualization", status: "locked", duration: "2 weeks" },
            { id: 204, title: "Machine Learning Basics", status: "locked", duration: "4 weeks" },
        ]
    }
];

const LearningPathways: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Learning Pathways</h2>
                <p className="text-gray-500 mt-1">Structured roadmaps to master new skills</p>
            </div>

            {PathwaysData.map((path) => (
                <div key={path.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="md:flex">
                        {/* Pathway Info */}
                        <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col justify-between border-r border-gray-100">
                            <div>
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
                                    <Map size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.title}</h3>
                                <p className="text-gray-500 mb-6">{path.description}</p>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-600">{path.completedCourses}/{path.totalCourses} Courses</span>
                                        <span className="text-indigo-600">{path.progress}% Completed</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${path.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {path.progress === 0 && (
                                <button className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Start Learning Path
                                </button>
                            )}
                            {path.progress > 0 && path.progress < 100 && (
                                <button className="mt-8 w-full py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors">
                                    Continue Learning
                                </button>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="md:w-2/3 p-8">
                            <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <BookOpen size={20} className="text-gray-400" />
                                Curriculum
                            </h4>
                            <div className="relative space-y-8 pl-4">
                                {/* Vertical Line */}
                                <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>

                                {path.steps.map((step) => (
                                    <div key={step.id} className="relative flex items-center gap-6 group">
                                        {/* Icon/Status */}
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center border-4 z-10 transition-colors duration-300
                                            ${step.status === 'completed' ? 'bg-green-500 border-green-100 text-white' :
                                                step.status === 'in-progress' ? 'bg-white border-indigo-100 text-indigo-600 shadow-sm' :
                                                    'bg-gray-100 border-gray-50 text-gray-400'}
                                        `}>
                                            {step.status === 'completed' && <CheckCircle size={16} />}
                                            {step.status === 'in-progress' && <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse" />}
                                            {step.status === 'locked' && <Lock size={14} />}
                                        </div>

                                        {/* Content */}
                                        <div className={`
                                            flex-1 p-4 rounded-xl border transition-all duration-300
                                            ${step.status === 'in-progress' ? 'bg-indigo-50 border-indigo-100 shadow-sm' :
                                                step.status === 'locked' ? 'bg-white border-transparent opacity-60' :
                                                    'bg-white border-gray-100'}
                                        `}>
                                            <div className="flex justify-between items-center">
                                                <h5 className={`font-semibold ${step.status === 'locked' ? 'text-gray-500' : 'text-gray-900'}`}>{step.title}</h5>
                                                {step.status !== 'locked' && (
                                                    <span className="text-xs font-medium bg-white px-2 py-1 rounded-md text-gray-500 border border-gray-100">
                                                        {step.duration}
                                                    </span>
                                                )}
                                            </div>
                                            {step.status === 'in-progress' && (
                                                <div className="mt-2 flex items-center gap-2 text-sm text-indigo-600 font-medium">
                                                    Resume Course <ChevronRight size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center gap-6 opacity-30">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 border-4 border-gray-50 flex items-center justify-center text-gray-400">
                                        <Trophy size={14} />
                                    </div>
                                    <div className="text-sm font-medium text-gray-400">Path Completion Certificate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LearningPathways;
