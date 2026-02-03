"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Importação das rotas dos módulos
const chargingRoutes_1 = __importDefault(require("./modules/charging/chargingRoutes"));
const tripRoutes_1 = __importDefault(require("./modules/trip/tripRoutes"));
const efficiencyRoutes_1 = __importDefault(require("./modules/efficiency/efficiencyRoutes"));
const chatbotRoutes_1 = __importDefault(require("./modules/chatbot/chatbotRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Permite que o front (lovable) acesse o back
app.use(express_1.default.json());
// Rotas
app.use('/api/charging', chargingRoutes_1.default);
app.use('/api/trip', tripRoutes_1.default);
app.use('/api/efficiency', efficiencyRoutes_1.default);
app.use('/api', chatbotRoutes_1.default);
app.get('/', (req, res) => {
    res.send('EV Trip Assistant API Online ⚡');
});
exports.default = app;
