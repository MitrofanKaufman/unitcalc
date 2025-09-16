// path: src/api/v1/functions/solveImageCaptcha.js
import axios from 'axios';

export async function solveImageCaptcha(apiKey, base64Image) {
  const form = new URLSearchParams();
  form.append('key', apiKey);
  form.append('method', 'base64');
  form.append('body', base64Image);
  form.append('json', '1');

  const { data: res } = await axios.post('https://rucaptcha.com/in.php', form);
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
  throw new Error('Таймаут решения image-капчи');
}
