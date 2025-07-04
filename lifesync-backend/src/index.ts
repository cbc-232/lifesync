import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import shared middleware
import { errorHandler } from './middleware/errorHandler';

// Import feature routers
import patientRoutes     from './features/patients/patientRoutes';
import authRoutes        from './features/auth/authRoutes';
import appointmentRoutes from './features/appointments/appointmentRoutes';
import hospitalRoutes    from './features/hospitals/hospitalRoutes';
import ivrRoutes         from './features/ivr/ivrRoutes';
import smsRoutes         from './features/sms/smsRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1️⃣ Parse Twilio form posts (URL‑encoded bodies)
app.use(express.urlencoded({ extended: false }));

// 2️⃣ Parse JSON bodies for your API
app.use(express.json());

// 3️⃣ Mount feature routers
app.use('/api/patients',     patientRoutes);
app.use('/api/auth',         authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/hospitals',    hospitalRoutes);
app.use('/api/ivr',          ivrRoutes);
app.use('/api/sms',          smsRoutes);

// 4️⃣ Health‑check endpoint
app.get('/', (_req, res) => {
  res.send('LifeSync API is running...');
});

// 5️⃣ Global error handler (must come after all routes)
app.use(errorHandler);

// 6️⃣ Start the server
app.listen(PORT, () => {
  console.log(`🚀 LifeSync backend running on http://localhost:${PORT}`);
});
