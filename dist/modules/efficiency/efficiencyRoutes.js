"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const efficiencyController_1 = __importDefault(require("./efficiencyController"));
const efficiencyRoutes = (0, express_1.Router)();
efficiencyRoutes.get('/dashboard', (req, res) => efficiencyController_1.default.getMetrics(req, res));
exports.default = efficiencyRoutes;
