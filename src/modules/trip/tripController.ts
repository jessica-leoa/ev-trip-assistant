import { Request, Response } from 'express';
import tripService from './tripService';
import { TripPlanRequestDTO } from './tripTypes';

class TripController {
    
    async calculateRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { origin, destination, autonomy } = req.body;

            // Validação simples
            if (!origin || !destination || !autonomy) {
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

            const plan = await tripService.planTrip(tripData);

            return res.json({
                success: true,
                data: plan
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao planejar viagem',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}

export default new TripController();