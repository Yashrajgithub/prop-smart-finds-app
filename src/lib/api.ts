
// Base API URL - replace with your actual MongoDB API endpoint
const API_BASE_URL = "https://your-mongodb-api-endpoint.com/api";

// API request helper with error handling and auth token management
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      // Handle 401 Unauthorized by clearing token and redirecting to login
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Authentication expired. Please log in again.');
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'API request failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Authentication endpoints
export const authApi = {
  // Register a new user
  signup: async (email: string, password: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Login existing user
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Logout current user
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    try {
      return await apiRequest('/auth/me');
    } catch (error) {
      // Token might be expired or invalid
      return null;
    }
  }
};

// User data endpoints
export const userApi = {
  // Create or update user preferences
  updatePreferences: async (userId: string, data: any) => {
    return apiRequest(`/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Get user data
  getUserData: async (userId: string) => {
    return apiRequest(`/users/${userId}`);
  },
  
  // Get user favorites
  getFavorites: async (userId: string) => {
    return apiRequest(`/users/${userId}/favorites`);
  },
  
  // Add property to favorites
  addToFavorites: async (userId: string, propertyId: string) => {
    return apiRequest(`/users/${userId}/favorites/${propertyId}`, {
      method: 'POST',
    });
  },
  
  // Remove property from favorites
  removeFromFavorites: async (userId: string, propertyId: string) => {
    return apiRequest(`/users/${userId}/favorites/${propertyId}`, {
      method: 'DELETE',
    });
  }
};

// Properties endpoints
export const propertyApi = {
  // Get property listings with filters
  getProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    
    return apiRequest(endpoint);
  },
  
  // Get property details
  getProperty: async (propertyId: string) => {
    return apiRequest(`/properties/${propertyId}`);
  },
  
  // Get recommended properties based on user preferences
  getRecommendations: async (userId: string) => {
    return apiRequest(`/properties/recommendations/${userId}`);
  },
  
  // Get AI-powered property compatibility score
  getCompatibilityScore: async (propertyId: string, userId: string) => {
    return apiRequest(`/properties/${propertyId}/compatibility/${userId}`);
  },

  // Search properties with natural language query
  searchWithNLP: async (query: string) => {
    return apiRequest(`/properties/search/nlp`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }
};

// AI analytics endpoints
export const aiApi = {
  // Get market trend analysis
  getMarketTrends: async (location: string) => {
    return apiRequest(`/ai/market-trends/${encodeURIComponent(location)}`);
  },

  // Get price prediction for a property
  getPricePrediction: async (propertyData: any) => {
    return apiRequest('/ai/price-prediction', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  // Generate property description with AI
  generateDescription: async (propertyId: string) => {
    return apiRequest(`/ai/generate-description/${propertyId}`);
  },
  
  // Get personalized insights for user
  getPersonalizedInsights: async (userId: string) => {
    return apiRequest(`/ai/insights/${userId}`);
  }
};
