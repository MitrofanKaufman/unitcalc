import React, { useState } from 'react';
import { WbSearch } from '../components/features/wb-search/WbSearch';
import { useNotificationActions } from '../lib/notifications/useNotificationActions';

// Компонент страницы компонентов
const ComponentsPage: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, showPersistent } = useNotificationActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Шапка страницы */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: '#2c3e50',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🧩 Компоненты системы
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#6c757d',
            marginBottom: '2rem'
          }}>
            Демонстрация компонентов и уведомлений приложения
          </p>
        </div>

        {/* Слайд-меню */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: isMenuOpen ? '0' : '-300px',
          width: '300px',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          transition: 'left 0.3s ease',
          zIndex: 1000,
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}>
          <div style={{
            padding: '2rem',
            color: 'white'
          }}>
            <h2 style={{
              marginBottom: '2rem',
              borderBottom: '2px solid rgba(255,255,255,0.3)',
              paddingBottom: '1rem'
            }}>
              🎛️ Панель управления
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                ❌ Закрыть меню
              </button>

              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.3)',
                paddingTop: '1rem',
                marginTop: '1rem'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#ffd700' }}>🔔 Уведомления</h3>

                <button
                  onClick={() => {
                    showSuccess('Тест успеха!', 'Это тестовое уведомление успеха');
                    setIsMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#4caf50',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  ✅ Показать успех
                </button>

                <button
                  onClick={() => {
                    showError('Тест ошибки!', 'Это тестовое уведомление ошибки');
                    setIsMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#f44336',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  ❌ Показать ошибку
                </button>

                <button
                  onClick={() => {
                    showWarning('Тест предупреждения!', 'Это тестовое уведомление предупреждения');
                    setIsMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#ff9800',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  ⚠️ Показать предупреждение
                </button>

                <button
                  onClick={() => {
                    showInfo('Тест информации!', 'Это тестовое уведомление информации');
                    setIsMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#2196f3',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  ℹ️ Показать информацию
                </button>

                <button
                  onClick={() => {
                    showPersistent('Постоянное уведомление', 'Это уведомление не исчезнет автоматически', 'info');
                    setIsMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: '#9c27b0',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  📌 Постоянное уведомление
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка гамбургер-меню */}
        <button
          onClick={() => setIsMenuOpen(true)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1001,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          ☰
        </button>

        {/* Оверлей для закрытия меню */}
        {isMenuOpen && (
          <div
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
          />
        )}

        {/* Секция с уведомлениями */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '2rem',
            borderBottom: '2px solid #667eea',
            paddingBottom: '1rem'
          }}>
            🔔 Система уведомлений
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Примеры уведомлений */}
            <div>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🎯 Примеры уведомлений</h3>

              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                <button
                  onClick={() => showSuccess('Успех!', 'Операция выполнена успешно')}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(45deg, #4caf50, #45a049)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ✅ Показать успех
                </button>

                <button
                  onClick={() => showError('Ошибка!', 'Произошла критическая ошибка в системе')}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ❌ Показать ошибку
                </button>

                <button
                  onClick={() => showWarning('Предупреждение!', 'Проверьте введенные данные перед продолжением')}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ⚠️ Показать предупреждение
                </button>

                <button
                  onClick={() => showInfo('Информация', 'Приложение работает в тестовом режиме. Все данные сохраняются локально.')}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ℹ️ Показать информацию
                </button>
              </div>
            </div>

            {/* Документация */}
            <div>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>📚 Документация</h3>

              <div style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ marginBottom: '1rem', color: '#495057' }}>💡 Использование в коде:</h4>

                <pre style={{
                  background: '#2d3748',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                  marginBottom: '1rem'
                }}>
{`import { useNotificationActions } from '@/lib/notifications/useNotificationActions';

const { showSuccess, showError, showWarning, showInfo } = useNotificationActions();

// Примеры использования:
showSuccess('Заголовок', 'Сообщение об успехе');
showError('Ошибка!', 'Описание проблемы', 8000); // 8 секунд
showWarning('Внимание!', 'Проверьте данные');
showInfo('Инфо', 'Информационное сообщение');

// Постоянное уведомление (не исчезает автоматически)
showPersistent('Важно!', 'Это сообщение требует внимания', 'warning');`}
                </pre>

                <h4 style={{ marginBottom: '0.5rem', color: '#495057' }}>🎨 Типы уведомлений:</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '1rem'
                }}>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#4caf50' }}>🟢 Success</span> - успешные операции
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#f44336' }}>🔴 Error</span> - ошибки и проблемы
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#ff9800' }}>🟡 Warning</span> - предупреждения
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#2196f3' }}>🔵 Info</span> - информационные сообщения
                  </li>
                </ul>

                <h4 style={{ marginBottom: '0.5rem', color: '#495057' }}>⚙️ Параметры:</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  <li>• <code>title</code> - заголовок уведомления</li>
                  <li>• <code>message</code> - подробное сообщение (опционально)</li>
                  <li>• <code>duration</code> - время показа в мс (по умолчанию 5000мс)</li>
                  <li>• <code>persistent</code> - не исчезает автоматически</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Секция поиска товаров */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '2rem',
            borderBottom: '2px solid #667eea',
            paddingBottom: '1rem'
          }}>
            🔍 Компонент поиска товаров
          </h2>

          <div style={{
            opacity: 0.8,
            fontStyle: 'italic',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            Здесь размещен компонент поиска товаров Wildberries с полной функциональностью
          </div>

          <WbSearch />
        </div>
      </div>
    </main>
  );
};

export default ComponentsPage;
