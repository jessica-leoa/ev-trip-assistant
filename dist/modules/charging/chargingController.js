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
// CORREÇÃO: Removido o ponto dos imports abaixo
const chargingService_1 = __importDefault(require("./chargingService"));
class ChargingController {
    getStations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lat, lon, range } = req.query;
                if (!lat || !lon) {
                    return res.status(400).json({
                        error: 'Parâmetros obrigatórios ausentes',
                        message: 'Por favor, forneça latitude (lat) e longitude (lon).'
                    });
                }
                const searchParams = {
                    latitude: Number(lat),
                    longitude: Number(lon),
                    distance: range ? Number(range) : undefined
                };
                const stations = yield chargingService_1.default.findStations(searchParams);
                return res.status(200).json({
                    success: true,
                    count: stations.length,
                    data: stations
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro Interno',
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }
        });
    }
}
exports.default = new ChargingController();
