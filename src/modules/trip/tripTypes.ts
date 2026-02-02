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

export interface TripPlanResponse {
    origin: Coordinates;
    destination: Coordinates;
    distanceTotal: number;       // km
    durationTotal: string;       // Texto formatado "Xh Ymin"
    requiredStops: number;       // Quantidade de recargas necessárias
    routeGeometry: string;
}