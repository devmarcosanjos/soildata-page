import { type ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  loading = false,
  className = '',
}: MetricCardProps) {
  const colorClasses = {
    primary: 'bg-primary text-primary-content',
    secondary: 'bg-secondary text-secondary-content',
    accent: 'bg-accent text-accent-content',
    info: 'bg-info text-info-content',
    success: 'bg-success text-success-content',
    warning: 'bg-warning text-warning-content',
    error: 'bg-error text-error-content',
  };

  return (
    <div className={`stat ${className}`}>
      <div className={`stat-figure ${colorClasses[color]} rounded-full p-3`}>
        {icon}
      </div>
      <div className="stat-title">{title}</div>
      {loading ? (
        <div className="stat-value">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <div className="stat-value text-2xl md:text-3xl lg:text-4xl">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </div>
      )}
      {subtitle && <div className="stat-desc">{subtitle}</div>}
    </div>
  );
}

