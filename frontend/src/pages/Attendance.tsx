import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Flame, Trophy, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface AttendanceRecord {
    id: number;
    date: string;
    status: string;
}

const Attendance: React.FC = () => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [streak, setStreak] = useState(0);
    const [stats, setStats] = useState({ totalActive: 0, maxStreak: 0 });
    const [loading, setLoading] = useState(true);
    const [yearData, setYearData] = useState<{ date: Date; count: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dynamic User ID
                let userId = 1;
                const userJson = localStorage.getItem('user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    if (user.id) userId = user.id;
                }

                // Fetch basic streak
                const streakRes = await api.get(`/attendance/${userId}/streak`);
                setStreak(streakRes.data.streak);

                // Fetch history
                const historyRes = await api.get(`/attendance/${userId}`);
                setRecords(historyRes.data);
                processData(historyRes.data);
            } catch (err) {
                console.error("Failed to fetch attendance data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const processData = (data: AttendanceRecord[]) => {
        // 1. Calculate Stats
        const uniqueDates = new Set(data.map(r => new Date(r.date).toDateString()));
        const sortedDates = Array.from(uniqueDates)
            .map(d => new Date(d))
            .sort((a, b) => a.getTime() - b.getTime());

        // Max Streak Logic
        let maxStreak = 0;
        let currentRun = 0;
        let prevDate: Date | null = null;

        if (sortedDates.length > 0) {
            currentRun = 1;
            maxStreak = 1;
            prevDate = sortedDates[0];

            for (let i = 1; i < sortedDates.length; i++) {
                const d = sortedDates[i];
                const diffTime = Math.abs(d.getTime() - prevDate!.getTime());
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentRun++;
                } else {
                    currentRun = 1;
                }
                if (currentRun > maxStreak) maxStreak = currentRun;
                prevDate = d;
            }
        }
        setStats({ totalActive: uniqueDates.size, maxStreak });

        // 2. Generate Year Grid Data (Last 365 days / 52 weeks)
        // We want to align columns by weeks (Sun-Sat).
        // Let's generate dates backwards from today to fill ~53 weeks columns.

        const today = new Date();
        const days: { date: Date; count: number }[] = [];
        // Start from 52 weeks ago (approx 364 days), adjusted to start on a Sunday if needed for perfect grid
        // Simpler approach: Just last 365 days, render row-major in CSS grid (7 rows).

        for (let i = 364; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            const dateStr = d.toDateString();
            // Count activity for this day
            const count = data.filter(r => new Date(r.date).toDateString() === dateStr).length;
            days.push({ date: d, count });
        }
        setYearData(days);
    };

    const getIntensityClass = (count: number) => {
        if (count === 0) return 'bg-[#ebedf0]'; // LeetCode empty gray
        if (count === 1) return 'bg-[#9be9a8]'; // Light green
        if (count <= 3) return 'bg-[#40c463]'; // Medium green
        if (count <= 5) return 'bg-[#30a14e]'; // Dark green
        return 'bg-[#216e39]'; // Darkest green
    };

    // Helper to render graph
    const renderGraph = () => {
        // We need to pivot the linear days array into columns (weeks).
        // Each column has 7 cells (Sun -> Sat).
        // However, standard "GitHub/LeetCode" graphs fill columns.

        // Split data into weeks
        const weeks = [];
        let currentWeek: { date: Date; count: number }[] = [];

        // Find the day of week of the first data point
        // If first day is Tuesday (2), we need to add 2 empty placeholders before it? 
        // Or simply aligning the grid. 
        // CSS Grid with explicit columns is easiest.
        // grid-rows-7 grid-flow-col

        return (
            <div className="flex flex-col">
                {/* Month Labels */}
                <div className="flex text-xs text-gray-400 mb-2 pl-8">
                    {/* Simplified month logic: every ~4.3 weeks */}
                    <span className="w-[12px] mr-[2px]"></span> {/* Spacer for day labels */}
                    {/* We can programmatically place them, but for fixed 52 weeks, manual spacing is okay-ish */}
                    <div className="flex justify-between w-full pr-8">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                <div className="flex">
                    {/* Day Labels */}
                    <div className="flex flex-col justify-between text-[10px] text-gray-400 mr-2 h-[90px] py-1">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                    </div>

                    {/* The Grid */}
                    <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                        {yearData.map((day, idx) => (
                            <div
                                key={idx}
                                className={`w-[11px] h-[11px] rounded-[2px] ${getIntensityClass(day.count)} relative group`}
                                data-tooltip={`${day.count} submissions on ${day.date.toDateString()}`}
                            >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                    {day.count} activities on {day.date.toLocaleDateString()}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Study Plan</h2>
                <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                    <Clock size={14} />
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats - LeetCode Style (Simple Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <Flame size={20} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{streak}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Current Streak</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <Trophy size={20} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{stats.maxStreak}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Max Streak</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{stats.totalActive}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Active Days</div>
                    </div>
                </div>
            </div>

            {/* Contribution Graph */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-6">Yearly Activity</h3>

                <div className="overflow-x-auto pb-4">
                    {renderGraph()}
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 pl-8">
                    <span>Less</span>
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-[#ebedf0]"></div>
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-[#9be9a8]"></div>
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-[#40c463]"></div>
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-[#30a14e]"></div>
                    <div className="w-[11px] h-[11px] rounded-[2px] bg-[#216e39]"></div>
                    <span>More</span>
                </div>
            </div>

        </div>
    );
};

export default Attendance;
