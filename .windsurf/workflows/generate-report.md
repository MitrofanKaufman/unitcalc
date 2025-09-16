---
description: Генерация отчёта о состоянии проекта
---

# Workflow: Генерация отчёта

Этот workflow генерирует отчёт о текущем состоянии проекта, включая зависимости, окружение и потенциальные проблемы.

## 1. Сбор информации о проекте

### 1.1. Основная информация
```powershell
# Заголовок отчёта
$report = "# Отчёт о состоянии проекта\n"
$report += "Сгенерировано: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')\n\n"

# Информация о системе
$report += "## 1. Системная информация\n"
$report += "- ОС: $([System.Environment]::OSVersion.VersionString)\n"
$report += "- Имя компьютера: $([System.Environment]::MachineName)\n"
$report += "- Имя пользователя: $([System.Environment]::UserName)\n\n"

# Версии инструментов
$report += "## 2. Версии инструментов\n"
$report += "- Node.js: $(node -v 2>&1)\n"
$report += "- npm: $(npm -v 2>&1)\n"
$report += "- Git: $(git --version 2>&1)\n"
$report += "- TypeScript: $(npx tsc --version 2>&1)\n\n"
```

### 1.2. Зависимости проекта
```powershell
$report += "## 3. Зависимости проекта\n"

# Основные зависимости
$report += "### Установленные зависимости\n"
$deps = npm list --depth=0 --json 2>$null | ConvertFrom-Json

if ($deps.dependencies) {
    foreach ($dep in $deps.dependencies.PSObject.Properties) {
        $report += "- $($dep.Name): $($dep.Value.version)\n"
    }
} else {
    $report += "Не удалось получить список зависимостей\n"
}

# Устаревшие пакеты
$report += "\n### Устаревшие пакеты\n"
$outdated = npm outdated --json 2>$null | ConvertFrom-Json

if ($outdated) {
    foreach ($pkg in $outdated.PSObject.Properties) {
        $report += "- $($pkg.Name): $($pkg.Value.current) → $($pkg.Value.latest)\n"
    }
} else {
    $report += "Все пакеты актуальны\n"
}

$report += "\n"
```

## 2. Проверка кодовой базы

### 2.1. Анализ TypeScript
```powershell
$report += "## 4. Анализ TypeScript\n"

# Проверка типов
$report += "### Проверка типов\n"
$typeCheck = npx tsc --noEmit 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    $report += "✅ Ошибок типизации не обнаружено\n"
} else {
    $report += "❌ Обнаружены ошибки типизации:\n"
    $report += "```\n$typeCheck\n```\n"
}

# Размер бандла
$report += "\n### Размер бандла\n"
$bundleSize = npx vite-bundle-visualizer --open false 2>&1 | Out-String
$report += "Размер бандла: $bundleSize\n"
```

### 2.2. Проверка линтера
```powershell
$report += "## 5. Проверка кода\n"

# Запускаем ESLint
$lintReport = npx eslint . --format json 2>&1 | ConvertFrom-Json -ErrorAction SilentlyContinue

if ($lintReport) {
    $errorCount = ($lintReport | Measure-Object -Property errorCount -Sum).Sum
    $warningCount = ($lintReport | Measure-Object -Property warningCount -Sum).Sum
    
    $report += "- Ошибки: $errorCount\n"
    $report += "- Предупреждения: $warningCount\n"
    
    if ($errorCount -gt 0) {
        $report += "\n### Критические проблемы\n"
        foreach ($file in $lintReport | Where-Object { $_.errorCount -gt 0 }) {
            $report += "#### $($file.filePath)\n"
            foreach ($msg in $file.messages | Where-Object { $_.severity -eq 2 }) {
                $report += "- [Строка $($msg.line):$($msg.column)] $($msg.message) (${$msg.ruleId})\n"
            }
        }
    }
} else {
    $report += "Не удалось получить отчёт линтера\n"
}
```

## 3. Формирование отчёта

### 3.1. Сохранение отчёта
```powershell
# Создаём директорию для отчётов, если её нет
$reportDir = "./reports"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}

# Сохраняем отчёт в файл
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportPath = "$reportDir/report-$timestamp.md"
$report | Out-File -FilePath $reportPath -Encoding utf8

Write-Host "Отчёт сохранён: $((Get-Item $reportPath).FullName)"

# Открываем отчёт в браузере
Start-Process $reportPath
```

### 3.2. Вывод сводки
```powershell
# Выводим сводку в консоль
Write-Host """

=== СВОДКА ОТЧЁТА ===
1. Система: $([System.Environment]::OSVersion.VersionString)
2. Node.js: $(node -v 2>&1)
3. npm: $(npm -v 2>&1)
4. Зависимости: $(($deps.dependencies.PSObject.Properties | Measure-Object).Count) пакетов
5. Ошибки TypeScript: $(if ($LASTEXITCODE -eq 0) { 'Нет' } else { 'Есть' })
6. Отчёт сохранён: $reportPath
"""
```

## 4. Дополнительные проверки

### 4.1. Проверка безопасности
```powershell
$report += "## 6. Проверка безопасности\n"

# Проверяем уязвимости
$audit = npm audit --json 2>$null | ConvertFrom-Json

if ($audit.vulnerabilities) {
    $report += "### Обнаружены уязвимости:\n"
    foreach ($severity in @('critical', 'high', 'moderate', 'low')) {
        if ($audit.metadata.vulnerabilities.$severity -gt 0) {
            $report += "- $($severity.ToUpper()): $($audit.metadata.vulnerabilities.$severity) уязвимостей\n"
        }
    }
    
    $report += "\nДля исправления выполните: `npm audit fix`\n"
} else {
    $report += "Уязвимостей не обнаружено\n"
}
```

### 4.2. Проверка тестов
```powershell
$report += "## 7. Результаты тестирования\n"

try {
    $testResults = npm test -- --json 2>$null | ConvertFrom-Json -ErrorAction Stop
    $report += "- Всего тестов: $($testResults.numTotalTests)\n"
    $report += "- Успешно: $($testResults.numPassedTests)\n"
    $report += "- Провалено: $($testResults.numFailedTests)\n"
    
    if ($testResults.testResults) {
        foreach ($testFile in $testResults.testResults) {
            $report += "\n### $($testFile.name)\n"
            foreach ($assertion in $testFile.assertionResults) {
                $status = if ($assertion.status -eq 'passed') { '✅' } else { '❌' }
                $report += "- $status $($assertion.title)\n"
            }
        }
    }
} catch {
    $report += "Не удалось получить результаты тестов: $_\n"
}
```
