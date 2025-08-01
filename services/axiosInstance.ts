"use server";

import { AuthRouteConstant } from "@/constants/routes.constant";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { deleteCookie, getCookie } from "cookies-next/server";
import { redirect } from "next/navigation";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    const token = await getCookie("token", { cookies });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add API key header
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }

    return config;
  },
  (error: any) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: any) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration
      await deleteCookie("token", { cookies });
      await deleteCookie("is_dual_role", { cookies });

      if (typeof window === "undefined") {
        redirect(AuthRouteConstant.login);
      } else {
        // Client-side fallback
        window.location.pathname = AuthRouteConstant.login;
      }
    }
    // Handle response errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
