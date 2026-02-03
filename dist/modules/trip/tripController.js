"use strict";
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
const tripService_1 = __importDefault(require("./tripService"));
class TripController {
    calculateRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('[DEBUG] /api/trip/plan called');
                console.log('[DEBUG] Request body:', req.body);
                const { origin, destination, autonomy } = req.body;
                // Validação simples
                if (!origin || !destination || !autonomy) {
                    console.warn('[WARN] Dados incompletos:', { origin, destination, autonomy });
                    return res.status(400).json({
                        error: 'Dados incompletos',
                        message: 'Informe origem (texto), destino (texto) e autonomia (número).'
                    });
                }
                const tripData = {
                    origin,
                    destination,
                    autonomy: Number(autonomy)
                };
                console.log('[DEBUG] tripData:', tripData);
                const plan = yield tripService_1.default.planTrip(tripData);
                console.log('[DEBUG] Plan result:', plan);
                return res.json({
                    success: true,
                    data: plan
                });
            }
            catch (error) {
                console.error('[ERROR] Erro ao planejar viagem:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao planejar viagem',
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        });
    }
}
exports.default = new TripController();
