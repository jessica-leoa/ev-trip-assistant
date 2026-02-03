"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatbotController_1 = require("./chatbotController");
const router = (0, express_1.Router)();
router.post('/chatbot', chatbotController_1.chatWithGemini);
exports.default = router;
