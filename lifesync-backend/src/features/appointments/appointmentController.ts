import { Request, Response } from 'express';
import * as appointmentService from './appointmentService';


// 1️⃣ Create a new appointment (guest or authenticated)
export async function createAppointmentHandler(req: Request, res: Response) {
  try {
    const payload = {
      ...req.body,
      patientId: (req as any).user?.id  // inject from JWT if present
    };
    const appt = await appointmentService.createAppointment(payload);
    res.status(201).json(appt);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// 2️⃣ List all appointments (authenticated only)
export async function listAppointmentsHandler(req: Request, res: Response) {
  try {
    const appts = await appointmentService.listAppointments();
    res.json(appts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// 3️⃣ Get a single appointment by ID
export async function getAppointmentByIdHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const appt = await appointmentService.getAppointmentById(id);
    res.json(appt);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

// 4️⃣ Update only the status of an appointment
export async function updateAppointmentStatusHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const updated = await appointmentService.updateAppointmentStatus(id, status);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// 5️⃣ Delete (cancel) an appointment
export async function deleteAppointmentHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await appointmentService.deleteAppointment(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
