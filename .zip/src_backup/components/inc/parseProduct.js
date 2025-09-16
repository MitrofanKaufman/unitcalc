// path: src/components/inc/parseProduct.js
export async function parseProductById(productId) {
  try {
    const response = await fetch(`/api/v1/parse/product?id=${productId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка при парсинге товара');
    }

    const result = await response.json();
    const resultId = result.id;

    if (!resultId) {
      throw new Error('Парсинг завершён, но результат не получен');
    }

    // Перенаправляем на страницу с результатом
    window.location.href = `/product/${resultId}`;
  } catch (err) {
    alert(`Ошибка: ${err.message}`);
  }
}
