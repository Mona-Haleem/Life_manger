// src/utils/response.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | string[];
}

export const success = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const fail = (error: string | string[]): ApiResponse => ({
  success: false,
  error,
});
