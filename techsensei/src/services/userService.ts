import { auth } from '../lib/firebase';
import type { UserProfile, Skill, Challenge } from '../types';

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getUserProfile = async (): Promise<UserProfile> => {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'getProfile' })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get profile');
    }

    return await response.json();
};

export const updateUserSkills = async (skillName: string, xpGained: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'updateSkills', skillName, xpGained })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update skills');
    }
};

export const getRecommendedChallenges = async (skills: Skill[]): Promise<Challenge[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'getChallenges', skills })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get challenges');
    }

    return await response.json();
};
