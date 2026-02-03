import { Request, Response } from 'express';
import tripService from './tripService';
import { TripPlanRequestDTO } from './tripTypes';

class TripController {
    
    async calculateRoute(req: Request, res: Response): Promise<Response> {
        try {
            console.log('[DEBUG] /api/trip/plan called');
            console.log('[DEBUG] Request body:', req.body);
            const { origin, destination, autonomy } = req.body;

            // Validação simples
            if (!origin || !destination || !autonomy) {
                console.warn('[WARN] Dados incompletos:', { origin, destination, autonomy });
                return res.status(400).json({
                    error: 'Dados incompletos',
                    message: 'Informe origem (texto), destino (texto) e autonomia (número).'
                });
            }

            const tripData: TripPlanRequestDTO = {
                origin,
                destination,
                autonomy: Number(autonomy)
            };

            console.log('[DEBUG] tripData:', tripData);
            const plan = await tripService.planTrip(tripData);

            console.log('[DEBUG] Plan result:', plan);
            return res.json({
                success: true,
                data: plan
            });

        } catch (error) {
            console.error('[ERROR] Erro ao planejar viagem:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro ao planejar viagem',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}

export default new TripController();