import { Response } from 'express';

export const success = <T>(res: Response, data: T, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const error = (res: Response, message: string, status = 500, details?: any) => {
  return res.status(status).json({ success: false, error: message, details });
};

export const paginate = <T>(res: Response, items: T[], total: number, page: number, limit: number) => {
  return res.json({
    success: true,
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  });
};
