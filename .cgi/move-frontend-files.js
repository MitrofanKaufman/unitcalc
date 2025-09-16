import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source and destination directories
const srcDirs = [
  'assets',
  'components',
  'hooks',
  'lib',
  'pages',
  'styles',
  'utils'
];

const rootDir = path.resolve(__dirname, '..');

// Function to copy directory
async function copyDir(src, dest) {
  try {
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest, { overwrite: true });
    console.log(`Copied: ${src} -> ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error);
  }
}

// Process each directory
async function processDirectories() {
  console.log('Starting to copy frontend files...');
  
  for (const dir of srcDirs) {
    const srcPath = path.join(rootDir, 'src', dir);
    const destPath = path.join(rootDir, 'app', 'frontend', dir);
    
    if (await fs.pathExists(srcPath)) {
      await copyDir(srcPath, destPath);
    } else {
      console.warn(`Source directory not found: ${srcPath}`);
    }
  }
  
  console.log('File copy process completed.');
  
  // Copy root files
  const rootFiles = ['main.tsx', 'App.tsx', 'vite-env.d.ts'];
  for (const file of rootFiles) {
    const srcFile = path.join(rootDir, 'src', file);
    const destFile = path.join(rootDir, 'app', 'frontend', file);
    
    if (await fs.pathExists(srcFile)) {
      await fs.copy(srcFile, destFile, { overwrite: true });
      console.log(`Copied root file: ${srcFile} -> ${destFile}`);
    }
  }
}

processDirectories()
  .then(() => console.log('Frontend files have been successfully moved!'))
  .catch(console.error);
