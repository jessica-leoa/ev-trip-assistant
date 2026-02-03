"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const efficiencyService_1 = __importDefault(require("./efficiencyService"));
class EfficiencyController {
    getMetrics(req, res) {
        try {
            // Podemos pegar parâmetros da URL, ex: /dashboard?dist=400&bat=50
            const { dist, bat } = req.query;
            const requestData = {
                distance: dist ? Number(dist) : undefined,
                batteryLevel: bat ? Number(bat) : undefined
            };
            const metrics = efficiencyService_1.default.getDashboardMetrics(requestData);
            return res.json({
                success: true,
                data: metrics
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao gerar métricas',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}
exports.default = new EfficiencyController();
