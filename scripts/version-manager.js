// \scripts\version-manager.js
// Скрипт для управления версиями проекта

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class VersionManager {
  constructor() {
    this.rootDir = path.join(__dirname, '..')
    this.clientPackagePath = path.join(this.rootDir, 'client', 'package.json')
    this.serverPackagePath = path.join(this.rootDir, 'server', 'package.json')
  }

  // Получить текущую версию
  getCurrentVersion() {
    const clientPackage = JSON.parse(fs.readFileSync(this.clientPackagePath, 'utf8'))
    const serverPackage = JSON.parse(fs.readFileSync(this.serverPackagePath, 'utf8'))

    if (clientPackage.version !== serverPackage.version) {
      throw new Error('Версии клиента и сервера не совпадают!')
    }

    return clientPackage.version
  }

  // Увеличить версию
  bumpVersion(type = 'patch') {
    const currentVersion = this.getCurrentVersion()
    const [major, minor, patch] = currentVersion.split('.').map(Number)

    let newVersion
    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`
        break
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`
        break
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`
        break
    }

    // Обновить версии в package.json файлах
    this.updatePackageVersions(newVersion)

    // Создать git tag
    this.createGitTag(newVersion)

    console.log(`✅ Версия обновлена с ${currentVersion} до ${newVersion}`)
    return newVersion
  }

  // Обновить версии в package.json
  updatePackageVersions(version) {
    const updatePackage = (packagePath) => {
      const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      package.version = version
      fs.writeFileSync(packagePath, JSON.stringify(package, null, 2))
    }

    updatePackage(this.clientPackagePath)
    updatePackage(this.serverPackagePath)
  }

  // Создать git tag
  createGitTag(version) {
    try {
      execSync(`git add client/package.json server/package.json`, { cwd: this.rootDir })
      execSync(`git commit -m "chore: bump version to ${version}"`, { cwd: this.rootDir })
      execSync(`git tag -a v${version} -m "Release version ${version}"`, { cwd: this.rootDir })
      console.log(`✅ Git tag v${version} создан`)
    } catch (error) {
      console.error('❌ Ошибка при создании git tag:', error.message)
    }
  }

  // Показать историю версий
  showVersionHistory() {
    try {
      const tags = execSync('git tag -l --sort=-version:refname', { cwd: this.rootDir })
        .toString()
        .trim()
        .split('\n')
        .filter(Boolean)

      console.log('📋 История версий:')
      tags.forEach((tag, index) => {
        console.log(`${index + 1}. ${tag}`)
      })
    } catch (error) {
      console.error('❌ Ошибка при получении истории версий:', error.message)
    }
  }

  // Переключиться на версию
  switchToVersion(version) {
    try {
      execSync(`git checkout v${version}`, { cwd: this.rootDir })
      console.log(`✅ Переключено на версию ${version}`)
    } catch (error) {
      console.error(`❌ Ошибка при переключении на версию ${version}:`, error.message)
    }
  }
}

// CLI интерфейс
const args = process.argv.slice(2)
const command = args[0]
const param = args[1]

const versionManager = new VersionManager()

switch (command) {
  case 'current':
    console.log('📋 Текущая версия:', versionManager.getCurrentVersion())
    break
  case 'bump':
    versionManager.bumpVersion(param || 'patch')
    break
  case 'history':
    versionManager.showVersionHistory()
    break
  case 'switch':
    if (!param) {
      console.error('❌ Укажите версию для переключения')
      process.exit(1)
    }
    versionManager.switchToVersion(param)
    break
  case 'help':
  default:
    console.log(`
🚀 Version Manager - управление версиями проекта

Команды:
  current                    Показать текущую версию
  bump [major|minor|patch]   Увеличить версию (по умолчанию patch)
  history                    Показать историю версий
  switch <version>           Переключиться на указанную версию
  help                       Показать эту справку

Примеры:
  node scripts/version-manager.js current
  node scripts/version-manager.js bump minor
  node scripts/version-manager.js history
  node scripts/version-manager.js switch 1.2.0
`)
    break
}

module.exports = VersionManager
