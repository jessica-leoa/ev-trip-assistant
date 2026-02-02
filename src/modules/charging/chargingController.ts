import { Request, Response } from 'express';
// CORREÇÃO: Removido o ponto dos imports abaixo
import chargingService from './chargingService';
import { FindStationsDTO } from './chargingTypes';

class ChargingController {
    
    async getStations(req: Request, res: Response): Promise<Response> {
        try {
            const { lat, lon, range } = req.query;

            if (!lat || !lon) {
                return res.status(400).json({ 
                    error: 'Parâmetros obrigatórios ausentes',
                    message: 'Por favor, forneça latitude (lat) e longitude (lon).'
                });
            }

            const searchParams: FindStationsDTO = {
                latitude: Number(lat),
                longitude: Number(lon),
                distance: range ? Number(range) : undefined
            };

            const stations = await chargingService.findStations(searchParams);

            return res.status(200).json({
                success: true,
                count: stations.length,
                data: stations
            });

        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                error: 'Erro Interno',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}

export default new ChargingController();