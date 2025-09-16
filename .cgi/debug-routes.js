// Debug script to identify problematic routes
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of route files to check
const routeFiles = [
  'api/v1/routes/calcRouter.js',
  'api/v1/routes/parse/calculate.js',
  'api/v1/routes/parse/product.js'
];

// Function to check a file for potential URL patterns
async function checkFileForUrlPatterns(filePath) {
  try {
    const content = await readFile(resolve(__dirname, filePath), 'utf-8');
    
    // Look for common patterns that might indicate URL usage in routes
    const urlPatterns = [
      { pattern: /https?:\/\//, description: 'HTTP/HTTPS URL' },
      { pattern: /'https?:\/\//, description: 'HTTP/HTTPS URL in single quotes' },
      { pattern: /"https?:\/\//, description: 'HTTP/HTTPS URL in double quotes' },
      { pattern: /pathToRegexp/gi, description: 'Possible direct pathToRegexp usage' },
      { pattern: /router\s*\.\s*(use|get|post|put|delete|all)\s*\(\s*[^'"].*https?:/i, 
        description: 'Route with potential URL in path' }
    ];

    const issues = [];
    const lines = content.split('\n');

    urlPatterns.forEach(({ pattern, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach((match, i) => {
          const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
          const lineContent = lines[lineNumber - 1]?.trim();
          issues.push({
            description,
            match,
            lineNumber,
            lineContent
          });
        });
      }
    });

    return issues;
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error);
    return [{ description: 'Error reading file', error: error.message }];
  }
}

// Main function
async function main() {
  console.log('Checking route files for URL patterns...\n');
  
  for (const file of routeFiles) {
    console.log(`🔍 Checking ${file}...`);
    const issues = await checkFileForUrlPatterns(file);
    
    if (issues.length > 0) {
      console.log(`❌ Found ${issues.length} potential issue(s) in ${file}:`);
      issues.forEach((issue, i) => {
        console.log(`\n  ${i + 1}. ${issue.description}`);
        console.log(`     Match: ${issue.match}`);
        if (issue.lineNumber) {
          console.log(`     Line ${issue.lineNumber}: ${issue.lineContent}`);
        }
      });
    } else {
      console.log(`✅ No URL patterns found in ${file}`);
    }
    console.log('\n' + '-'.repeat(80) + '\n');
  }
  
  console.log('Route checking complete.');
}

// Run the check
main().catch(console.error);
