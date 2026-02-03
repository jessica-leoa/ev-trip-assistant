"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_1 = __importDefault(require("./tripController"));
const tripRoutes = (0, express_1.Router)();
// Método POST (pois enviaremos um JSON no corpo)
tripRoutes.post('/plan', (req, res) => tripController_1.default.calculateRoute(req, res));
exports.default = tripRoutes;
