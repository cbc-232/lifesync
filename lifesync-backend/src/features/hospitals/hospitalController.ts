import { Request, Response } from 'express';
import * as hospitalService from './hospitalService';

// GET /api/hospitals?name=&location=
export async function listHospitalsHandler(req: Request, res: Response) {
  try {
    const { name, location } = req.query as any;
    const hospitals = await hospitalService.listHospitals({ name, location });
    res.json(hospitals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/hospitals/:id
export async function getHospitalByIdHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const hospital = await hospitalService.getHospitalById(id);
    res.json(hospital);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

// POST /api/hospitals
export async function createHospitalHandler(req: Request, res: Response) {
  try {
    const data = req.body;
    const hospital = await hospitalService.createHospital(data);
    res.status(201).json(hospital);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// PATCH /api/hospitals/:id
export async function updateHospitalHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await hospitalService.updateHospital(id, data);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/hospitals/:id
export async function deleteHospitalHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await hospitalService.deleteHospital(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
