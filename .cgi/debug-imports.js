// Debug script to identify which router is causing the path-to-regexp error
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of all router files to test
const routerFiles = [
  '../api/v1/routes/calcRouter.js',
  // Check json directory
  ...(await fs.readdir(resolve(__dirname, '../api/v1/routes/json'))).map(file => `../api/v1/routes/json/${file}`),
  // Check parse directory
  ...(await fs.readdir(resolve(__dirname, '../api/v1/routes/parse'))).map(file => `../api/v1/routes/parse/${file}`),
  // Check mysql directory
  ...(await fs.readdir(resolve(__dirname, '../api/v1/routes/mysql'))).map(file => `../api/v1/routes/mysql/${file}`),
  // Check stream directory
  ...(await fs.readdir(resolve(__dirname, '../api/v1/routes/stream'))).map(file => `../api/v1/routes/stream/${file}`)
].filter(file => file.endsWith('.js'));

async function testImport(relativePath) {
  try {
    console.log(`\n[TEST] Testing import of ${relativePath}`);
    const fullPath = resolve(__dirname, relativePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
      console.log(`[INFO] File exists: ${fullPath}`);
    } catch (err) {
      console.log(`[SKIP] File not found: ${fullPath}`);
      return { filePath: relativePath, exists: false };
    }
    
    // Try to import the file
    try {
      // Use dynamic import to catch any import-time errors
      const module = await import(fullPath);
      console.log(`[SUCCESS] Successfully imported ${filePath}`);
      return { filePath, success: true, module };
    } catch (importError) {
      console.error(`[ERROR] Failed to import ${filePath}:`, importError.message);
      if (importError.message.includes('path-to-regexp') || importError.message.includes('Missing parameter name')) {
        console.error(`[CRITICAL] Path-to-regexp error in ${filePath}`);
        // Try to read the file to find the issue
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          console.log(`[DEBUG] File content (first 500 chars):\n${content.substring(0, 500)}`);
        } catch (readError) {
          console.error(`[ERROR] Failed to read file ${filePath}:`, readError);
        }
      }
      return { filePath, success: false, error: importError };
    }
  } catch (error) {
    console.error(`[ERROR] Unexpected error testing ${filePath}:`, error);
    return { filePath, success: false, error };
  }
}

async function getRouterFiles() {
  // Base directories to search for router files
  const baseDirs = [
    // Main route files
    'api/v1/routes/calcRouter.js',
    
    // Route directories
    'api/v1/routes/json',
    'api/v1/routes/parse',
    'api/v1/routes/mysql',
    'api/v1/routes/stream',
    'api/v1/routes/media',
    'api/v1/routes/sql'
  ];
  
  const files = [];
  
  for (const dir of baseDirs) {
    const fullPath = resolve(__dirname, '..', dir);
    try {
      const stats = await fs.stat(fullPath);
      if (stats.isFile()) {
        // If it's a file, add it directly
        files.push(dir);
      } else if (stats.isDirectory()) {
        // If it's a directory, find all .js files in it
        try {
          const dirFiles = await fs.readdir(fullPath);
          for (const file of dirFiles) {
            if (file.endsWith('.js') && !file.endsWith('.test.js')) {
              files.push(`${dir}/${file}`);
            }
          }
        } catch (readErr) {
          console.warn(`[WARN] Could not read directory ${dir}:`, readErr.message);
        }
      }
    } catch (err) {
      // Skip if the file/directory doesn't exist
      console.warn(`[WARN] Could not access ${dir}:`, err.message);
    }
  }
  
  return files;
}

async function main() {
  console.log('Starting router import tests...');
  const results = [];
  
  // Get all router files
  const routerFiles = await getRouterFiles();
  console.log(`Found ${routerFiles.length} router files to test`);
  
  // Test each file one by one
  for (const file of routerFiles) {
    const result = await testImport(file);
    results.push(result);
  }
  
  // Print summary
  console.log('\n=== Test Results ===');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success && r.exists !== false);
  const notFound = results.filter(r => r.exists === false);
  
  console.log(`\n✅ Successful imports: ${successful.length}`);
  console.log(`❌ Failed imports: ${failed.length}`);
  console.log(`⏩ Skipped (not found): ${notFound.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed imports:');
    failed.forEach(({ filePath, error }) => {
      console.log(`- ${filePath}: ${error.message}`);
    });
  }
  
  if (notFound.length > 0) {
    console.log('\nMissing files:');
    notFound.forEach(({ filePath }) => console.log(`- ${filePath}`));
  }
}

main().catch(console.error);
