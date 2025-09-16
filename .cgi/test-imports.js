// Test script to identify problematic route imports
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of all router paths to test
const routerPaths = [
  './api/v1/routes/json/seller.js',
  './api/v1/routes/stream/seller.js',
  './api/v1/routes/json/cache.js',
  './api/v1/routes/parse/product.js',
  './api/v1/routes/parse/calculate.js',
  './api/v1/routes/mysql/product.js',
  './api/v1/routes/stream/product.js',
  './api/v1/routes/json/results.js',
  './api/v1/routes/json/saveResults.js',
  './api/v1/routes/calcRouter.js',
  './api/v1/routes/json/product.js'
];

async function testImport(importPath) {
  const fullPath = path.resolve(__dirname, importPath);
  console.log(`\n--- Testing import: ${importPath} ---`);
  
  try {
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch (error) {
      console.log(`[SKIP] File does not exist: ${fullPath}`);
      return { success: false, error: 'File not found', path: fullPath };
    }
    
    // Convert Windows path to file URL for ESM imports
    const fileUrl = new URL(`file://${path.resolve(fullPath).replace(/\\/g, '/')}`).href;
    
    // Try to import the module using file URL
    console.log(`Importing module from: ${fileUrl}`);
    const module = await import(fileUrl);
    
    // Check if module has a default export
    if (!module || !module.default) {
      console.log('[WARN] Module does not have a default export');
      return { success: false, error: 'No default export', path: fullPath };
    }
    
    // Check if the default export is an Express router
    const router = module.default;
    if (typeof router !== 'function' || !router.stack) {
      console.log('[WARN] Default export is not an Express router');
      return { 
        success: false, 
        error: 'Not an Express router', 
        path: fullPath,
        type: typeof router
      };
    }
    
    // Log basic info about the router
    console.log('[SUCCESS] Router imported successfully');
    console.log(`- Routes registered: ${router.stack.length}`);
    
    // Log all registered routes
    if (router.stack.length > 0) {
      console.log('Registered routes:');
      router.stack.forEach((layer, i) => {
        if (layer.route) {
          const methods = Object.keys(layer.route.methods).filter(m => layer.route.methods[m]);
          console.log(`  ${i + 1}. ${methods.join('|').toUpperCase()} ${layer.route.path}`);
        } else if (layer.name === 'router') {
          // Handle mounted routers
          console.log(`  ${i + 1}. [Mounted Router]`);
          if (layer.handle && layer.handle.stack) {
            layer.handle.stack.forEach((sublayer, j) => {
              if (sublayer.route) {
                const methods = Object.keys(sublayer.route.methods).filter(m => sublayer.route.methods[m]);
                console.log(`     - ${j + 1}. ${methods.join('|').toUpperCase()} ${sublayer.route.path}`);
              }
            });
          }
        }
      });
    }
    
    return { success: true, path: fullPath };
    
  } catch (error) {
    console.error('[ERROR] Failed to import module:', error);
    return { 
      success: false, 
      error: error.message, 
      stack: error.stack,
      path: fullPath 
    };
  }
}

async function runTests() {
  console.log('Starting router import tests...\n');
  
  const results = [];
  
  for (const routerPath of routerPaths) {
    const result = await testImport(routerPath);
    results.push({
      path: routerPath,
      ...result
    });
  }
  
  // Print summary
  console.log('\n--- Test Summary ---');
  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;
  
  console.log(`\n✅ ${successCount} successful imports`);
  console.log(`❌ ${failCount} failed imports`);
  
  if (failCount > 0) {
    console.log('\nFailed imports:');
    results
      .filter(r => !r.success)
      .forEach((r, i) => {
        console.log(`\n${i + 1}. ${r.path}`);
        console.log(`   Error: ${r.error}`);
        if (r.stack) {
          console.log(`   Stack: ${r.stack.split('\n')[0]}`);
        }
      });
  }
  
  return results;
}

// Run the tests
runTests().catch(console.error);
