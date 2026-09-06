export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'principal' | 'admin' | 'teacher' | 'staff';
  campus: 'paete' | 'pagsanjan' | 'control_room';
  phone?: string;
  avatar_url?: string;
  two_factor_enabled?: boolean;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginResponse {
  requires_2fa: boolean;
  temp_token?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  user?: User;
}

export interface ActivityLog {
  id: string;
  action: string;
  details?: Record<string, any>;
  ip_address?: string;
  timestamp?: string;
}
