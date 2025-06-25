// src/components/ChatWindow.tsx
import React, { useState } from 'react';
import MessageList from './messageList';
import PromptInput from './promptInput';
import { type Message } from '../types';

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentInput, setCurrentInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSendMessage = async () => { // Make the function async
        const trimmedInput = currentInput.trim();
        if (!trimmedInput) {
            return; // Do nothing if input is empty
        }

        // 1. Add user's message immediately to the chat
        setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, text: trimmedInput, sender: 'user' },
        ]);
        setCurrentInput(''); // Clear the input field

        // 2. Set loading state to true
        setIsLoading(true);

        try {
            // 3. Make your API call here
            // Replace 'https://your-api-endpoint.com/chat' with your actual API endpoint
            // Adjust method ('POST', 'GET'), headers, and body as per your API
            const response = await fetch('https://primary-production-cab4.up.railway.app/webhook/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers like authorization tokens here
                },
                body: JSON.stringify({
                    question: trimmedInput,
                    // You might send user ID, session ID, etc.
                }),
            });

            if (!response.ok) {
                // Handle non-2xx responses
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const result = await response.json();
            const responseData = result.data.replaceAll('\n', ' ').replaceAll('*', '').replaceAll('"', '');
            console.log("API Response:", responseData); // Log the full API response

            // 4. Add the API's response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: prevMessages.length + 1,
                    text: responseData, // Adjust based on your API's response structure
                    sender: 'other',
                },
            ]);

        } catch (error) {
            console.error('Error making API call:', error);
            // 5. Optionally, display an error message in the chat or console
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: prevMessages.length + 1,
                    text: `Error: Failed to get response. (${(error as Error).message})`,
                    sender: 'other',
                },
            ]);
        } finally {
            // 6. Always set loading state back to false
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-2">
            <div className='flex flex-row justify-between items-center bg-gray-700 mb-2 rounded-md'>
                <img src='/src/assets/ust-white-logo.svg' alt='UST' className='p-2' />
                <img src='/src/assets/logo.independence.svg' alt='UST' className='p-2 w-[20%]' />
            </div>
            <div className="flex-grow overflow-y-auto p-4 bg-white rounded-md shadow-md mb-4">
                <MessageList messages={messages} />
            </div>
            <PromptInput
                value={currentInput}
                onChange={setCurrentInput}
                onSend={handleSendMessage} // This will now trigger the API call
                isLoading={isLoading}
            />
        </div>
    );
};

export default ChatWindow;