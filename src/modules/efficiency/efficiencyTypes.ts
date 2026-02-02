export interface EfficiencyRequestDTO {
    distance?: number;      // Distância da viagem em KM (opcional)
    batteryLevel?: number;  // Nível atual da bateria em % (opcional)
}

export interface ConsumptionPoint {
    km: string;    // Eixo X (ex: "50km")
    value: number; // Eixo Y (kWh/100km)
}

export interface EfficiencyDashboardResponse {
    remainingRange: number;      // Card 1: Autonomia Restante (km)
    averageEfficiency: number;   // Card 2: Eficiência Média (kWh/100km)
    estimatedCost: number;       // Card 3: Custo Estimado (R$)
    consumptionGraph: ConsumptionPoint[]; // Gráfico de linha
}