---
description: Автоматическое исправление проблем запуска с инкрементальными правками
---

# Workflow: Автоисправление и запуск

Этот workflow автоматически находит и исправляет проблемы, мешающие запуску приложения, с пошаговым подтверждением исправлений.

## 1. Подготовка

### 1.1. Создаём WIP коммит
```powershell
# Сохраняем текущую ветку
$originalBranch = git branch --show-current

# Создаём временную ветку для исправлений
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$tempBranch = "fix/auto-fix-$timestamp"
git checkout -b $tempBranch

# Создаём WIP коммит
git add .
git commit -m "WIP: Начало автоматического исправления проблем запуска" --no-verify

Write-Host "✅ Создан WIP коммит в ветке $tempBranch"
```

## 2. Очистка и подготовка

### 2.1. Очистка кэша и временных файлов
```powershell
# Очищаем кэш npm
npm cache clean --force

Write-Host "✅ Кэш очищен"
```

## 3. Цикл исправления ошибок

### 3.1. Запуск и обработка ошибок
```powershell
$maxAttempts = 5
$attempt = 1
$fixedIssues = @()

while ($attempt -le $maxAttempts) {
    Write-Host "`n=== Попытка $attempt из $maxAttempts ==="
    
    # Запускаем приложение и перехватываем вывод
    $process = Start-Process -FilePath "npm" -ArgumentList "run start" -PassThru -NoNewWindow -RedirectStandardOutput "output_$attempt.log" -RedirectStandardError "error_$attempt.log"
    
    # Даём время на запуск
    Start-Sleep -Seconds 10
    
    # Проверяем, запустился ли процесс
    if ($process.HasExited) {
        $exitCode = $process.ExitCode
        $errorOutput = Get-Content "error_$attempt.log" -Raw
        $output = Get-Content "output_$attempt.log" -Raw
        
        Write-Host "❌ Ошибка при запуске (код $exitCode)"
        
        # Анализируем ошибку
        $fixApplied = $false
        
        # 1. Проверяем ошибки зависимостей
        if ($errorOutput -match "Cannot find module|Error: Cannot find" -or $output -match "Cannot find module") {
            $module = $matches[0] -replace ".*?(['"])(.*?)\1.*", '$2'
            Write-Host "Обнаружена проблема с зависимостью: $module"
            
            # Устанавливаем недостающий модуль
            npm install $module --save-exact
            $fixedIssues += "Установлен модуль: $module"
            $fixApplied = $true
        }
        
        # 2. Проверяем ошибки TypeScript
        elseif ($output -match "TS\d+" -or $errorOutput -match "TS\d+") {
            $error = $matches[0]
            Write-Host "Обнаружена ошибка TypeScript: $error"
            
            # Пытаемся автоматически исправить ошибки
            npx eslint . --fix
            npx tsc --noEmit --skipLibCheck
            
            $fixedIssues += "Исправлены ошибки TypeScript: $error"
            $fixApplied = $true
        }
        
        # 4. Другие ошибки
        else {
            # Показываем последние строки лога
            $lastLines = $output -split "`n" | Select-Object -Last 10
            Write-Host "`nПоследние строки лога:"
            $lastLines | ForEach-Object { Write-Host "  $_" }
            
            # Предлагаем пользователю решение
            $userInput = Read-Host "`nВведите команду для исправления (или Enter для пропуска)"
            if ($userInput) {
                Invoke-Expression $userInput
                $fixedIssues += "Применено ручное исправление: $userInput"
                $fixApplied = $true
            }
        }
        
        # Если не удалось применить автоматические исправления
        if (-not $fixApplied) {
            Write-Host "`nНе удалось автоматически исправить ошибку. Логи сохранены в файлы:"
            Write-Host "- Вывод: $(Get-Item "output_$attempt.log").FullName"
            Write-Host "- Ошибки: $(Get-Item "error_$attempt.log").FullName"
            break
        }
        
        # Убиваем процесс, если он всё ещё висит
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
    else {
        # Приложение запустилось успешно
        $appUrl = "http://localhost:3000"
        Write-Host "`n✅ Приложение успешно запущено!" -ForegroundColor Green
        Write-Host "Откройте в браузере: $appUrl"
        
        # Открываем в браузере по умолчанию
        Start-Process $appUrl
        
        # Создаём финальный коммит
        git add .
        git commit -m "FIX: Автоматическое исправление проблем запуска`n`nИсправленные проблемы:`n$($fixedIssues -join "`n")"
        
        # Возвращаемся в исходную ветку
        git checkout $originalBranch
        
        # Предлагаем смержить изменения
        $mergeChoice = Read-Host "`nХотите смержить исправления в ветку $originalBranch? (y/n)"
        if ($mergeChoice -eq 'y') {
            git merge $tempBranch --no-ff -m "Merge автоматических исправлений из $tempBranch"
            git branch -d $tempBranch
        }
        
        exit 0
    }
    
    $attempt++
}

# Если не удалось исправить за максимальное количество попыток
Write-Host "`n❌ Не удалось исправить ошибки за $maxAttempts попыток" -ForegroundColor Red
Write-Host "Проверьте логи и попробуйте исправить ошибки вручную"

# Возвращаемся в исходную ветку
git checkout $originalBranch
git branch -D $tempBranch
exit 1
```

## 4. Логирование и отчет

Все логи сохраняются в файлы вида `output_N.log` и `error_N.log`, где N - номер попытки.
Вывелен сводный отчет изменений.