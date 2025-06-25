export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
}

export interface MessageListProps {
  messages: Message[];
}

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export interface PromptInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  isLoading?: boolean;
}