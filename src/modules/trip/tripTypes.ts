export interface TripPlanRequestDTO {
    origin: string;           // ex: "São Paulo"
    destination: string;      // ex: "Rio de Janeiro"
    autonomy: number;         // Autonomia em KM (ex: 400)
}

export interface Coordinates {
    lat: number;
    lon: number;
    displayName: string;
}

export interface RouteSegment {
    distance: number; // km
    duration: number; // minutos
    geometry: string; // linha da rota para desenhar no mapa
}

export interface ChargingStop {
    lat: number;
    lon: number;
    name?: string;
    address?: string;
    id?: string;
}

export interface TripPlanResponse {
    origin: Coordinates | null;
    destination: Coordinates | null;
    distanceTotal: number;       // km
    durationTotal: string;
    requiredStops: number;
    routeGeometry: string;
    chargingStops: ChargingStop[];
    polylines: string[];
    error?: {
        message: string;
        suggestion?: string;
    };
}