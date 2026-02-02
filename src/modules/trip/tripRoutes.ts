import { Router } from 'express';
import tripController from './tripController';

const tripRoutes = Router();

// Método POST (pois enviaremos um JSON no corpo)
tripRoutes.post('/plan', (req, res) => tripController.calculateRoute(req, res));

export default tripRoutes;