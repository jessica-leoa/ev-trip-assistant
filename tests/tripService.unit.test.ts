import TripService from '../src/modules/trip/tripService';
import { TripPlanRequestDTO } from '../src/modules/trip/tripTypes';

jest.mock('axios');
const axios = require('axios');

describe('TripService - planTrip (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(TripService as any, 'getCoordinates').mockImplementation(async (...args: any[]) => ({
      lat: 0,
      lon: 0,
      displayName: args[0]
    }));
  });

  it('returns error JSON when no route is found', async () => {
    axios.get.mockResolvedValue({ data: { routes: [] } });
    const req: TripPlanRequestDTO = {
      origin: 'A',
      destination: 'B',
      autonomy: 400,
    };
    const result = await TripService.planTrip(req);
    expect(result.error).toBeDefined();
    expect(result.origin).toBeNull();
    expect(result.polylines).toEqual([]);
  });

  it('returns correct polylines and stops for a multi-section route', async () => {
    axios.get.mockResolvedValue({
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
    const req: TripPlanRequestDTO = {
      origin: 'A',
      destination: 'B',
      autonomy: 400,
    };
    const result = await TripService.planTrip(req);
    expect(result.polylines).toEqual(['abc123', 'def456']);
    expect(result.chargingStops.length).toBe(1);
    expect(result.chargingStops[0].lat).toBe(1);
    expect(result.chargingStops[0].lon).toBe(2);
    expect(result.chargingStops[0].name).toBe('Stop1');
    expect(result.distanceTotal).toBeCloseTo(30);
    expect(result.durationTotal).toContain('0h');
  });
});
