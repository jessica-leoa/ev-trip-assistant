# Test Suite for EV Trip Assistant

## Running Tests

1. Install dev dependencies:
   npm install --save-dev jest ts-jest @types/jest supertest @types/supertest

2. Run all tests:
   npx jest

- Unit tests: `tests/tripService.unit.test.ts` (tests trip planning logic)
- Integration tests: `tests/tripApi.integration.test.ts` (tests API endpoint)

## Notes
- Axios is mocked for deterministic results.
- You may need to adjust environment variables for real API calls.
