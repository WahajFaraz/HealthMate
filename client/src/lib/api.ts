const API_BASE_URL = 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'x-auth-token': token,
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(response.status, errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (username: string, email: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (data: any) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

export const vitalsApi = {
  addVitals: async (vitals: {
    systolic?: number;
    diastolic?: number;
    heartRate?: number;
    weight?: number;
    bloodSugar?: number;
    temperature?: number;
    notes?: string;
  }) => {
    return apiRequest('/vitals', {
      method: 'POST',
      body: JSON.stringify(vitals),
    });
  },

  getVitals: async (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/vitals${query}`);
  },

  getVitalsByDateRange: async (startDate: string, endDate: string) => {
    return apiRequest(`/vitals/range?startDate=${startDate}&endDate=${endDate}`);
  },

  updateVitals: async (id: string, vitals: any) => {
    return apiRequest(`/vitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vitals),
    });
  },

  deleteVitals: async (id: string) => {
    return apiRequest(`/vitals/${id}`, {
      method: 'DELETE',
    });
  },
};

export const reportsApi = {
  uploadReport: async (file: File, reportData?: {
    title?: string;
    type?: string;
    description?: string;
  }) => {
    // Convert file to base64 for Cloudinary upload
    const base64 = await fileToBase64(file);

    const response = await fetch(`${API_BASE_URL}/reports/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || '',
      },
      body: JSON.stringify({
        file: base64,
        title: reportData?.title,
        type: reportData?.type,
        description: reportData?.description,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new ApiError(response.status, errorData.message);
    }

    return response.json();
  },

  getReports: async (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest(`/reports${query}`);
  },

  getReport: async (id: string) => {
    return apiRequest(`/reports/${id}`);
  },

  updateReport: async (id: string, data: any) => {
    return apiRequest(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteReport: async (id: string) => {
    return apiRequest(`/reports/${id}`, {
      method: 'DELETE',
    });
  },

  getReportFile: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}/file`, {
      headers: {
        'x-auth-token': localStorage.getItem('token') || '',
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to download file');
    }

    return response.blob();
  },
};

export const healthApi = {
  getDashboardStats: async () => {
    return apiRequest('/health/dashboard-stats');
  },

  getHealthSummary: async (days: number = 30) => {
    return apiRequest(`/health/summary?days=${days}`);
  },

  getHealthTrends: async (metric: string, days: number = 30) => {
    return apiRequest(`/health/trends?metric=${metric}&days=${days}`);
  },
};

export const uploadApi = {
  uploadFile: async (file: File) => {
    // Convert file to base64
    const base64 = await fileToBase64(file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || '',
      },
      body: JSON.stringify({ file: base64 }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new ApiError(response.status, errorData.message);
    }

    return response.json();
  },
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export { ApiError };
