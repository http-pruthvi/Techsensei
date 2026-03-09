import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/ui';
import { User, Trophy, Star, Zap, TrendingUp, Target, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, getRecommendedChallenges, updateUserSkills } from '../services/userService';
import { SkillRadar } from '../components/profile/SkillRadar';
import type { UserProfile, Challenge } from '../types';

const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                try {
                    const data = await getUserProfile();
                    setProfile(data);

                    // Helper to fetch challenges only if skills exist
                    if (data.skills && data.skills.length > 0) {
                        const recs = await getRecommendedChallenges(data.skills);
                        setChallenges(recs);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [user]);

    const handleSimulateProgress = async () => {
        // Mock function to simulate earning XP
        try {
            await updateUserSkills('Coding', 20);
            const updated = await getUserProfile();
            setProfile(updated);
        } catch (e) {
            console.error(e);
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Profile Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {user?.profile?.avatar ? (
                            <img src={user.profile.avatar} alt="Profile" className="w-full h-full rounded-full" />
                        ) : (
                            <User size={48} className="text-white" />
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold">{user?.username || 'Student'}</h1>
                        <p className="text-blue-100">{user?.email}</p>
                        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                            <div className="px-4 py-2 bg-black/20 rounded-lg flex items-center gap-2">
                                <Trophy size={18} className="text-yellow-400" />
                                <span className="font-bold">{profile?.level || 1}</span> <span className="text-sm opacity-80">Level</span>
                            </div>
                            <div className="px-4 py-2 bg-black/20 rounded-lg flex items-center gap-2">
                                <Star size={18} className="text-yellow-400" />
                                <span className="font-bold">{profile?.xp || 0}</span> <span className="text-sm opacity-80">XP</span>
                            </div>
                            <div className="px-4 py-2 bg-black/20 rounded-lg flex items-center gap-2">
                                <Zap size={18} className="text-orange-400" />
                                <span className="font-bold">{profile?.streak || 0}</span> <span className="text-sm opacity-80">Day Streak</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => signOut()}>
                        Sign Out
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="h-full">
                    <SkillRadar skills={profile?.skills || []} />
                </div>

                {/* Recommended Challenges */}
                <div className="space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Target className="text-red-500" /> Daily Challenges
                            </h3>
                            <Button size="sm" variant="ghost" className="text-xs" onClick={handleSimulateProgress}>
                                Simulate XP Gain
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {challenges.length > 0 ? challenges.map((challenge, idx) => (
                                <div key={idx} className="p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-200">{challenge.title}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                            challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {challenge.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{challenge.description}</p>
                                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-yellow-600 dark:text-yellow-500">
                                        <Award size={14} /> +{challenge.xpReward} XP
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6 text-gray-500 text-sm">
                                    No challenges available. Complete skill assessments first!
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <TrendingUp className="text-green-400" /> Weekly Progress
                        </h3>
                        <div className="flex items-end gap-2 h-32 mt-4">
                            {[30, 45, 25, 60, 75, 50, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/10 rounded-t-sm hover:bg-green-500/50 transition-colors relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
