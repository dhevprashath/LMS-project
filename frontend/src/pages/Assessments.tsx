import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';

const Assessments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

    const upcomingAssessments = [
        {
            id: 1,
            title: "React Components Quiz",
            course: "Introduction to React",
            dueDate: "Tomorrow, 11:59 PM",
            duration: "45 mins",
            questions: 20,
            type: "Quiz",
            urgent: true
        },
        {
            id: 2,
            title: "Data Structures Midterm",
            course: "Advanced Python",
            dueDate: "Oct 30, 2024",
            duration: "90 mins",
            questions: 35,
            type: "Exam",
            urgent: false
        },
        {
            id: 3,
            title: "UI Design Principles",
            course: "UI/UX Design Masterclass",
            dueDate: "Nov 05, 2024",
            duration: "30 mins",
            questions: 15,
            type: "Quiz",
            urgent: false
        }
    ];

    const completedAssessments = [
        {
            id: 101,
            title: "HTML/CSS Basics",
            course: "Frontend Fundamentals",
            submittedDate: "Oct 15, 2024",
            score: 95,
            grade: "A",
            status: "Passed"
        },
        {
            id: 102,
            title: "JavaScript Logic",
            course: "JavaScript Essentials",
            submittedDate: "Oct 10, 2024",
            score: 88,
            grade: "B+",
            status: "Passed"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Assessments</h2>
                <p className="text-gray-500 mt-1">Track your quizzes, exams, and assignments</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'upcoming' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                    {activeTab === 'upcoming' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>
                    )}
                </button>
                <button
                    className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'completed' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                    {activeTab === 'completed' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'upcoming' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingAssessments.map(assessment => (
                            <div key={assessment.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg ${assessment.type === 'Exam' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <FileText size={20} />
                                    </div>
                                    {assessment.urgent && (
                                        <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                            <AlertCircle size={12} /> Expiry Soon
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1">{assessment.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{assessment.course}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>Due: {assessment.dueDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} className="text-gray-400" />
                                        <span>{assessment.duration} • {assessment.questions} Questions</span>
                                    </div>
                                </div>

                                <button className="mt-auto w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                                    Start Assessment
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'completed' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Assessment Name</th>
                                        <th className="px-6 py-4">Submitted Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Grade</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {completedAssessments.map(assessment => (
                                        <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{assessment.title}</p>
                                                    <p className="text-xs text-gray-500">{assessment.course}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{assessment.submittedDate}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <CheckCircle size={12} /> {assessment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-gray-900">{assessment.grade}</span>
                                                    <span className="text-xs text-gray-500">({assessment.score}%)</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center gap-1">
                                                    Review <ChevronRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Assessments;
