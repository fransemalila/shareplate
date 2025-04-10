import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Conversation, User } from '../../types';
import { api } from '../../services/api';
import Button from '../common/Button';

interface ConversationListProps {
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedId,
  onSelect,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Record<string, User>>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await api.getConversations();
      setConversations(response.conversations);
      
      // Load participant details
      const userIds = new Set<string>();
      response.conversations.forEach((conv: Conversation) => {
        conv.participants.forEach(id => userIds.add(id));
      });

      const users: Record<string, User> = {};
      await Promise.all(
        Array.from(userIds).map(async (id) => {
          try {
            const user = await api.getUserById(id);
            users[id] = user;
          } catch (err) {
            console.error(`Failed to load user ${id}:`, err);
          }
        })
      );
      setParticipants(users);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit'
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    } else {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getParticipantName = (conversation: Conversation) => {
    const otherParticipants = conversation.participants.filter(
      id => participants[id] && id !== api.getCurrentUserId()
    );
    
    if (otherParticipants.length === 0) return 'Unknown User';
    if (otherParticipants.length === 1) return participants[otherParticipants[0]]?.name || 'Unknown User';
    return `${participants[otherParticipants[0]]?.name || 'Unknown'} + ${otherParticipants.length - 1} others`;
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
        <Button variant="outline" onClick={loadConversations}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500">
          <div>
            <p className="mb-4">No conversations yet</p>
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
            >
              Find Users to Message
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedId === conversation.id ? 'bg-green-50' : ''
              }`}
              onClick={() => onSelect(conversation)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {getParticipantName(conversation)}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(conversation.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-green-100 bg-green-600 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationList; 