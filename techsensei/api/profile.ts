import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { verifyAuth, handleOptions, errorResponse, successResponse } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return handleOptions(res);
    }

    if (req.method !== 'POST') {
        return errorResponse(res, 'Method not allowed', 405);
    }

    const decodedToken = await verifyAuth(req);
    if (!decodedToken) {
        return errorResponse(res, 'Unauthorized', 401);
    }

    try {
        const { action, ...data } = req.body || {};
        const db = admin.firestore();
        const uid = decodedToken.uid;

        if (action === 'getProfile') {
            const userDoc = await db.collection('users').doc(uid).get();
            if (!userDoc.exists) {
                return errorResponse(res, 'User not found', 404);
            }
            return successResponse(res, userDoc.data());
        } else if (action === 'updateSkills') {
            const { skillName, xpGained } = data;
            await db.collection('users').doc(uid).update({
                [`progress.skillLevels.${skillName}`]: admin.firestore.FieldValue.increment(xpGained),
                'progress.lastActive': admin.firestore.FieldValue.serverTimestamp()
            });
            return successResponse(res, { success: true });
        } else if (action === 'getChallenges') {
            const challenges = [
                { title: 'Code Review Master', description: 'Review 5 PRs', difficulty: 'intermediate', xpReward: 500 },
                { title: 'Type Safety First', description: 'Fix 10 any types', difficulty: 'beginner', xpReward: 200 }
            ];
            return successResponse(res, challenges);
        } else {
            return errorResponse(res, 'Invalid action', 400);
        }
    } catch (error: unknown) {
        console.error('Profile Error:', error);
        return errorResponse(res, (error as Error).message || 'Internal Server Error');
    }
}
