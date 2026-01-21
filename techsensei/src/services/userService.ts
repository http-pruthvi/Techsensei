import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import type { UserProfile, Skill, Challenge } from '../types';

export const getUserProfile = async (): Promise<UserProfile> => {
    const call = httpsCallable<void, UserProfile>(functions, 'getUserProfile');
    const result = await call();
    return result.data;
};

export const updateUserSkills = async (skillName: string, xpGained: number): Promise<void> => {
    const call = httpsCallable<{ skillName: string, xpGained: number }, void>(functions, 'updateUserSkills');
    await call({ skillName, xpGained });
};

export const getRecommendedChallenges = async (skills: Skill[]): Promise<Challenge[]> => {
    const call = httpsCallable<{ skills: Skill[] }, Challenge[]>(functions, 'getRecommendedChallenges');
    const result = await call({ skills });
    return result.data;
};
