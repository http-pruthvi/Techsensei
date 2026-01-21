import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Example Cloud Function - Hello World
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from TechSensei!");
});

// Example Cloud Function - User Creation Trigger
export const onUserCreate = functions.auth.user().onCreate(async (user: functions.auth.UserRecord) => {
  const { uid, email, displayName } = user;

  // Create user profile in Firestore
  const userProfile = {
    uid,
    email: email || '',
    displayName: displayName || email?.split('@')[0] || 'User',
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
  } catch (error) {
    functions.logger.error(`Error creating user profile for ${uid}:`, error);
  }
});

// Placeholder for future AI functions
export { generateExplanation, simplifyConcept } from './explanation';
export { chatWithSensei } from './chat';

export { analyzeRepository } from './analysis';
export { generateRoadmap } from './roadmap';
export { searchKnowledge, saveKnowledgeItem } from './knowledge';
export { generateCode, refactorCode, generateDocs } from './copilot';
export { getUserProfile, updateUserSkills, getRecommendedChallenges } from './profile';