import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="z-10 text-center px-4 max-w-3xl mx-auto animate-in fade-in zoom-in duration-700">
                {/* Logo Section */}
                <div className="mb-12 flex justify-center transform hover:scale-105 transition-transform duration-500">
                    <img
                        src="/logo.png"
                        alt="Academia Connect Logo"
                        className="h-48 md:h-64 object-contain drop-shadow-2xl"
                    />
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Unlock Your Potential with <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                        Academia Connect
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    The premium learning platform designed to help you master new skills,
                    track your progress, and achieve your certifications with ease.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        Login to Portal
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    >
                        Create Account
                    </button>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center gap-8 text-gray-400 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {/* Trusted by logos placeholder */}
                    <span className="font-semibold text-sm tracking-widest uppercase">Trusted by Top Educators</span>
                </div>
            </div>
        </div>
    );
};

export default Landing;
