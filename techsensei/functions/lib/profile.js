"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedChallenges = exports.updateUserSkills = exports.getUserProfile = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const generative_ai_1 = require("@google/generative-ai");
const db = admin.firestore();
const getGenAI = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    return new generative_ai_1.GoogleGenerativeAI(apiKey);
};
exports.getUserProfile = functions.https.onCall(async (data, context) => {
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const userId = context.auth.uid;
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            // Create initial profile if it doesn't exist
            const initialProfile = {
                xp: 0,
                level: 1,
                streak: 1,
                skills: [
                    { name: 'Coding', level: 1, progress: 0 },
                    { name: 'Problem Solving', level: 1, progress: 0 }
                ],
                achievements: []
            };
            await db.collection('users').doc(userId).set(initialProfile, { merge: true });
            return initialProfile;
        }
        return userDoc.data();
    }
    catch (error) {
        console.error('Get profile error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get profile');
    }
});
exports.updateUserSkills = functions.https.onCall(async (data, context) => {
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { skillName, xpGained } = data;
    const userId = context.auth.uid;
    try {
        const userRef = db.collection('users').doc(userId);
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(userRef);
            if (!doc.exists)
                return;
            const userData = doc.data() || {};
            const skills = userData.skills || [];
            const skillIndex = skills.findIndex((s) => s.name === skillName);
            let newSkills = [...skills];
            if (skillIndex >= 0) {
                const skill = newSkills[skillIndex];
                skill.progress += xpGained;
                if (skill.progress >= 100) {
                    skill.level += 1;
                    skill.progress = skill.progress - 100;
                }
            }
            else {
                newSkills.push({ name: skillName, level: 1, progress: xpGained });
            }
            // Update total XP
            const currentXp = userData.xp || 0;
            const newXp = currentXp + xpGained;
            const newLevel = Math.floor(newXp / 1000) + 1;
            transaction.update(userRef, {
                skills: newSkills,
                xp: newXp,
                level: newLevel
            });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Update skills error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update skills');
    }
});
exports.getRecommendedChallenges = functions.https.onCall(async (data, context) => {
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { skills } = data; // Pass current skills to AI
    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            Based on the following user skills: ${JSON.stringify(skills)},
            Suggest 3 personalized coding challenges to help them improve.
            Return a JSON array where each object has: "title", "description", "difficulty" (Easy/Medium/Hard), "xpReward" (number).
            Do NOT include markdown formatting.
        `;
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|\n```|```/g, '').trim();
        return JSON.parse(text);
    }
    catch (error) {
        console.error('Challenge recommendation error:', error);
        // Fallback challenges
        return [
            { title: 'Refactor a Component', description: 'Take a complex component and break it down.', difficulty: 'Easy', xpReward: 50 },
            { title: 'Build a Todo App', description: 'Create a fully functional Todo app.', difficulty: 'Medium', xpReward: 100 },
            { title: 'Optimize Performance', description: 'Improve the rendering speed of a list.', difficulty: 'Hard', xpReward: 200 }
        ];
    }
});
//# sourceMappingURL=profile.js.map