import { Property, Enquiry, SupabaseConfig } from '../types/property';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

const TOKEN_KEY = 'paschal_admin_token';

export const api = {
  // Auth
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async login(username: string, password: string): Promise<{ token: string; username: string; role: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to authenticate');
    }
    this.setToken(data.token);
    return data;
  },

  async checkAuth(): Promise<{ username: string; role: string } | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) {
        this.clearToken();
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } finally {
      this.clearToken();
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update password');
    }
    return data;
  },

  // Properties
  async getProperties(): Promise<Property[]> {
    try {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to fetch properties');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_PROPERTIES;
    } catch (err) {
      console.warn('Using local initial properties as fallback:', err);
      return INITIAL_PROPERTIES;
    }
  },

  async getProperty(id: string): Promise<Property | null> {
    try {
      const res = await fetch(`/api/properties/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return INITIAL_PROPERTIES.find(p => p.id === id || p.slug === id) || null;
    }
  },

  async createProperty(property: Partial<Property>): Promise<Property> {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(property)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create property');
    return data;
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update property');
    return data;
  },

  async updateAvailability(id: string, availability: string): Promise<Property> {
    const res = await fetch(`/api/properties/${id}/availability`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ availability })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update availability');
    return data;
  },

  async deleteProperty(id: string): Promise<void> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete property');
    }
  },

  // Enquiries
  async submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');
    return data;
  },

  async getEnquiries(): Promise<Enquiry[]> {
    const res = await fetch('/api/enquiries', {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load enquiries');
    return await res.json();
  },

  async updateEnquiryStatus(id: string, status: string): Promise<Enquiry> {
    const res = await fetch(`/api/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update enquiry status');
    return data;
  },

  async deleteEnquiry(id: string): Promise<void> {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete enquiry');
  },

  // Supabase Config
  async getSupabaseConfig(): Promise<SupabaseConfig> {
    const res = await fetch('/api/supabase/config', {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch Supabase config');
    return await res.json();
  },

  async saveSupabaseConfig(config: Partial<SupabaseConfig>): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/supabase/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save Supabase config');
    return data;
  },

  async syncSupabaseDatabase(): Promise<{ success: boolean; message: string; count?: number }> {
    const res = await fetch('/api/supabase/sync', {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to sync with Supabase');
    return data;
  },

  // Image Upload
  async uploadImage(dataUrl: string, fileName?: string): Promise<string> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ dataUrl, fileName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload image');
    return data.url;
  }
};
