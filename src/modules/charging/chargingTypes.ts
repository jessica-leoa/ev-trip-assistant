// DTO (Data Transfer Object) para os parâmetros de busca
export interface FindStationsDTO {
    latitude: number;
    longitude: number;
    distance?: number; // Raio em KM
}

// Interface simplificada da resposta para o Front-end
export interface ChargingStationResponse {
    id: number;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        latitude: number;
        longitude: number;
    };
    usageType: string;
    status: string;
}