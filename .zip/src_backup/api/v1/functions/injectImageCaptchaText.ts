// path: src/api/v1/functions/injectImageCaptchaText.js
export async function injectImageCaptchaText(page, selector, text) {
  await page.fill(selector, text);
}
