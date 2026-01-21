"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRepository = exports.chatWithSensei = exports.simplifyConcept = exports.generateExplanation = exports.onUserCreate = exports.helloWorld = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
// Initialize Firebase Admin
admin.initializeApp();
// Example Cloud Function - Hello World
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from TechSensei!");
});
// Example Cloud Function - User Creation Trigger
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName } = user;
    // Create user profile in Firestore
    const userProfile = {
        uid,
        email: email || '',
        displayName: displayName || (email === null || email === void 0 ? void 0 : email.split('@')[0]) || 'User',
        profile: {
            currentLevel: 'beginner',
            contentPreference: 'mixed',
            skillAreas: [],
            goals: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        preferences: {
            theme: 'system',
            notifications: true,
            emailUpdates: true,
        },
        progress: {
            totalLearningTime: 0,
            streakDays: 0,
            completedRoadmaps: [],
            skillLevels: {},
            lastActive: admin.firestore.FieldValue.serverTimestamp(),
        },
    };
    try {
        await admin.firestore().collection('users').doc(uid).set(userProfile);
        functions.logger.info(`User profile created for ${uid}`);
    }
    catch (error) {
        functions.logger.error(`Error creating user profile for ${uid}:`, error);
    }
});
// Placeholder for future AI functions
var explanation_1 = require("./explanation");
Object.defineProperty(exports, "generateExplanation", { enumerable: true, get: function () { return explanation_1.generateExplanation; } });
Object.defineProperty(exports, "simplifyConcept", { enumerable: true, get: function () { return explanation_1.simplifyConcept; } });
var chat_1 = require("./chat");
Object.defineProperty(exports, "chatWithSensei", { enumerable: true, get: function () { return chat_1.chatWithSensei; } });
exports.analyzeRepository = functions.https.onCall(async (data, context) => {
    // TODO: Implement GitHub API and tree-sitter integration
    if (!(context === null || context === void 0 ? void 0 : context.auth)) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { repoUrl } = data;
    console.log('Analyzing repo:', repoUrl); // Suppress unused warning
    // Mock response for now
    return {
        analysis: {
            languages: [
                { name: 'TypeScript', percentage: 70, files: ['src/main.ts'] },
                { name: 'JavaScript', percentage: 30, files: ['config.js'] }
            ],
            frameworks: ['React', 'Node.js'],
            architecture: 'Single Page Application',
            complexity: {
                score: 6,
                factors: ['Moderate complexity'],
                recommendations: ['Add more tests']
            }
        }
    };
});
//# sourceMappingURL=index.js.map