import { AxiosInstance } from 'axios';
import { Api } from './api';
import {
  SavedListing,
  Report,
  FAQCategory,
  FAQItem,
  SupportTicket,
  SupportMessage
} from '../types';

export class AdditionalService {
  constructor(private readonly api: Api) {}

  // Favorites
  async getSavedListings(): Promise<SavedListing[]> {
    const response = await this.api.axiosInstance.get<SavedListing[]>('/users/saved-listings');
    return response.data;
  }

  async saveListing(listingId: string, notes?: string): Promise<SavedListing> {
    const response = await this.api.axiosInstance.post<SavedListing>('/users/saved-listings', {
      listingId,
      notes
    });
    return response.data;
  }

  async removeSavedListing(listingId: string): Promise<void> {
    await this.api.axiosInstance.delete(`/users/saved-listings/${listingId}`);
  }

  // Reports
  async createReport(
    targetType: Report['targetType'],
    targetId: string,
    reason: string,
    details: string
  ): Promise<Report> {
    const response = await this.api.axiosInstance.post<Report>('/reports', {
      targetType,
      targetId,
      reason,
      details
    });
    return response.data;
  }

  async getUserReports(): Promise<Report[]> {
    const response = await this.api.axiosInstance.get<Report[]>('/users/reports');
    return response.data;
  }

  // FAQ
  async getFAQCategories(): Promise<FAQCategory[]> {
    const response = await this.api.axiosInstance.get<FAQCategory[]>('/faq/categories');
    return response.data;
  }

  async getFAQItems(categoryId?: string): Promise<FAQItem[]> {
    const url = categoryId ? `/faq/categories/${categoryId}/items` : '/faq/items';
    const response = await this.api.axiosInstance.get<FAQItem[]>(url);
    return response.data;
  }

  // Support Tickets
  async createSupportTicket(
    subject: string,
    description: string,
    category: SupportTicket['category'],
    priority: SupportTicket['priority'],
    attachments?: File[]
  ): Promise<SupportTicket> {
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('priority', priority);
    
    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await this.api.axiosInstance.post<SupportTicket>('/support/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async getUserTickets(): Promise<SupportTicket[]> {
    const response = await this.api.axiosInstance.get<SupportTicket[]>('/support/tickets');
    return response.data;
  }

  async getTicketMessages(ticketId: string): Promise<SupportMessage[]> {
    const response = await this.api.axiosInstance.get<SupportMessage[]>(`/support/tickets/${ticketId}/messages`);
    return response.data;
  }

  async addTicketMessage(ticketId: string, content: string, attachments?: File[]): Promise<SupportMessage> {
    const formData = new FormData();
    formData.append('content', content);
    
    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await this.api.axiosInstance.post<SupportMessage>(
      `/support/tickets/${ticketId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  // Social Sharing
  async getShareLink(listingId: string): Promise<string> {
    const response = await this.api.axiosInstance.get<{ url: string }>(`/listings/${listingId}/share`);
    return response.data.url;
  }

  // Legal Documents
  async getTermsOfService(): Promise<string> {
    const response = await this.api.axiosInstance.get<{ content: string }>('/legal/terms');
    return response.data.content;
  }

  async getPrivacyPolicy(): Promise<string> {
    const response = await this.api.axiosInstance.get<{ content: string }>('/legal/privacy');
    return response.data.content;
  }

  async getUserGuidelines(): Promise<string> {
    const response = await this.api.axiosInstance.get<{ content: string }>('/legal/guidelines');
    return response.data.content;
  }
} 