export interface LoginInterface {
  email: string;
  password: string;
}

export interface RegisterInterface {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
}

export interface UserInterface {
  _id: string;
  email: string;
  password: string;
  name: string;
  boards: string[];
  created_at: string; 
  updated_at: string; 
}