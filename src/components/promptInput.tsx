// src/components/PromptInput.tsx
import React from 'react';
import { type PromptInputProps } from '../types';

const PromptInput: React.FC<PromptInputProps> = ({
    value,
    onChange,
    onSend,
    placeholder = "Ask Anything...",
    isLoading = false,
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sticky bottom-0 bg-white shadow-lg rounded-t-xl z-10">
            <div className="flex items-end bg-gray-100 rounded-full px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                <textarea
                    className="flex-grow bg-transparent outline-none resize-none text-gray-800 placeholder-gray-500 pr-2 pt-1 pb-1 max-h-40 overflow-y-auto"
                    rows={1}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />
                <button
                    onClick={onSend}
                    disabled={isLoading || !value.trim()}
                    className={`ml-2 p-2 w-[20%] flex justify-center ${value.trim() && !isLoading
                            ? 'bg-blue-500 hover:bg-blue-600 text-white rounded-full'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed rounded-lg'
                        } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Ask'
                    )}
                </button>
            </div>
        </div>
    );
};

export default PromptInput;