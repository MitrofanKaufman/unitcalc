// path: src/api/v1/functions/solveRecaptcha.js
import axios from 'axios';

export async function solveRecaptcha(apiKey, siteKey, pageUrl) {
  const { data: res } = await axios.get(
    `https://rucaptcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${encodeURIComponent(pageUrl)}&json=1`
  );
  if (res.status !== 1) throw new Error(`Ошибка RuCaptcha: ${res.request}`);
  const requestId = res.request;
  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const { data } = await axios.get(
      `https://rucaptcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`
    );
    if (data.status === 1) return data.request;
    if (data.request !== 'CAPCHA_NOT_READY') throw new Error(`Ошибка RuCaptcha: ${data.request}`);
  }
  throw new Error('Таймаут решения капчи');
}
