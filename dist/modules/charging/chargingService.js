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
const axios_1 = __importDefault(require("axios"));
class ChargingService {
    constructor() {
        this.API_URL = 'https://api.openchargemap.io/v3/poi/';
        this.API_KEY = process.env.OPEN_CHARGE_MAP_KEY;
    }
    findStations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.API_KEY) {
                throw new Error('API Key do OpenChargeMap não configurada.');
            }
            try {
                const response = yield axios_1.default.get(this.API_URL, {
                    params: {
                        key: this.API_KEY,
                        latitude: params.latitude,
                        longitude: params.longitude,
                        distance: params.distance || 20,
                        distanceUnit: 'KM',
                        maxresults: 20,
                        compact: true,
                        verbose: false
                    }
                });
                const rawData = response.data;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cleanData = rawData.map((station) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ({
                        id: station.ID,
                        name: ((_a = station.AddressInfo) === null || _a === void 0 ? void 0 : _a.Title) || 'Posto de Recarga',
                        address: {
                            street: ((_b = station.AddressInfo) === null || _b === void 0 ? void 0 : _b.AddressLine1) || '',
                            city: ((_c = station.AddressInfo) === null || _c === void 0 ? void 0 : _c.Town) || '',
                            state: ((_d = station.AddressInfo) === null || _d === void 0 ? void 0 : _d.StateOrProvince) || '',
                            latitude: (_e = station.AddressInfo) === null || _e === void 0 ? void 0 : _e.Latitude,
                            longitude: (_f = station.AddressInfo) === null || _f === void 0 ? void 0 : _f.Longitude
                        },
                        usageType: ((_g = station.UsageType) === null || _g === void 0 ? void 0 : _g.Title) || 'Desconhecido',
                        status: ((_h = station.StatusType) === null || _h === void 0 ? void 0 : _h.Title) || 'Operacional'
                    });
                });
                return cleanData;
            }
            catch (error) {
                console.error('Erro no ChargingService:', error);
                throw new Error('Falha ao comunicar com o serviço de mapas.');
            }
        });
    }
}
exports.default = new ChargingService();
