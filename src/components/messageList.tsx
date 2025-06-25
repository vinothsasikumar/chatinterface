// src/components/MessageList.tsx
import React from 'react';
import { type MessageListProps } from '../types';

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`p-3 rounded-lg max-w-xs break-words ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;