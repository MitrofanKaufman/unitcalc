const fs = require('fs');
const { execSync } = require('child_process');

// Читаем package.json
const packageJson = require('../package.json');

// Список пакетов для обновления с указанием версий
const updates = {
  // Обновление зависимостей
  dependencies: {
    'rimraf': '^5.0.1',
    'glob': '^10.3.10',
    'lodash.get': '^4.4.2',
    'lodash.isequal': '^4.5.0',
    'source-map': '^0.7.4',
    'source-map-url': '^0.4.2',
    'source-map-resolve': '^0.8.0',
    'resolve-url': '^0.2.1',
    'urix': '^0.1.0',
    'inflight': '^2.0.1',
    'stable': '^0.1.8',
  },
  devDependencies: {
    'eslint': '^8.57.0',
    '@humanwhocodes/config-array': '^0.13.0',
    '@humanwhocodes/object-schema': '^2.0.3',
    'sourcemap-codec': '^1.4.8',
  }
};

// Функция для обновления зависимостей
function updateDependencies() {
  let updated = false;
  
  // Обновляем зависимости
  for (const [dep, version] of Object.entries(updates.dependencies)) {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`Updating ${dep} to ${version}...`);
      execSync(`npm install ${dep}@${version} --legacy-peer-deps`, { stdio: 'inherit' });
      updated = true;
    }
  }
  
  // Обновляем dev-зависимости
  for (const [dep, version] of Object.entries(updates.devDependencies)) {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`Updating devDependency ${dep} to ${version}...`);
      execSync(`npm install -D ${dep}@${version} --legacy-peer-deps`, { stdio: 'inherit' });
      updated = true;
    }
  }
  
  if (!updated) {
    console.log('No dependencies to update.');
  } else {
    console.log('Dependencies updated successfully!');
    console.log('Running npm install to update lock file...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  }
}

// Запускаем обновление
updateDependencies();
