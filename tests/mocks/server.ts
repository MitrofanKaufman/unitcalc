import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API handlers
export const handlers = [
  // Mock search endpoint
  rest.get('http://localhost:3000/api/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q');
    return res(
      ctx.delay(150), // Simulate network delay
      ctx.json({
        success: true,
        data: [
          { id: 1, name: `${query} 1`, price: 1000 },
          { id: 2, name: `${query} 2`, price: 2000 },
        ],
      })
    );
  }),
  
  // Mock product details endpoint
  rest.get('http://localhost:3000/api/product/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.delay(100),
      ctx.json({
        success: true,
        data: {
          id,
          name: `Test Product ${id}`,
          price: 1000,
          description: 'Test product description',
          images: ['/placeholder-product.jpg'],
        },
      })
    );
  }),
  
  // Mock analysis endpoint
  rest.post('http://localhost:3000/api/analyze', (req, res, ctx) => {
    return res(
      ctx.delay(2000), // Simulate analysis delay
      ctx.json({
        success: true,
        data: {
          analysisId: 'test-analysis-123',
          status: 'completed',
          result: {
            score: 85,
            insights: ['Good product', 'Competitive price'],
          },
        },
      })
    );
  }),
];

// Setup requests interception using the given handlers
export const server = setupServer(...handlers);

export default server;
