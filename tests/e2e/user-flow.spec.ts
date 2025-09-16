import { test, expect } from '@playwright/test';

test.describe('User Flow Test', () => {
  test('should complete the full user journey from home to product details', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout to 60 seconds

    // 1. Navigate to the home page
    await page.goto('http://localhost:4000');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the home page
    await expect(page).toHaveTitle(/Unit Calculator/);
    console.log('✓ На главной странице');
    
    // 2. Navigate to the search page
    const searchLink = page.getByRole('button', { name: /Калькулятор Wildberries/i });
    await searchButton.click();


    // Wait for navigation to complete
    await page.waitForURL('**/search', { timeout: 5000 });
    console.log('✓ Перешли на страницу поиска');
    
    // 3. Search for a product
    const searchInput = page.getByPlaceholder('Поиск товаров WB');
    await searchInput.fill('телефон');
    console.log('✓ Ввели поисковый запрос');
    
    // Wait for suggestions to appear
    await page.waitForTimeout(1000); // Wait for debounce
    
    // Click the first suggestion
    const firstSuggestion = page.locator('.suggestion-item').first();
    await firstSuggestion.waitFor({ state: 'visible', timeout: 5000 });
    await firstSuggestion.click();
    console.log('✓ Выбрали товар из выпадающего списка');
    
    // 4. Wait for the progress bar to appear
    const progressBar = page.locator('.progress-bar');
    await progressBar.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Прогресс-бар отобразился');
    
    // 5. Wait for analysis to complete
    console.log('Ожидаем завершения анализа...');
    await page.waitForFunction(
      () => {
        const progressElement = document.querySelector('.progress-bar-fill');
        if (!progressElement) return false;
        const width = window.getComputedStyle(progressElement).width;
        return width === '100%';
      },
      null,
      { timeout: 30000 }
    );
    console.log('✓ Анализ завершен');
    
    // 6. Verify we're on the product details page
    await page.waitForURL(/\/get\/\d+/, { timeout: 5000 });
    console.log('✓ Перешли на страницу товара');
    
    // 7. Verify product details are displayed
    const productTitle = page.locator('h1').first();
    await expect(productTitle).toBeVisible({ timeout: 5000 });
    console.log('✓ Заголовок товара отображается');
    
    // 8. Take a screenshot for verification
    await page.screenshot({ path: 'test-results/user-flow-screenshot.png' });
    console.log('✓ Скриншот сохранен');
    
    console.log('✓ Тест успешно завершен');
  });
});
