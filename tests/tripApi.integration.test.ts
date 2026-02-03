import request from 'supertest';
import express from 'express';
import tripRoutes from '../src/modules/trip/tripRoutes';

const app = express();
app.use(express.json());
app.use('/api/trip', tripRoutes);

describe('Trip API Integration', () => {
  beforeEach(() => {
    // Mock geocoding for all tests
    jest.spyOn(require('../src/modules/trip/tripService').default as any, 'getCoordinates').mockImplementation(async (...args: any[]) => ({
      lat: 0,
      lon: 0,
      displayName: args[0]
    }));
    // Mock Gemini API for all tests
    jest.spyOn(require('../src/modules/chatbot/chatbotService'), 'getGeminiResponse').mockResolvedValue({ response: 'mocked suggestion' });
  });
  it('should return error JSON when no route is found', async () => {
    // Mock HERE API response
    jest.spyOn(require('axios'), 'get').mockResolvedValueOnce({ data: { routes: [] } });
    const res = await request(app)
      .post('/api/trip/plan')
      .send({ origin: 'A', destination: 'B', autonomy: 400 });
    expect(res.status).toBe(200);
    expect(res.body.data.error).toBeDefined();
    expect(res.body.data.polylines).toEqual([]);
  });

  it('should return polylines and stops for a multi-section route', async () => {
    jest.spyOn(require('axios'), 'get').mockResolvedValueOnce({
      data: {
        routes: [{
          sections: [
            {
              summary: { length: 10000, duration: 1000 },
              polyline: 'abc123',
              postActions: [
                { action: 'charging', duration: 600 }
              ],
              arrival: { place: { location: { lat: 1, lng: 2 }, name: 'Stop1', address: 'Addr1', id: 'id1' } }
            },
            {
              summary: { length: 20000, duration: 2000 },
              polyline: 'def456',
              postActions: [],
            }
          ]
        }]
      }
    });
    const res = await request(app)
      .post('/api/trip/plan')
      .send({ origin: 'A', destination: 'B', autonomy: 400 });
    expect(res.status).toBe(200);
    expect(res.body.data.polylines).toEqual(['abc123', 'def456']);
    expect(res.body.data.chargingStops.length).toBe(1);
    expect(res.body.data.chargingStops[0].lat).toBe(1);
    expect(res.body.data.chargingStops[0].lon).toBe(2);
    expect(res.body.data.chargingStops[0].name).toBe('Stop1');
    expect(res.body.data.distanceTotal).toBeCloseTo(30);
    expect(res.body.data.durationTotal).toContain('0h');
  });
});
