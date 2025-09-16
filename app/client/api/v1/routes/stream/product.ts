import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import using relative paths
import scrapeProductById from '../../product.js';
import SmoothWeightedProgressReporter from '@function/SmoothWeightedProgressReporter';

const streamProductRouter = express.Router();

// Define types for the progress update object
interface ProgressUpdate {
  key: string;
  percent: number;
  text: string;
}

// Define the shape of the reporter options
interface ReporterOptions {
  tick?: number;
  stepMs?: number;
  reserve?: number;
}

streamProductRouter.get('/product/:id', async (req, res) => {
  const { id: productId } = req.params;
  
  // Validate product ID
  if (!productId || !/^\d+$/.test(productId)) {
    return res.status(400).end('Invalid product ID');
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let closed = false;
  const heartbeat = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch (error) {
      console.error('Error sending heartbeat:', error);
      clearInterval(heartbeat);
    }
  }, 15000);

  // Function to safely close the connection
  const safeEnd = () => {
    if (!closed) {
      closed = true;
      clearInterval(heartbeat);
      res.end();
    }
  };

  // Function to send progress updates to the client
  const sendUpdate = ({ key, percent, text }: ProgressUpdate) => {
    if (!closed) {
      try {
        res.write(`data: ${JSON.stringify({ key, percent, text })}\n\n`);
      } catch (error) {
        console.error('Error sending update:', error);
        safeEnd();
      }
    }
  };

  // Set up the progress reporter
  const reporter = new SmoothWeightedProgressReporter(sendUpdate, {
    tick: 400,
    stepMs: 8000,
    reserve: 0.1
  } as ReporterOptions);

  try {
    // Start the scraping process
    await scrapeProductById(productId, reporter);
    
    // Send completion message
    if (!closed) {
      res.write('event: complete\ndata: {}\n\n');
    }
  } catch (error) {
    console.error('Error during product scraping:', error);
    if (!closed) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    }
  } finally {
    safeEnd();
  }
});

export default streamProductRouter;
