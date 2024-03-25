// import { Request, Response } from 'express';
// import { getRegions } from './controller/controller'; // Import your getRegions function
// import Region from './model/region'; // Import your Region model
// import cache from './cache/cache'; // Import your cache module

// // Mocking the cache module
// jest.mock('./cache', () => ({
//   get: jest.fn(),
//   set: jest.fn()
// }));

// describe('getRegions function', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let next: jest.Mock;

//   beforeEach(() => {
//     req = {
//       query: {}
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };
//     next = jest.fn();
//   });

//   it('should return regions from cache if present', async () => {
//     const mockRegions = [{ name: 'Region 1' }, { name: 'Region 2' }];
//     const cacheKey = 'regions#';

//     // Mocking cache.get to return cached regions
//     cache.get.mockResolvedValueOnce(mockRegions);

//     await getRegions(req as Request, res as Response);

//     expect(cache.get).toHaveBeenCalledWith(cacheKey);
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ regions: mockRegions });
//   });

//   it('should query database and set cache if cache is not present', async () => {
//     const mockRegions = [{ name: 'Region 1' }, { name: 'Region 2' }];
//     const cacheKey = 'regions#';

//     // Mocking cache.get to return null (cache not present)
//     cache.get.mockResolvedValueOnce(null);

//     // Mocking Region.find to return regions from database
//     Region.find = jest.fn().mockResolvedValueOnce(mockRegions);

//     await getRegions(req as Request, res as Response);

//     expect(cache.get).toHaveBeenCalledWith(cacheKey);
//     expect(Region.find).toHaveBeenCalledWith({});
//     expect(cache.set).toHaveBeenCalledWith(cacheKey, mockRegions, { ex: expect.any(Number) });
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ regions: mockRegions });
//   });
// });