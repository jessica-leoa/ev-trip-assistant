import { Router } from 'express';
import efficiencyController from './efficiencyController';

const efficiencyRoutes = Router();

efficiencyRoutes.get('/dashboard', (req, res) => efficiencyController.getMetrics(req, res));

export default efficiencyRoutes;