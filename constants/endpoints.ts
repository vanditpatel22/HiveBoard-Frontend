export const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: BaseUrl + "/auth/login",
    register: BaseUrl + "/auth/register",
    logout: BaseUrl + "/auth/logout",
  },
  boards: {
    create: BaseUrl + "/boards",
    list: BaseUrl + "/boards",
    details: BaseUrl + "/boards",
    update: BaseUrl + "/boards",
    delete: BaseUrl + "/boards",
  },
};
