// path: src/api/v1/functions/injectRecaptchaToken.js
export async function injectRecaptchaToken(page, token) {
  await page.evaluate((token) => {
    let textarea = document.querySelector('textarea[name="g-recaptcha-response"]');
    if (!textarea) {
      textarea = document.createElement('textarea');
      textarea.name = "g-recaptcha-response";
      textarea.style = "display:none";
      document.body.appendChild(textarea);
    }
    textarea.value = token;
  }, token);
}
