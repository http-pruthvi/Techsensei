import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../store/useAppStore';
import { Button, Card } from '../ui';
import type { ThemePreference, ContentPreference, UserPreferences } from '../../types';

export const PreferencesSettings: React.FC = () => {
    const { user, updateUserPreferences } = useAuth();
    const { setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [localPreferences, setLocalPreferences] = useState<UserPreferences>(user?.preferences || {
        themePreference: 'system',
        contentPreference: 'mixed',
        notificationSettings: {
            email: true,
            push: true,
            learningReminders: true,
            weeklyProgress: true,
        },
        defaultLevel: 'beginner'
    } as UserPreferences);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            await updateUserPreferences(localPreferences);

            // Global theme update is handled by side effect or we can set it here if needed immediately
            // But updateUserPreferences updates the user object in store, so theme might update if derived from user.preferences
            // However, useTheme store handles theme separately usually.
            setTheme(localPreferences.themePreference as ThemePreference);

            setMessage({ type: 'success', text: 'Preferences updated successfully!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to update preferences.' });
        } finally {
            setLoading(false);
        }
    };

    const toggleNotification = (key: keyof typeof localPreferences.notificationSettings) => {
        setLocalPreferences(prev => ({
            ...prev,
            notificationSettings: {
                ...prev.notificationSettings,
                [key]: !prev.notificationSettings[key]
            }
        }));
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Preferences</h2>

            {message && (
                <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-8">
                {/* Appearance Section */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Appearance</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {(['light', 'dark', 'system'] as const).map((themeMode) => (
                            <button
                                key={themeMode}
                                onClick={() => setLocalPreferences(prev => ({ ...prev, themePreference: themeMode }))}
                                className={`p-4 rounded-lg border-2 transition-all ${localPreferences.themePreference === themeMode
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <div className="capitalize font-medium text-gray-900 dark:text-white">{themeMode}</div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Content Section */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Learning Content Style</h3>
                    <div className="space-y-3">
                        {(['visual', 'textual', 'mixed'] as const).map((style) => (
                            <label key={style} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                                <input
                                    type="radio"
                                    name="contentPreference"
                                    value={style}
                                    checked={localPreferences.contentPreference === style}
                                    onChange={(e) => setLocalPreferences(prev => ({ ...prev, contentPreference: e.target.value as ContentPreference }))}
                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                />
                                <span className="capitalize text-gray-700 dark:text-gray-300">{style}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Notifications Section */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Notifications</h3>
                    <div className="space-y-4">
                        {[
                            { key: 'email', label: 'Email Notifications' },
                            { key: 'push', label: 'Push Notifications' },
                            { key: 'learningReminders', label: 'Learning Reminders' },
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                                <input
                                    type="checkbox"
                                    checked={localPreferences.notificationSettings[key as keyof typeof localPreferences.notificationSettings]}
                                    onChange={() => toggleNotification(key as keyof typeof localPreferences.notificationSettings)}
                                    className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                                />
                            </label>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button onClick={handleSave} loading={loading}>
                        Save Preferences
                    </Button>
                </div>
            </div>
        </Card>
    );
};
