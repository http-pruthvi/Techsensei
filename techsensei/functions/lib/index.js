"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedChallenges = exports.updateUserSkills = exports.getUserProfile = exports.generateDocs = exports.refactorCode = exports.generateCode = exports.saveKnowledgeItem = exports.searchKnowledge = exports.generateRoadmap = exports.analyzeRepository = exports.chatWithSensei = exports.simplifyConcept = exports.generateExplanation = exports.onUserCreate = exports.helloWorld = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
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
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
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
            lastActive: firestore_1.FieldValue.serverTimestamp(),
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
var analysis_1 = require("./analysis");
Object.defineProperty(exports, "analyzeRepository", { enumerable: true, get: function () { return analysis_1.analyzeRepository; } });
var roadmap_1 = require("./roadmap");
Object.defineProperty(exports, "generateRoadmap", { enumerable: true, get: function () { return roadmap_1.generateRoadmap; } });
var knowledge_1 = require("./knowledge");
Object.defineProperty(exports, "searchKnowledge", { enumerable: true, get: function () { return knowledge_1.searchKnowledge; } });
Object.defineProperty(exports, "saveKnowledgeItem", { enumerable: true, get: function () { return knowledge_1.saveKnowledgeItem; } });
var copilot_1 = require("./copilot");
Object.defineProperty(exports, "generateCode", { enumerable: true, get: function () { return copilot_1.generateCode; } });
Object.defineProperty(exports, "refactorCode", { enumerable: true, get: function () { return copilot_1.refactorCode; } });
Object.defineProperty(exports, "generateDocs", { enumerable: true, get: function () { return copilot_1.generateDocs; } });
var profile_1 = require("./profile");
Object.defineProperty(exports, "getUserProfile", { enumerable: true, get: function () { return profile_1.getUserProfile; } });
Object.defineProperty(exports, "updateUserSkills", { enumerable: true, get: function () { return profile_1.updateUserSkills; } });
Object.defineProperty(exports, "getRecommendedChallenges", { enumerable: true, get: function () { return profile_1.getRecommendedChallenges; } });
//# sourceMappingURL=index.js.map