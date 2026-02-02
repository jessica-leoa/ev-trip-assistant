import { Router } from 'express';
// CORREÇÃO: Removido o ponto do import
import chargingController from './chargingController';

const chargingRoutes = Router();

chargingRoutes.get('/stations', (req, res) => chargingController.getStations(req, res));

export default chargingRoutes;