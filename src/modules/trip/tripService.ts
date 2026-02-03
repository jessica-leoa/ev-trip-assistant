import axios from 'axios';
import { Coordinates, RouteSegment, TripPlanRequestDTO, TripPlanResponse } from './tripTypes';
import { getGeminiResponse } from '../chatbot/chatbotService';

class TripService {
    
    // 1. Converte Texto em Latitude/Longitude (Geocoding) usando HERE
    private async getCoordinates(address: string): Promise<Coordinates> {
        try {
            const apiKey = process.env.HERE_API_KEY;
            const url = `https://geocode.search.hereapi.com/v1/geocode`;
            const response = await axios.get(url, {
                params: {
                    q: address,
                    apiKey
                }
            });

            if (!response.data.items || response.data.items.length === 0) {
                throw new Error(`Endereço não encontrado: ${address}`);
            }

            const item = response.data.items[0];
            return {
                lat: item.position.lat,
                lon: item.position.lng,
                displayName: item.title
            };
        } catch (error) {
            console.error(`Erro ao buscar coordenadas para ${address} (HERE):`, error);
            throw new Error('Falha no serviço de localização (Geocoding HERE).');
        }
    }


    // 3. Método Principal
    async planTrip(data: TripPlanRequestDTO): Promise<TripPlanResponse> {
        // Step 1: Geocode origin and destination
        const originCoords = await this.getCoordinates(data.origin);
        const destCoords = await this.getCoordinates(data.destination);

        // Step 2: Build HERE Routing API parameters directly for EV
const hereApiKey = process.env.HERE_API_KEY;
const baseUrl = 'https://router.hereapi.com/v8/routes';
// EV-specific parameters (can be extended for other vehicle types)
const evParams = [
    `origin=${originCoords.lat},${originCoords.lon}`,
    `destination=${destCoords.lat},${destCoords.lon}`,
    'transportMode=car',
    'routingMode=fast',
    'return=polyline,summary,actions,instructions',
    'ev[connectorTypes]=iec62196Type2Combo',
    'ev[makeReachable]=true',
    'ev[initialCharge]=50',
    'ev[maxCharge]=80',
    'ev[maxChargeAfterChargingStation]=80',
    'ev[minChargeAtDestination]=10',
    'ev[minChargeAtChargingStation]=8',
    'ev[freeFlowSpeedTable]=0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351',
    'ev[chargingCurve]=0,47,10,47,30,44,80,22,100,11'
];
const url = `${baseUrl}?${evParams.join('&')}&apikey=${hereApiKey}`;

        const response = await axios.get(url);
        const routeData = response.data.routes && response.data.routes[0];
        if (!routeData) {
            // Try to enrich the error with Gemini (if available)
            let geminiSuggestion = '';
            try {
                const { getGeminiResponse } = await import('../chatbot/chatbotService');
                const geminiRes = await getGeminiResponse({
                    message: `No EV route was found by the HERE Routing API between "${data.origin}" and "${data.destination}". Suggest (in pt-BR) possible reasons (e.g., lack of charging stations, autonomy too low, or unsupported region) and give tips for the user to try again.`
                });
                if (geminiRes && geminiRes.response) {
                    geminiSuggestion = geminiRes.response;
                }
            } catch (e) {
                // Gemini not available or failed
            }
            // Return a JSON error response for frontend floating window
            return {
                origin: null,
                destination: null,
                distanceTotal: 0,
                durationTotal: '',
                requiredStops: 0,
                routeGeometry: '',
                chargingStops: [],
                polylines: [],
                error: {
                    message: 'No EV route found by HERE API for this trip. This usually means there are not enough compatible charging stations along the way, or the autonomy is too low for the region.',
                    suggestion: geminiSuggestion
                }
            };
        }

        // Extract summary and geometry from all sections
        let totalDistanceMeters = 0;
        let totalDurationSeconds = 0;
        let routeGeometry = '';
        const chargingStops: any[] = [];
        const polylines: string[] = [];

        for (const section of routeData.sections) {
            // Add up distance and duration
            if (section.summary) {
                totalDistanceMeters += section.summary.length || 0;
                totalDurationSeconds += section.summary.duration || 0;
            }
            // Collect each section's polyline for polylines array
            if (section.polyline) {
                polylines.push(section.polyline);
            }
            // Use first polyline for routeGeometry
            if (!routeGeometry && section.polyline) {
                routeGeometry = section.polyline;
            }
            // Extract charging stops from postActions
            if (section.postActions) {
                for (const action of section.postActions) {
                    if (action.action === 'charging' && section.arrival && section.arrival.place && section.arrival.place.location) {
                        chargingStops.push({
                            lat: section.arrival.place.location.lat,
                            lon: section.arrival.place.location.lng,
                            name: section.arrival.place.name,
                            address: section.arrival.place.address,
                            id: section.arrival.place.id,
                            chargingTime: action.duration || 0 // seconds
                        });
                    }
                }
            }
        }

        // Convert meters to kilometers
        const distanceTotal = Math.round(totalDistanceMeters / 10) / 100;

        // Format duration as "Xh Ymin"
        const hours = Math.floor(totalDurationSeconds / 3600);
        const minutes = Math.round((totalDurationSeconds % 3600) / 60);
        const durationTotal = `${hours}h ${minutes}min`;

        // Use Coordinates type for origin and destination
        const origin = originCoords;
        const destination = destCoords;

        return {
            origin,
            destination,
            distanceTotal,
            durationTotal,
            requiredStops: chargingStops.length,
            routeGeometry,
            chargingStops,
            polylines
        };
    }
}

export default new TripService();