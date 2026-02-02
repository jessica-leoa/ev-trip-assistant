import { ConsumptionPoint, EfficiencyDashboardResponse, EfficiencyRequestDTO } from './efficiencyTypes';

class EfficiencyService {
    
    // Constantes baseadas em um Tesla Model Y (aprox.)
    private readonly BATTERY_CAPACITY = 75; // kWh
    private readonly AVG_CONSUMPTION = 16.5; // kWh/100km
    private readonly KWH_PRICE = 0.85; // Preço médio do kWh no Brasil (R$)

    /**
     * Gera dados do dashboard.
     * Se o usuário não mandar dados, usamos valores padrão.
     */
    public getDashboardMetrics(data: EfficiencyRequestDTO): EfficiencyDashboardResponse {
        const distance = data.distance || 300; // Padrão: Viagem de 300km
        const batteryPct = data.batteryLevel || 80; // Padrão: 80% de bateria

        // 1. Calcular Autonomia Restante
        // Regra: (Capacidade * %Atual) / Consumo * 100
        const currentKwh = this.BATTERY_CAPACITY * (batteryPct / 100);
        const remainingRange = Math.floor((currentKwh / this.AVG_CONSUMPTION) * 100);

        // 2. Calcular Custo Estimado da Viagem
        // Regra: (Distância / 100) * Consumo * Preço
        const totalEnergyNeeded = (distance / 100) * this.AVG_CONSUMPTION;
        const estimatedCost = parseFloat((totalEnergyNeeded * this.KWH_PRICE).toFixed(2));

        // 3. Gerar Gráfico de Consumo Simulado (Mock)
        // Cria 6 pontos de dados para o gráfico de linha parecer real
        const graphData: ConsumptionPoint[] = [];
        const segments = 6;
        const step = Math.floor(distance / segments);

        for (let i = 0; i <= segments; i++) {
            // Adiciona uma variação aleatória para simular subidas/descidas
            // Varia entre -2 e +2 do consumo médio
            const noise = (Math.random() * 4) - 2; 
            const simulatedConsumption = parseFloat((this.AVG_CONSUMPTION + noise).toFixed(1));
            
            graphData.push({
                km: `${i * step}km`,
                value: simulatedConsumption
            });
        }

        return {
            remainingRange: remainingRange,
            averageEfficiency: this.AVG_CONSUMPTION,
            estimatedCost: estimatedCost,
            consumptionGraph: graphData
        };
    }
}

export default new EfficiencyService();