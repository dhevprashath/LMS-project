import React from 'react';
import { Download, Share2, Award, Calendar, CheckCircle } from 'lucide-react';

const MOCK_CERTIFICATES = [
    {
        id: 1,
        title: 'Frontend Development Bootcamp',
        date: 'Oct 15, 2024',
        issuer: 'LMS Academy',
        grade: 'A+',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80'
    },
    {
        id: 2,
        title: 'Advanced Python Programming',
        date: 'Sept 20, 2024',
        issuer: 'Tech Institute',
        grade: 'A',
        skills: ['Python', 'Data Structures', 'Algorithms'],
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80'
    }
];

const Certification: React.FC = () => {

    const handleDownload = (title: string) => {
        alert(`Downloading certificate: ${title}`);
    };

    const handleShare = (title: string) => {
        alert(`Sharing certificate: ${title}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">My Certifications</h2>
                <p className="text-gray-500 mt-1">Showcase your achievements and verified skills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_CERTIFICATES.map(cert => (
                    <div key={cert.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">

                        {/* Preview Section */}
                        <div className="h-48 relative bg-gray-900 overflow-hidden flex items-center justify-center">
                            <img
                                src={cert.image}
                                alt={cert.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="relative z-10 text-center p-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
                                    <Award className="text-white" size={24} />
                                </div>
                                <h3 className="text-white font-bold text-lg leading-tight shadow-black drop-shadow-md">{cert.title}</h3>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <img src="https://ui-avatars.com/api/?name=LMS+Academy&background=random" alt="Issuer" className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-medium text-gray-600">{cert.issuer}</span>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                    <CheckCircle size={12} /> Verified
                                </span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1"><Calendar size={14} /> Issued</span>
                                    <span className="font-medium text-gray-900">{cert.date}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Grade Achieved</span>
                                    <span className="font-bold text-indigo-600">{cert.grade}</span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {cert.skills.map(skill => (
                                        <span key={skill} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleDownload(cert.title)}
                                        className="flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors"
                                    >
                                        <Download size={16} /> PDF
                                    </button>
                                    <button
                                        onClick={() => handleShare(cert.title)}
                                        className="flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        <Share2 size={16} /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Certification;
