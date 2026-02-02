import { Request, Response } from 'express';
import efficiencyService from './efficiencyService';
import { EfficiencyRequestDTO } from './efficiencyTypes';

class EfficiencyController {
    
    getMetrics(req: Request, res: Response) {
        try {
            // Podemos pegar parâmetros da URL, ex: /dashboard?dist=400&bat=50
            const { dist, bat } = req.query;

            const requestData: EfficiencyRequestDTO = {
                distance: dist ? Number(dist) : undefined,
                batteryLevel: bat ? Number(bat) : undefined
            };

            const metrics = efficiencyService.getDashboardMetrics(requestData);

            return res.json({
                success: true,
                data: metrics
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao gerar métricas',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}

export default new EfficiencyController();