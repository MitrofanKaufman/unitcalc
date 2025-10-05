import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  message?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  message = 'Загрузка...'
}) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-message">{message}</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
