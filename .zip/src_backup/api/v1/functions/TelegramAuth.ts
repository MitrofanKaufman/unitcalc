// path: src/api/v1/functions/TelegramAuth.js
import crypto from 'crypto';

/**
 * Класс для авторизации пользователей через Telegram Login Widget.
 * Реализует проверку переданных Telegram-данных и извлечение информации о пользователе.
 */
export default class TelegramAuth {
  /**
   * @param {string} botToken — токен вашего Telegram-бота (пример: "123456:ABC-DEF…").
   * @throws {Error} если botToken не передан.
   */
  constructor(botToken) {
    if (!botToken) {
      throw new Error('TelegramAuth: не передан botToken');
    }
    this.botToken = botToken;
    // секретный ключ для HMAC — SHA256(botToken)
    this.secretKey = crypto.createHash('sha256').update(this.botToken).digest();
  }

  /**
   * Собирает data_check_string из параметров Telegram.
   * @param {object} data — объект параметров, полученный из Telegram (req.body).
   * @returns {string} — строка вида "key1=value1\nkey2=value2…", без "hash".
   */
  buildDataCheckString(data) {
    return Object.keys(data)
      .filter((key) => key !== 'hash')
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');
  }

  /**
   * Проверяет переданные Telegram-данные на подлинность.
   * @param {object} data — объект параметров из Telegram Login Widget.
   * @returns {boolean} — true, если проверка пройдена успешно.
   * @throws {Error} если отсутствует поле "hash" в данных.
   */
  verify(data) {
    if (!data.hash) {
      throw new Error('TelegramAuth.verify: отсутствует поле hash');
    }
    const dataCheckString = this.buildDataCheckString(data);
    const hmac = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataCheckString)
      .digest('hex');

    const providedHash = data.hash;
    const hmacBuffer = Buffer.from(hmac, 'hex');
    const providedBuffer = Buffer.from(providedHash, 'hex');

    if (hmacBuffer.length !== providedBuffer.length) {
      return false;
    }
    // безопасное по времени сравнение
    return crypto.timingSafeEqual(hmacBuffer, providedBuffer);
  }

  /**
   * Аутентифицирует пользователя по данным из Telegram Login Widget.
   * @param {object} data — req.body с параметрами Telegram.
   * @returns {object} — объект с полями пользователя (id, first_name, last_name, username, auth_date и т.д.).
   * @throws {Error} если проверка данных не пройдена.
   */
  authenticate(data) {
    if (!this.verify(data)) {
      throw new Error('TelegramAuth.authenticate: проверка данных не пройдена');
    }
    // Преобразуем auth_date из UNIX-timestamp в Date
    const user = { ...data };
    user.auth_date = new Date(Number(data.auth_date) * 1000);
    // Удаляем поле hash — оно нам больше не нужно
    delete user.hash;
    return user;
  }
}
