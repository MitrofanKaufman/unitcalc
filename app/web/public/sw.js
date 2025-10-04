// \apps\web\public\sw.js
// Service Worker для PWA функциональности WB Marketplace Calculator

const CACHE_NAME = 'wb-calc-v1.0.0'
const RUNTIME_CACHE = 'wb-calc-runtime-v1.0.0'

// Страницы для кеширования
const PRECACHE_URLS = [
  '/',
  '/calculator',
  '/competitors',
  '/ai-assistant',
  '/analytics',
  '/offline'
]

// API endpoints для кеширования
const API_CACHE_PATTERNS = [
  /^\/api\/units/,
  /^\/api\/categories/,
  /^\/api\/settings/
]

// Статические ресурсы
const STATIC_CACHE_PATTERNS = [
  /\.(?:js|css|png|jpg|jpeg|svg|gif|ico|webp|woff|woff2|ttf|eot)$/,
  /^\/manifest\.json$/
]

/**
 * Установка Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Установка Service Worker')

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кеширование предзагруженных ресурсов')
        return cache.addAll(PRECACHE_URLS)
      })
      .then(() => {
        console.log('[SW] Пропуск ожидания')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Ошибка при кешировании:', error)
      })
  )
})

/**
 * Активация Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Активация Service Worker')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Удаляем старые кеши
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Удаление старого кеша:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Требование контроля клиентов')
        return self.clients.claim()
      })
  )
})

/**
 * Перехват fetch запросов
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') {
    return
  }

  // Пропускаем внешние запросы
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Возвращаем кешированный ответ если он есть
        if (cachedResponse) {
          return cachedResponse
        }

        // Клонируем запрос для кеширования
        const fetchRequest = request.clone()

        return fetch(fetchRequest)
          .then((response) => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Клонируем ответ для кеширования
            const responseToCache = response.clone()

            // Определяем тип кеша
            let cacheName = RUNTIME_CACHE

            if (shouldCacheStatic(request.url)) {
              cacheName = CACHE_NAME
            } else if (shouldCacheAPI(request.url)) {
              cacheName = RUNTIME_CACHE
            }

            // Кешируем ответ
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache)
              })

            return response
          })
          .catch((error) => {
            console.error('[SW] Ошибка загрузки:', error)

            // Возвращаем оффлайн страницу для навигационных запросов
            if (request.destination === 'document') {
              return caches.match('/offline')
            }

            throw error
          })
      })
  )
})

/**
 * Обработка push уведомлений
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Получено push уведомление')

  if (!event.data) {
    return
  }

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Посмотреть',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

/**
 * Обработка кликов по уведомлениям
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Клик по уведомлению')

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  }
})

/**
 * Обработка сообщений от основного потока
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

/**
 * Проверка необходимости кеширования статических ресурсов
 */
function shouldCacheStatic(url) {
  return STATIC_CACHE_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * Проверка необходимости кеширования API запросов
 */
function shouldCacheAPI(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * Обновление кеша при получении сообщения об обновлении
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    console.log('[SW] Обновление кеша')

    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return fetch('/manifest.json')
            .then((response) => response.json())
            .then((manifest) => {
              const urlsToCache = manifest.precache || []
              return cache.addAll(urlsToCache)
            })
        })
    )
  }
})
