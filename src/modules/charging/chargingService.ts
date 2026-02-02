import axios from 'axios';
// CORREÇÃO: Removido o ponto do import
import { FindStationsDTO, ChargingStationResponse } from './chargingTypes';

class ChargingService {
    private readonly API_URL = 'https://api.openchargemap.io/v3/poi/';
    private readonly API_KEY = process.env.OPEN_CHARGE_MAP_KEY;

    async findStations(params: FindStationsDTO): Promise<ChargingStationResponse[]> {
        if (!this.API_KEY) {
            throw new Error('API Key do OpenChargeMap não configurada.');
        }

        try {
            const response = await axios.get(this.API_URL, {
                params: {
                    key: this.API_KEY,
                    latitude: params.latitude,
                    longitude: params.longitude,
                    distance: params.distance || 20,
                    distanceUnit: 'KM',
                    maxresults: 20,
                    compact: true,
                    verbose: false
                }
            });

            const rawData = response.data;
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cleanData: ChargingStationResponse[] = rawData.map((station: any) => ({
                id: station.ID,
                name: station.AddressInfo?.Title || 'Posto de Recarga',
                address: {
                    street: station.AddressInfo?.AddressLine1 || '',
                    city: station.AddressInfo?.Town || '',
                    state: station.AddressInfo?.StateOrProvince || '',
                    latitude: station.AddressInfo?.Latitude,
                    longitude: station.AddressInfo?.Longitude
                },
                usageType: station.UsageType?.Title || 'Desconhecido',
                status: station.StatusType?.Title || 'Operacional'
            }));

            return cleanData;

        } catch (error) {
            console.error('Erro no ChargingService:', error);
            throw new Error('Falha ao comunicar com o serviço de mapas.');
        }
    }
}

export default new ChargingService();