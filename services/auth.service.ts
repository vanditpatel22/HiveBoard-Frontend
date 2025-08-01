'use server';

import { ENDPOINTS } from '@/constants/endpoints';
import axiosInstance from '@/services/axiosInstance';
import {
  LoginInterface,
  RegisterInterface,
} from '@/types/auth.type';
import { cookies } from 'next/headers';


interface ApiResponse<T = any> {
  res?: T;
  success: boolean;
  message: string;
}

/**
 * Handles user login.
 *
 * Makes a POST request to /auth/login with given credentials.
 * If successful, sets the access token and is_dual_role in cookies.
 * Returns the response data.
 *
 * @param {LoginInterface} data - Login credentials
 * @returns {Promise<ApiResponse>}
 */
export const login = async (data: LoginInterface): Promise<ApiResponse> => {
  try {
    const res = await axiosInstance.post(ENDPOINTS.auth.login, {
      ...data,
    });

    const cookieStore = await cookies();
 
    cookieStore.set('token', res?.data?.data?.access_token);

    return { res: res?.data?.data, success: true, message: res?.data?.message };
  } catch (error: any) {
    console.log('Login ::  error ==>', error.response?.data || error.response);
    return { message: error.response?.data?.detail || error.response?.data || "Something went wrong!", success: false };
  }
};


export const register = async (data: RegisterInterface): Promise<ApiResponse> => {

  try {
    const res = await axiosInstance.post(ENDPOINTS.auth.register, {
      ...data,
    });
    console.log(res);
    console.log(res?.data, `res?.data`);
    console.log(res?.data?.message, `res?.data?.message`);
    return { res: res?.data, success: true, message: res?.data?.message || "Register Successfully" };
  } catch (error: any) {
    console.log('Register ::  error ==>', error.response?.data || error.response);
    return { message: error.response?.data?.message || error.response?.data || "Something went wrong!", success: false };
  }
};

export const Logout = async () => {
  try {
    const res = await axiosInstance.post(ENDPOINTS.auth.logout);
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('is_dual_role');
    return { res: res?.data || null, success: true, message: res?.data?.message || "Logout successfully." };
  } catch (error: any) {
    console.error('Logout error:', error?.response || error?.message || error);
    return {
      message:
        error?.response?.data || error?.message || 'Unknown error occurred',
      success: false
    };
  }
};

