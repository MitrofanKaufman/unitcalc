---
description: Проверка окружения разработки
---

# Workflow: Проверка окружения

Этот workflow проверяет настройки окружения разработки и выявляет потенциальные проблемы.

## 1. Проверка версий

### 1.1. Node.js и npm
```powershell
# Проверяем версию Node.js
$nodeVersion = node -v
Write-Host "Node.js: $nodeVersion"

# Проверяем версию npm
$npmVersion = npm -v
Write-Host "npm: $npmVersion"

# Проверяем минимальные требования
$minNodeVersion = [version]"16.0.0"
$currentNodeVersion = [version]($nodeVersion.Trim('v'))

if ($currentNodeVersion -lt $minNodeVersion) {
    Write-Error "Ошибка: Требуется Node.js версии $minNodeVersion или выше"
    exit 1
}
```

## 2. Проверка зависимостей

### 2.1. Проверка пакетов
```powershell
# Проверяем наличие package.json
if (-not (Test-Path "package.json")) {
    Write-Error "Файл package.json не найден"
    exit 1
}

# Проверяем наличие node_modules
if (-not (Test-Path "node_modules")) {
    Write-Warning "Отсутствует директория node_modules. Выполните 'npm install'"
}

# Проверяем наличие package-lock.json
if (-not (Test-Path "package-lock.json")) {
    Write-Warning "Отсутствует package-lock.json. Рекомендуется выполнить 'npm install'"
}
```

## 3. Проверка окружения

### 3.1. Переменные окружения
```powershell
# Проверяем наличие .env файла
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "Найден файл .env"
    
    # Проверяем обязательные переменные
    $requiredVars = @("NODE_ENV", "API_URL", "PORT")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if (-not (Get-Content $envFile | Select-String -Pattern "^$var=")) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Warning "Отсутствуют обязательные переменные: $($missingVars -join ', ')"
    }
} else {
    Write-Warning "Файл .env не найден. Создайте его на основе .env.example"
}
```

### 3.2. Проверка портов
```powershell
# Проверяем занятые порты
$ports = @(3000, 3001, 3002, 3003, 4000, 8000, 8080)
Write-Host "Проверка занятых портов..."

foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $processName = (Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue).ProcessName
        Write-Warning "Порт $port занят процессом: $processName (PID: $($process.OwningProcess))"
    }
}
```

## 4. Проверка инструментов разработки

### 4.1. Git
```powershell
# Проверяем настройки Git
$gitUser = git config --get user.name
$gitEmail = git config --get user.email

if (-not $gitUser -or -not $gitEmail) {
    Write-Warning "Настройте Git (имя и email):"
    Write-Host "  git config --global user.name 'Ваше имя'"
    Write-Host "  git config --global user.email 'ваш.email@example.com'"
} else {
    Write-Host "Git настроен: $gitUser <$gitEmail>"
}
```

### 4.2. Редактор кода
```powershell
# Проверяем наличие VS Code (опционально)
$vscodePath = "$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin\code"
if (Test-Path $vscodePath) {
    Write-Host "VS Code: установлен"
    
    # Проверяем расширения
    $extensions = @("dbaeumer.vscode-eslint", "esbenp.prettier-vscode", "ms-vscode.vscode-typescript-next")
    $installedExt = & code --list-extensions
    
    foreach ($ext in $extensions) {
        if ($installedExt -notcontains $ext) {
            Write-Warning "Рекомендуемое расширение не установлено: $ext"
        }
    }
} else {
    Write-Host "VS Code: не установлен (опционально)"
}
```

## 5. Формирование отчёта

### 5.1. Сводка проверок
```powershell
# Выводим итоговую сводку
Write-Host "`n=== СВОДКА ПРОВЕРКИ ОКРУЖЕНИЯ ==="
Write-Host "Node.js: $nodeVersion"
Write-Host "npm: $npmVersion"
Write-Host "Git: $(git --version)"
Write-Host "Проверка завершена $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

if ($missingVars.Count -gt 0) {
    Write-Warning "Обнаружены проблемы, которые могут повлиять на работу приложения"
} else {
    Write-Host "Окружение настроено корректно" -ForegroundColor Green
}
```

## 6. Дополнительные проверки (опционально)

### 6.1. Проверка TypeScript
```powershell
# Проверяем наличие TypeScript
if (Get-Command tsc -ErrorAction SilentlyContinue) {
    Write-Host "TypeScript: $(tsc -v)"
    
    # Проверяем настройки tsconfig.json
    if (Test-Path "tsconfig.json") {
        Write-Host "Найден tsconfig.json"
    } else {
        Write-Warning "Отсутствует tsconfig.json"
    }
} else {
    Write-Warning "TypeScript не установлен глобально"
}
```

### 6.2. Проверка доступа к API
```powershell
# Проверяем доступ к внешним сервисам
$services = @(
    @{Name="npm registry"; Url="https://registry.npmjs.org"},
    @{Name="GitHub"; Url="https://github.com"},
    @{Name="Wildberries API"; Url="https://suppliers-api.wildberries.ru"}
)

Write-Host "`nПроверка доступа к внешним сервисам..."

foreach ($service in $services) {
    try {
        $test = Test-NetConnection -ComputerName ($service.Url -replace '^https?://', '') -Port 443 -ErrorAction Stop
        Write-Host "[✓] $($service.Name) ($($service.Url)): доступен" -ForegroundColor Green
    } catch {
        Write-Warning "[✗] $($service.Name) ($($service.Url)): недоступен"
    }
}
```
