// src/config/index.ts

import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

export const config = {
  // Server
  port: Number(process.env.PORT) || 3000,

  // JWT settings
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Database
  databaseUrl: requireEnv('DATABASE_URL'),

  // Twilio IVR
  twilio: {
    accountSid: requireEnv('TWILIO_ACCOUNT_SID'),
    authToken:  requireEnv('TWILIO_AUTH_TOKEN'),
    callerId:   requireEnv('TWILIO_CALLER_ID'),
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};
