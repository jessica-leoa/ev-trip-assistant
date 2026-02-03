"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// CORREÇÃO: Removido o ponto do import
const chargingController_1 = __importDefault(require("./chargingController"));
const chargingRoutes = (0, express_1.Router)();
chargingRoutes.get('/stations', (req, res) => chargingController_1.default.getStations(req, res));
exports.default = chargingRoutes;
