import React, { useState } from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { sendChatMessage } from '../services/aiService';
import { useAuth } from '../hooks/useAuth';
import { Bot } from 'lucide-react';

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

const Assistant: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (text: string) => {
        if (!user) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setLoading(true);

        try {
            // Transform internal message format to history format for API
            const history = messages.map(m => ({
                role: m.role,
                parts: m.text
            }));

            const result = await sendChatMessage({
                message: text,
                history,
                userId: user.id
            });

            const newAiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: result.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMsg]);
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "I'm sorry, I encountered an error answering that. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-80px)]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Bot className="text-primary-500" /> Learning Assistant
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Your personal AI tutor. Ask questions, get code examples, or debug issues together.
                </p>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={loading}
            />
        </div>
    );
};

export default Assistant;
