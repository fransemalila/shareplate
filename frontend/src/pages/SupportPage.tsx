import React, { useState, useEffect } from 'react';
import { AdditionalService } from '../services/additionalService';
import { SupportTicket, SupportMessage } from '../types';
import { api } from '../services/api';

const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general' as SupportTicket['category'],
    priority: 'low' as SupportTicket['priority'],
    attachments: [] as File[],
  });
  const [newMessage, setNewMessage] = useState({
    content: '',
    attachments: [] as File[],
  });

  const additionalService = new AdditionalService(api);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const loadTickets = async () => {
    try {
      const data = await additionalService.getUserTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (ticketId: string) => {
    try {
      const data = await additionalService.getTicketMessages(ticketId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await additionalService.createSupportTicket(
        newTicket.subject,
        newTicket.description,
        newTicket.category,
        newTicket.priority,
        newTicket.attachments
      );
      setNewTicket({
        subject: '',
        description: '',
        category: 'general',
        priority: 'low',
        attachments: [],
      });
      loadTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await additionalService.addTicketMessage(
        selectedTicket.id,
        newMessage.content,
        newMessage.attachments
      );
      setNewMessage({ content: '', attachments: [] });
      loadMessages(selectedTicket.id);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'ticket' | 'message') => {
    const files = Array.from(e.target.files || []);
    if (type === 'ticket') {
      setNewTicket(prev => ({ ...prev, attachments: files }));
    } else {
      setNewMessage(prev => ({ ...prev, attachments: files }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="mt-2 text-gray-600">
          Need help? Create a support ticket and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ticket List */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={e => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={e => setNewTicket(prev => ({ ...prev, category: e.target.value as SupportTicket['category'] }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="report">Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={e => setNewTicket(prev => ({ ...prev, priority: e.target.value as SupportTicket['priority'] }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={e => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attachments</label>
                  <input
                    type="file"
                    onChange={e => handleFileChange(e, 'ticket')}
                    multiple
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow">
            <h2 className="p-4 text-xl font-semibold border-b">Your Tickets</h2>
            <div className="divide-y">
              {tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors
                    ${selectedTicket?.id === ticket.id ? 'bg-green-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full
                      ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="md:col-span-2">
          {selectedTicket ? (
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>#{selectedTicket.id}</span>
                  <span>{selectedTicket.category}</span>
                  <span>{selectedTicket.priority}</span>
                  <span>{selectedTicket.status}</span>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isStaffResponse ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-lg rounded-lg p-4
                      ${message.isStaffResponse
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-green-100 text-green-900'}`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-blue-600 hover:underline"
                            >
                              Attachment {index + 1}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t">
                <form onSubmit={handleAddMessage}>
                  <div className="space-y-4">
                    <textarea
                      value={newMessage.content}
                      onChange={e => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Type your message..."
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <div>
                      <input
                        type="file"
                        onChange={e => handleFileChange(e, 'message')}
                        multiple
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-green-50 file:text-green-700
                          hover:file:bg-green-100"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">Select a ticket to view messages</h3>
              <p className="mt-2 text-gray-600">
                Choose a ticket from the list on the left to view its conversation history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage; 