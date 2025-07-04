import { Request, Response, NextFunction } from 'express';
import * as patientService from './patientService';

export async function createPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
}

export async function getPatientById(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = await patientService.findPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    next(err);
  }
}

export async function updatePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await patientService.updatePatient(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deletePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await patientService.deletePatient(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getAllPatients(req: Request, res: Response, next: NextFunction) {
  try {
    const patients = await patientService.findAllPatients();
    res.json(patients);
  } catch (err) {
    next(err);
  }
}
