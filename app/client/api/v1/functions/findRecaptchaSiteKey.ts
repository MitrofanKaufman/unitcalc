// path: src/api/v1/functions/findRecaptchaSiteKey.js
export async function findRecaptchaSiteKey(page) {
  const siteKey = await page.$eval('[data-sitekey]', el => el.getAttribute('data-sitekey')).catch(() => null);
  if (siteKey) return siteKey;
  const frame = page.frames().find(f => f.url().includes('recaptcha'));
  if (frame) {
    const sk = await frame.$eval('[data-sitekey]', el => el.getAttribute('data-sitekey')).catch(() => null);
    if (sk) return sk;
  }
  return null;
}
