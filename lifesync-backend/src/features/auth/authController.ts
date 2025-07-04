import { Request, Response } from 'express';
import * as authService from '../../services/authService';
import { logger } from '../../utils/logger';
import { AuthenticatedRequest } from '../../middleware/auth';

export async function registerHandler(req: Request, res: Response) {
  try {
    const { email, phone, password, role } = req.body;
    const result = await authService.registerUser(email, phone, password, role);
    res.status(201).json(result);
  } catch (err: any) {
    logger.warn('Registration failed', { error: err.message });
    res.status(400).json({ error: err.message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, phone, password } = req.body;
    const result = await authService.loginUser(email, phone, password);
    res.json(result);
  } catch (err: any) {
    logger.warn('Login failed', { error: err.message });
    res.status(400).json({ error: err.message });
  }
}

export async function updatePasswordHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      // This should not happen if requireAuth middleware is used
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await authService.updatePassword(userId, oldPassword, newPassword);
    res.json(result);
  } catch (err: any) {
    logger.warn('Password update failed', { error: err.message });
    res.status(400).json({ error: err.message });
  }
}
