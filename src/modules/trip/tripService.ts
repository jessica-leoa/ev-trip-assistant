import axios from 'axios';
import { Coordinates, RouteSegment, TripPlanRequestDTO, TripPlanResponse } from './tripTypes';

class TripService {
    
    // 1. Converte Texto em Latitude/Longitude (Geocoding)
    private async getCoordinates(address: string): Promise<Coordinates> {
        try {
            // User-Agent é obrigatório para a API do Nominatim
            const url = `https://nominatim.openstreetmap.org/search`;
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'EVTripAssistant/1.0' },
                params: {
                    q: address,
                    format: 'json',
                    limit: 1
                }
            });

            if (!response.data || response.data.length === 0) {
                throw new Error(`Endereço não encontrado: ${address}`);
            }

            const data = response.data[0];
            return {
                lat: parseFloat(data.lat),
                lon: parseFloat(data.lon),
                displayName: data.display_name
            };
        } catch (error) {
            console.error(`Erro ao buscar coordenadas para ${address}:`, error);
            throw new Error('Falha no serviço de localização (Geocoding).');
        }
    }

    // 2. Calcula a Rota entre dois pontos (Routing)
    private async getRoute(start: Coordinates, end: Coordinates): Promise<RouteSegment> {
        try {
            // O OSRM usa o formato "longitude,latitude" (invertido do Google)
            const coordinatesString = `${start.lon},${start.lat};${end.lon},${end.lat}`;
            const url = `http://router.project-osrm.org/route/v1/driving/${coordinatesString}`;
            
            const response = await axios.get(url, {
                params: {
                    overview: 'full', // Retorna o desenho completo da rota
                    geometries: 'polyline'
                }
            });

            if (!response.data.routes || response.data.routes.length === 0) {
                throw new Error('Não foi possível calcular uma rota entre estes pontos.');
            }

            const route = response.data.routes[0];
            return {
                distance: route.distance / 1000, // Metros -> KM
                duration: route.duration / 60,   // Segundos -> Minutos
                geometry: route.geometry
            };
        } catch (error) {
            console.error('Erro ao calcular rota:', error);
            throw new Error('Falha no serviço de rotas.');
        }
    }

    // 3. Método Principal
    async planTrip(data: TripPlanRequestDTO): Promise<TripPlanResponse> {
        // Passo A: Achar coordenadas
        const originCoords = await this.getCoordinates(data.origin);
        const destCoords = await this.getCoordinates(data.destination);

        // Passo B: Calcular rota
        const route = await this.getRoute(originCoords, destCoords);

        // Passo C: Calcular paradas (Distância / Autonomia)
        // Usamos Math.floor. Ex: 400km viagem / 300km autonomia = 1.33 -> 1 parada necessária.
        const stops = Math.floor(route.distance / data.autonomy);

        // Passo D: Formatar Tempo
        const hours = Math.floor(route.duration / 60);
        const minutes = Math.round(route.duration % 60);
        const durationFormatted = `${hours}h ${minutes}min`;

        return {
            origin: originCoords,
            destination: destCoords,
            distanceTotal: parseFloat(route.distance.toFixed(2)),
            durationTotal: durationFormatted,
            requiredStops: stops,
            routeGeometry: route.geometry
        };
    }
}

export default new TripService();