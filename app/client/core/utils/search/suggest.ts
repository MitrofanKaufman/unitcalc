import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

/**
 * Handles search suggestions by querying Wildberries suggest API
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const handleSuggest = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.q;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const url = `https://suggests.wb.ru/suggests/api/v7/hint?query=${encodeURIComponent(query)}&locale=kz&lang=ru&appType=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Wildberries API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch search suggestions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default {
  handleSuggest
};