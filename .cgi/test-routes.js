// Minimal test to identify problematic route imports
import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { addAliases } from 'module-alias';
import { fileURLToPath } from 'url';
// Moved to after the routeFiles definition to set up aliases first

// List of all route files to test - using relative paths to actual files
const routeFiles = [
  // Test files one by one to identify the problematic one
  './api/v1/routes/parse/calculate.js',
  // './api/v1/routes/parse/product.js',
  // './api/v1/routes/parse/testRouter.js',
  // './api/v1/routes/calcRouter.js'
].filter(Boolean); // Remove any undefined entries

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up aliases to match tsconfig.json
addAliases({
  '@': path.resolve(__dirname, '..'),
  '@utils': path.resolve(__dirname, '../core/utils'),
  '@routes': path.resolve(__dirname, '../api/v1/routes'),
  '@pages': path.resolve(__dirname, '../components/pages'),
  '@js': path.resolve(__dirname, '../js'),
  '@functions': path.resolve(__dirname, '../api/v1/functions'),
  '@endpoints': path.resolve(__dirname, '../api/v1/endpoints'),
  '@data': path.resolve(__dirname, '../public')
});

async function testRouteImport(routePath) {
  try {
    console.log(`[TEST] Attempting to import: ${routePath}`);
    const fullPath = path.resolve(__dirname, routePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
      console.log(`[INFO] File exists: ${fullPath}`);
    } catch (accessError) {
      console.log(`[SKIP] File does not exist: ${fullPath}`);
      return false; // Skip non-existent files
    }
    
    // Try to import the module
    console.log(`[INFO] Importing module...`);
    const module = await import(routePath);
    console.log(`[SUCCESS] Successfully imported ${routePath}`);
    
    // If it's a router, check its routes
    if (module && typeof module === 'function') {
      console.log(`[INFO] ${routePath} exports a function`);
      try {
        const router = module;
        if (router.stack) {
          console.log(`[INFO] ${routePath} has ${router.stack.length} route handlers`);
        }
      } catch (e) {
        console.log(`[WARN] Could not inspect routes for ${routePath}:`, e.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`[ERROR] Failed to import ${routePath}:`, error.message);
    console.error('Error stack:', error.stack);
    
    // Try to read the file content for analysis
    try {
      if (fs.access) {
        const content = await fs.readFile(path.resolve(__dirname, routePath), 'utf-8');
        console.log(`\nFile content (first 200 chars):`);
        console.log(content.substring(0, 200) + '...');
        
        // Look for suspicious patterns
        const suspicious = [
          { name: 'path-to-regexp import', pattern: /from\s+['"]path-to-regexp['"]/ },
          { name: 'route with regex', pattern: /router\.(get|post|put|delete|use)\(\s*[/{]/ },
          { name: 'dynamic route parameter', pattern: /[:*?]\w+/ },
          { name: 'URL in route', pattern: /https?:\/\/[^\s'"]+/ }
        ];
        
        console.log('\nScanning for suspicious patterns:');
        suspicious.forEach(({name, pattern}) => {
          const matches = content.match(pattern);
          if (matches) {
            console.log(`Found ${name} pattern:`, matches[0]);
          }
        });
      }
    } catch (e) {
      console.error('Could not read file for analysis:', e.message);
    }
    
    return false;
  }
}

// Test each route file one by one
async function testAllRoutes() {
  console.log('Starting route import tests...\n');
  let hasErrors = false;
  
  for (const routeFile of routeFiles) {
    try {
      console.log(`\n=== Testing: ${routeFile} ===`);
      const success = await testRouteImport(routeFile);
      if (!success) {
        hasErrors = true;
        console.log(`[WARNING] Issues found with ${routeFile}, but continuing...`);
      }
    } catch (error) {
      hasErrors = true;
      console.error(`[ERROR] Unhandled error testing ${routeFile}:`, error);
      console.log(`[WARNING] Continuing with next file...`);
    }
  }
  
  if (hasErrors) {
    console.log('\nTests completed with some errors. Check the logs above for details.');
    process.exit(1);
  } else {
    console.log('\nAll route imports completed successfully!');
    process.exit(0);
  }
}

testAllRoutes().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});
