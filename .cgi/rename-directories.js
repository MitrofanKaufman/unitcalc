import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Configuration for directory renaming
const dirMappings = [
  { oldName: 'frontend', newName: 'client' },
  { oldName: 'backend', newName: 'server' }
];

// Files that might contain references to old directory names
const configFiles = [
  'vite.config.ts',
  'tsconfig.json',
  'package.json',
  'app/client/tsconfig.json',
  'app/server/tsconfig.json'
];

async function renameDirectories() {
  console.log('Starting directory renaming process...');
  
  // Rename directories
  for (const { oldName, newName } of dirMappings) {
    const oldPath = path.join(rootDir, 'app', oldName);
    const newPath = path.join(rootDir, 'app', newName);
    
    if (await fs.pathExists(oldPath)) {
      try {
        await fs.rename(oldPath, newPath);
        console.log(`✅ Renamed: ${oldName} -> ${newName}`);
      } catch (error) {
        console.error(`❌ Error renaming ${oldName} to ${newName}:`, error.message);
      }
    } else {
      console.log(`ℹ️ Directory not found: ${oldPath}`);
    }
  }
  
  console.log('\nUpdating configuration files...');
  
  // Update configuration files
  for (const configFile of configFiles) {
    const filePath = path.join(rootDir, configFile);
    
    if (await fs.pathExists(filePath)) {
      try {
        let content = await fs.readFile(filePath, 'utf8');
        let updated = false;
        
        // Replace all occurrences of old directory names
        for (const { oldName, newName } of dirMappings) {
          const regex = new RegExp(`(["'\`])${oldName}([/\\"'\`])`, 'g');
          const newContent = content.replace(regex, `$1${newName}$2`);
          
          if (newContent !== content) {
            updated = true;
            content = newContent;
          }
        }
        
        if (updated) {
          await fs.writeFile(filePath, content, 'utf8');
          console.log(`✅ Updated: ${configFile}`);
        } else {
          console.log(`ℹ️ No changes needed: ${configFile}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${configFile}:`, error.message);
      }
    } else {
      console.log(`ℹ️ Config file not found: ${configFile}`);
    }
  }
  
  console.log('\nDirectory renaming process completed!');
  console.log('Please check the changes and run any necessary commands to update your project.');
}

// Run the script
renameDirectories().catch(console.error);
