export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: any[];
}

export const sendResponse = <T>(
  res: any,
  statusCode: number,
  status: 'success' | 'error',
  message: string,
  data?: T,
  errors?: any[]
) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
    errors,
  });
};

export const successResponse = <T>(res: any, data: T, message = 'Success', statusCode = 200) => {
  return sendResponse(res, statusCode, 'success', message, data);
};

export const errorResponse = (res: any, message: string, statusCode = 500, errors?: any[]) => {
  return sendResponse(res, statusCode, 'error', message, undefined, errors);
};
