import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState({
        fullname: 'Loading...',
        email: '...',
        avatar: 'https://ui-avatars.com/api/?name=User',
        title: 'Learner',
        bio: 'No bio yet.'
    });

    const [editForm, setEditForm] = useState({ ...user });

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                try {
                    // Fetch latest from API
                    const res = await api.get(`/auth/users`);
                    // Note: We don't have a specific /users/{id} or /me endpoint yet in auth routes easily accessible 
                    // without matching ID. 
                    // Let's use the new profile logic if we can, or just filter from /users (inefficient but works for now)
                    // Actually, I can add a simple GET /auth/profile/{id} or just use the PUT response.

                    // Better approach: Since I don't want to change backend again if not needed, 
                    // I'll check if I can rely on localStorage for now, OR validly use the array.
                    // But to be robust as promised:
                    const foundUser = res.data.find((u: any) => u.id === parsed.id);

                    if (foundUser) {
                        const userData = {
                            ...user,
                            fullname: foundUser.fullname || 'Student',
                            email: foundUser.email,
                            title: foundUser.profile?.title || 'Learner',
                            bio: foundUser.profile?.bio || 'No bio yet.',
                            avatar: foundUser.profile?.avatar || `https://ui-avatars.com/api/?name=${foundUser.fullname}&background=0D8ABC&color=fff`
                        };
                        setUser(userData);
                        setEditForm(userData);

                        // Sync localStorage
                        localStorage.setItem('user', JSON.stringify({
                            ...parsed,
                            fullname: foundUser.fullname,
                            email: foundUser.email
                        }));
                    }
                } catch (e) {
                    console.error("Failed to fetch fresh user data", e);
                    // Fallback to local storage
                    const userData = {
                        ...user,
                        fullname: parsed.fullname || 'Student',
                        email: parsed.email || 'student@lms.com',
                        avatar: `https://ui-avatars.com/api/?name=${parsed.fullname}&background=0D8ABC&color=fff`
                    };
                    setUser(userData);
                    setEditForm(userData);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Clear user session
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Redirect to login
        navigate('/login');
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Get user ID
            const userJson = localStorage.getItem('user');
            if (!userJson) {
                alert("Session expired. Please login again.");
                navigate('/login');
                return;
            }
            const currentUser = JSON.parse(userJson);

            if (!currentUser.id) {
                alert("Invalid user session. Please login again.");
                navigate('/login');
                return;
            }

            // API Call
            const url = `/auth/profile/${currentUser.id}`;
            console.log("Saving profile to:", url);
            console.log("Payload:", { fullname: editForm.fullname, email: editForm.email, bio: editForm.bio });

            const res = await api.put(url, {
                fullname: editForm.fullname,
                email: editForm.email,
                bio: editForm.bio
            });

            // Update local state
            const updatedUser = {
                ...user,
                fullname: res.data.fullname,
                email: res.data.email,
                // If backend returns profile data nested, handle it. 
                // Currently UserResponse schema doesn't include profile fields deeper than 'profile' relation 
                // but we can assume simplicity or fetch fresh.
                // Let's rely on what we sent for optimistic update or refetch.
                bio: editForm.bio
            };

            setUser(updatedUser);

            // Update localStorage
            localStorage.setItem('user', JSON.stringify({
                ...currentUser,
                fullname: res.data.fullname,
                email: res.data.email
            }));

            alert('Profile updated successfully!');
            setActiveTab('overview');
        } catch (err: any) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile: " + (err.response?.data?.detail || err.message));
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'edit':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.fullname}
                                    onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('overview')}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'settings':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                        <div className="space-y-6 max-w-lg">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive emails about your progress</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl"></div>
                        <div className="px-8 pb-8 bg-white rounded-b-2xl shadow-sm border border-gray-100">
                            <div className="relative flex justify-between items-end -mt-12 mb-6">
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                                />
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.fullname}</h1>
                                <p className="text-gray-500">{user.title}</p>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <h3 className="text-gray-900 font-semibold mb-2">About</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {user.bio}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <h3 className="text-gray-900 font-semibold mb-2">Contact</h3>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span>📧</span> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '👤' },
        { id: 'edit', label: 'Edit Profile', icon: '✏️' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Profile Menu</h2>
                        </div>
                        <nav className="p-2 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
                            >
                                <span>🚪</span>
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
