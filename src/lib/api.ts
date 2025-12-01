/**
 * WordPress API Client
 * Connects to the NetApp Campaign WordPress plugin REST API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost';
const API_ENDPOINT = `${API_BASE_URL}/wp-json/netapp-campaign/v1`;

// Session token management using localStorage
const SESSION_TOKEN_KEY = 'netapp_campaign_token';

export const sessionStorage = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SESSION_TOKEN_KEY);
    }
    return null;
  },
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    }
  },
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  },
};

// Get nonce from WordPress (if available)
const getNonce = () => {
  if (typeof window !== 'undefined') {
    // Try to get nonce from meta tag or cookie
    const metaTag = document.querySelector('meta[name="wp-nonce"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }
  }
  return null;
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const nonce = getNonce();
  const token = sessionStorage.getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (nonce) {
    headers['X-WP-Nonce'] = nonce;
  }
  
  // Add session token to Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // Also send as custom header for backward compatibility
    headers['X-Session-Token'] = token;
  }

  const response = await fetch(`${API_ENDPOINT}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for session (if same domain)
    mode: 'cors', // Enable CORS
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Types
export interface Day {
  day_number: number;
  day_date: string | null;
  prize_name: string;
  prize_image: string | null;
  is_current: boolean;
  is_available: boolean;
  is_locked: boolean;
  is_completed: boolean;
  is_correct: boolean | null;
}

export interface DayDetails {
  day_number: number;
  day_date: string | null;
  prize_name: string;
  prize_image: string | null;
  question: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  // Only included if already_answered is true (for security)
  correct_answer?: string;
  correct_answer_text?: string;
  already_answered: boolean;
  user_answer: string | null;
  is_correct: boolean | null;
}

export interface AnswerResponse {
  success: boolean;
  is_correct: boolean;
  correct_answer: string;
  correct_answer_text: string;
  message: string;
}

export interface DashboardResponse {
  success: boolean;
  campaign_id: number;
  current_day: number | null;
  days: Day[];
  total_days?: number;
}

export interface SessionResponse {
  success: boolean;
  token?: string;
  session?: {
    id: number;
    email: string;
    campaign_id: number;
  };
}

// API Methods
export const campaignAPI = {
  /**
   * Register a new user
   */
  async register(
    email: string, 
    firstName?: string, 
    lastName?: string, 
    company?: string, 
    jobTitle?: string, 
    businessPhone?: string
  ): Promise<SessionResponse> {
    return apiRequest<SessionResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        company: company,
        job_title: jobTitle,
        business_phone: businessPhone,
      }),
    });
  },

  /**
   * Create or get session
   */
  async createSession(email: string): Promise<SessionResponse> {
    const response = await apiRequest<SessionResponse>('/session', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    // Store token in localStorage if we got one
    if (response.success && response.token) {
      sessionStorage.setToken(response.token);
    }
    
    return response;
  },

  /**
   * Get current session
   */
  async getSession(): Promise<SessionResponse> {
    // Check if we have a token in localStorage first
    const token = sessionStorage.getToken();
    
    if (!token) {
      // No token in localStorage, return early
      return {
        success: false,
        session: null,
        token: null,
      };
    }
    
    try {
      const response = await apiRequest<SessionResponse>('/session', {
        method: 'GET',
      });
      
      // If session is invalid, clear the token
      if (!response.success || !response.session) {
        sessionStorage.removeToken();
      } else if (response.token) {
        // Update token if a new one is provided
        sessionStorage.setToken(response.token);
      }
      // If session is valid but no token in response, keep existing token
      
      return response;
    } catch (error) {
      // On error, clear token and return failure
      sessionStorage.removeToken();
      return {
        success: false,
        session: null,
        token: null,
      };
    }
  },

  /**
   * Get dashboard data
   */
  async getDashboard(): Promise<DashboardResponse> {
    return apiRequest<DashboardResponse>('/dashboard');
  },

  /**
   * Get day details
   */
  async getDayDetails(dayNumber: number): Promise<{ success: boolean; day: DayDetails }> {
    return apiRequest<{ success: boolean; day: DayDetails }>(`/day/${dayNumber}`);
  },

  /**
   * Submit answer
   */
  async submitAnswer(dayNumber: number, answer: string): Promise<AnswerResponse> {
    return apiRequest<AnswerResponse>('/answer', {
      method: 'POST',
      body: JSON.stringify({
        day_number: dayNumber,
        answer,
      }),
    });
  },

  /**
   * Get user progress
   */
  async getProgress(): Promise<{
    success: boolean;
    progress: {
      total_days: number;
      completed_days: number;
      correct_answers: number;
      incorrect_answers: number;
      completed_day_numbers: number[];
    } | null;
  }> {
    return apiRequest('/progress');
  },
};

