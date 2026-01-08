import React, { useState, useRef, useEffect } from 'react';
import {
    Send, Sparkles, User, Bot,
    Download, Clock, Calendar, CheckCircle,
    ArrowRight, Loader2, Layers
} from 'lucide-react';
import api from '../api/axios';

interface ScheduleItem {
    day: number;
    phase: string;
    topic: string;
    activity: string;
    hours: number;
}

interface LearningPathData {
    course_name: string;
    total_days: number;
    hours_per_day: number;
    total_hours: number;
    schedule: ScheduleItem[];
}

interface Message {
    id: number;
    role: 'user' | 'bot';
    text: string;
    type?: 'text' | 'result';
    data?: LearningPathData;
}

const LearningPathways: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'bot', text: "Hi! I'm your Learning Path AI. What skill or topic do you want to learn today?", type: 'text' }
    ]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0); // 0: Topic, 1: Days, 2: Hours, 3: Done
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        course_name: '',
        days: 0,
        hours_per_day: 0
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text: input, type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulate thinking delay
        setTimeout(async () => {
            processStep(input, userMsg.id + 1);
        }, 600);
    };

    const processStep = async (userInput: string, msgId: number) => {
        let nextStep = step;
        let botText = '';
        let resultData: LearningPathData | undefined;
        let msgType: 'text' | 'result' = 'text';

        try {
            if (step === 0) {
                // Topic received
                setFormData(prev => ({ ...prev, course_name: userInput }));
                botText = `Great choice! Mastering ${userInput} sounds exciting. How many days can you dedicate to this learning journey?`;
                nextStep = 1;
            } else if (step === 1) {
                // Days received
                const days = parseInt(userInput);
                if (isNaN(days) || days <= 0) {
                    botText = "Please enter a valid number of days (e.g., 30).";
                    setLoading(false);
                    setMessages(prev => [...prev, { id: msgId, role: 'bot', text: botText }]);
                    return; // Don't advance step
                }
                setFormData(prev => ({ ...prev, days }));
                botText = `Got it, ${days} days. And how many hours per day are you planning to study?`;
                nextStep = 2;
            } else if (step === 2) {
                // Hours received
                const hours = parseInt(userInput);
                if (isNaN(hours) || hours <= 0) {
                    botText = "Please enter a valid number of hours (e.g., 2).";
                    setLoading(false);
                    setMessages(prev => [...prev, { id: msgId, role: 'bot', text: botText }]);
                    return; // Don't advance step
                }

                // Finalize data and generate
                const finalData = { ...formData, hours_per_day: hours };
                setFormData(finalData);

                // Call API
                botText = "Perfect! I'm generating your personalized learning roadmap now...";
                setMessages(prev => [...prev, { id: msgId, role: 'bot', text: botText }]);

                try {
                    const res = await api.post('/learning-path/generate', finalData);
                    resultData = res.data;
                    msgType = 'result';
                    botText = `Here is your custom roadmap for ${finalData.course_name}! You can download it as a PDF below.`;

                    // Add result message after the "Generating..." message
                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            id: msgId + 1,
                            role: 'bot',
                            text: botText,
                            type: 'result',
                            data: resultData
                        }]);
                    }, 1000);

                } catch (err) {
                    console.error("API Error", err);
                    botText = "I'm sorry, I encountered an issue generating your legacy. Please try again.";
                }
                nextStep = 3; // Done
            } else if (step === 3) {
                // Reset
                botText = "I can generate another path for you. What new topic would you like to learn?";
                nextStep = 0;
                setFormData({ course_name: '', days: 0, hours_per_day: 0 });
                setFormData(prev => ({ ...prev, course_name: userInput })); // Treat input as new topic? 
                // Actually better to just reset flow
                botText = `Okay! Let's start a new path for ${userInput}. How many days?`;
                setFormData({ course_name: userInput, days: 0, hours_per_day: 0 });
                nextStep = 1;
            }

            if (msgType === 'text' && step !== 2) {
                // Don't add text message if we are in the "Generating..." async block handled separately
                setMessages(prev => [...prev, { id: msgId, role: 'bot', text: botText }]);
            }

            setStep(nextStep);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: msgId, role: 'bot', text: "Something went wrong. Let's start over." }]);
            setStep(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (data: LearningPathData) => {
        try {
            const res = await api.post('/learning-path/download', {
                course_name: data.course_name,
                days: data.total_days,
                hours_per_day: data.hours_per_day
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${data.course_name.replace(/\s+/g, '_')}_Roadmap.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            console.error("Failed to download PDF", err);
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shadow-sm z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-gray-900">Pathfinder AI</h1>
                    <p className="text-xs text-green-500 flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-2">
                                <Bot size={18} />
                            </div>
                        )}

                        <div className={`max-w-[85%] sm:max-w-[70%] space-y-2`}>
                            <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>

                            {/* Result Card */}
                            {msg.type === 'result' && msg.data && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{msg.data.course_name} Roadmap</h3>
                                            <p className="text-xs text-gray-500">{msg.data.total_days} Days • {msg.data.total_hours} Hours Total</p>
                                        </div>
                                        <button
                                            onClick={() => msg.data && handleDownloadPDF(msg.data)}
                                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-bold flex items-center gap-2"
                                        >
                                            <Download size={16} /> PDF
                                        </button>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin">
                                        {msg.data.schedule.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="flex gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                                <div className="w-8 font-bold text-gray-400 text-sm text-center pt-1">D{item.day}</div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800 text-sm">{item.topic}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.activity}</p>
                                                </div>
                                                <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md h-fit text-gray-600 w-fit whitespace-nowrap">
                                                    {item.hours}h
                                                </div>
                                            </div>
                                        ))}
                                        {msg.data.schedule.length > 5 && (
                                            <div className="p-2 text-center text-xs text-gray-400 italic">
                                                + {msg.data.schedule.length - 5} more days in PDF...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0 mt-2">
                                <User size={18} />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your answer here..."
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-4 pl-5 outline-none transition-all shadow-inner"
                        disabled={loading}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LearningPathways;
