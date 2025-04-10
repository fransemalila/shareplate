import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, User } from '../../types';
import { api } from '../../services/api';
import Button from '../common/Button';

interface ConversationViewProps {
  conversation: Conversation;
  onBack?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [participants, setParticipants] = useState<Record<string, User>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadMessages();
    loadParticipants();
    const loadCurrentUser = async () => {
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error loading current user:', err);
      }
    };
    loadCurrentUser();
  }, [conversation.id]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.getMessages(conversation.id);
      setMessages(response.messages);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    const users: Record<string, User> = {};
    await Promise.all(
      conversation.participants.map(async (id) => {
        try {
          const user = await api.getUser(id);
          if (user) {
            users[id] = user;
          }
        } catch (err) {
          console.error(`Failed to load user ${id}:`, err);
        }
      })
    );
    setParticipants(users);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await api.sendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      // Show error toast or notification here
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  };

  const isCurrentUser = (userId: string) => {
    return userId === currentUser?.id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={loadMessages}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <h2 className="text-lg font-semibold text-gray-900">
          {conversation.participants
            .filter(id => !isCurrentUser(id))
            .map(id => participants[id]?.name || 'Unknown User')
            .join(', ')}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => {
          const isUser = isCurrentUser(message.senderId);
          const showAvatar = index === 0 || 
            messages[index - 1].senderId !== message.senderId;

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] ${
                  isUser ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-900'
                } rounded-lg px-4 py-2`}
              >
                {showAvatar && !isUser && (
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {participants[message.senderId]?.name || 'Unknown User'}
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    isUser ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(message.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="px-6"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView; 