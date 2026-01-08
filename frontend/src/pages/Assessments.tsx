import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

interface QuizQuestion {
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
}

const Assessments: React.FC = () => {

    // Quiz Generator State
    const [topic, setTopic] = useState('');
    const [generating, setGenerating] = useState(false);
    const [quizMode, setQuizMode] = useState<'list' | 'taking' | 'result'>('list');
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [score, setScore] = useState(0);

    const handleGenerateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setGenerating(true);
        try {
            const res = await api.post('/assessments/generate', { topic });
            setQuizQuestions(res.data);
            setQuizMode('taking');
            setAnswers({}); // Reset answers
        } catch (err) {
            console.error("Failed to generate quiz", err);
            alert("Could not generate quiz. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleOptionSelect = (qIdx: number, option: string) => {
        setAnswers(prev => ({ ...prev, [qIdx]: option }));
    };

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        quizQuestions.forEach((q, idx) => {
            if (answers[idx] === q.correct_option) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setQuizMode('result');
    };

    const resetQuiz = () => {
        setQuizMode('list');
        setTopic('');
        setQuizQuestions([]);
        setAnswers({});
        setScore(0);
    };

    if (quizMode === 'taking' || quizMode === 'result') {
        return (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
                <button
                    onClick={resetQuiz}
                    className="mb-6 flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    <ArrowLeft size={18} className="mr-1" /> Back to Assessments
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 capitalize">{topic} Practice Quiz</h2>
                        <p className="text-gray-500">{quizQuestions.length} Questions • AI Generated</p>
                    </div>

                    {quizMode === 'result' && (
                        <div className={`mb-8 p-6 rounded-2xl text-center ${score >= 3 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            <p className="text-lg font-bold mb-2">Quiz Completed!</p>
                            <p className="text-3xl font-black">{score} / {quizQuestions.length}</p>
                            <p className="text-sm mt-2 opacity-80">
                                {score >= 3 ? "Great job! You've mastered the basics." : "Keep practicing! You'll get there."}
                            </p>
                            <button
                                onClick={resetQuiz}
                                className="mt-4 px-6 py-2 bg-white rounded-xl shadow-sm font-bold text-sm hover:scale-105 transition-transform"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    <div className="space-y-8">
                        {quizQuestions.map((q, idx) => (
                            <div key={idx} className="space-y-3">
                                <p className="font-bold text-gray-800 text-lg">
                                    <span className="text-gray-400 mr-2">{idx + 1}.</span>
                                    {q.question}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {['a', 'b', 'c', 'd'].map((optKey) => {
                                        const optionText = (q as any)[`option_${optKey}`];
                                        const isSelected = answers[idx] === optKey;
                                        const isCorrect = q.correct_option === optKey;

                                        let btnClass = "border-gray-200 hover:border-indigo-300 hover:bg-gray-50";

                                        if (quizMode === 'result') {
                                            if (isCorrect) btnClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                                            else if (isSelected && !isCorrect) btnClass = "border-red-300 bg-red-50 text-red-700";
                                            else btnClass = "border-gray-200 opacity-50";
                                        } else {
                                            if (isSelected) btnClass = "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600";
                                        }

                                        return (
                                            <button
                                                key={optKey}
                                                disabled={quizMode === 'result'}
                                                onClick={() => handleOptionSelect(idx, optKey)}
                                                className={`p-4 rounded-xl border-2 text-left transition-all font-medium ${btnClass}`}
                                            >
                                                {optionText}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {quizMode === 'taking' && (
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(answers).length < quizQuestions.length}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                            >
                                Submit Quiz
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Assessments</h2>
                    <p className="text-gray-500 mt-1">Track your quizzes, exams, and assignments</p>
                </div>
            </div>

            {/* AI Generator Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                            <Sparkles size={14} className="text-yellow-300" /> New Feature
                        </div>
                        <h3 className="text-2xl font-bold mb-2">AI Quiz Generator</h3>
                        <p className="text-indigo-200 mb-6 max-w-md">
                            Instantly generate a practice quiz for any subject. Test your knowledge and get immediate feedback.
                        </p>

                        <form onSubmit={handleGenerateQuiz} className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                placeholder="E.g. Python, React, History..."
                                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-indigo-400/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={generating || !topic}
                                className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {generating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                Generate
                            </button>
                        </form>
                    </div>
                    <div className="hidden lg:block relative h-full min-h-[160px]">
                        {/* Decorative elements representing quiz/learning */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs aspect-video bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="space-y-3 opacity-60">
                                <div className="h-2 bg-white/40 rounded w-3/4"></div>
                                <div className="h-2 bg-white/20 rounded w-1/2"></div>
                                <div className="h-2 bg-white/20 rounded w-5/6"></div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-400/80"></div>
                                <div className="h-8 w-8 rounded-full bg-white/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Assessments;
