"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class TripService {
    // 1. Converte Texto em Latitude/Longitude (Geocoding) usando HERE
    getCoordinates(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.HERE_API_KEY;
                const url = `https://geocode.search.hereapi.com/v1/geocode`;
                const response = yield axios_1.default.get(url, {
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
            }
            catch (error) {
                console.error(`Erro ao buscar coordenadas para ${address} (HERE):`, error);
                throw new Error('Falha no serviço de localização (Geocoding HERE).');
            }
        });
    }
    // 3. Método Principal
    planTrip(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Geocode origin and destination
            const originCoords = yield this.getCoordinates(data.origin);
            const destCoords = yield this.getCoordinates(data.destination);
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
            const response = yield axios_1.default.get(url);
            const routeData = response.data.routes && response.data.routes[0];
            if (!routeData) {
                // Try to enrich the error with Gemini (if available)
                let geminiSuggestion = '';
                try {
                    const { getGeminiResponse } = yield Promise.resolve().then(() => __importStar(require('../chatbot/chatbotService')));
                    const geminiRes = yield getGeminiResponse({
                        message: `No EV route was found by the HERE Routing API between "${data.origin}" and "${data.destination}". Suggest (in pt-BR) possible reasons (e.g., lack of charging stations, autonomy too low, or unsupported region) and give tips for the user to try again.`
                    });
                    if (geminiRes && geminiRes.response) {
                        geminiSuggestion = geminiRes.response;
                    }
                }
                catch (e) {
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
            const chargingStops = [];
            const polylines = [];
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
        });
    }
}
exports.default = new TripService();
