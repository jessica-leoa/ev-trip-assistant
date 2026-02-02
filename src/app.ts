import express from 'express';
import cors from 'cors';

// Importação das rotas dos módulos
import chargingRoutes from './modules/charging/chargingRoutes';
import tripRoutes from './modules/trip/tripRoutes';
import efficiencyRoutes from './modules/efficiency/efficiencyRoutes';



const app = express();

app.use(cors()); // Permite que o front (lovable) acesse o back
app.use(express.json());

// Rotas
app.use('/api/charging', chargingRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/efficiency', efficiencyRoutes);
// app.use('/api/chatbot', chatbotRoutes);

app.get('/', (req, res) => {
    res.send('EV Trip Assistant API Online ⚡');
});

export default app;