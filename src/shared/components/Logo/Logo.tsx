import { Link } from 'react-router-dom';

const logoSoilData = '/soildata-logo.png';

interface LogoProps {
  to?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'h-4 md:h-6 w-auto',
  md: 'h-6 md:h-7 w-auto',
  lg: 'h-[18px] md:h-6 lg:h-[30px] w-auto',
};

export function Logo({ to = '/', className = '', size = 'lg', onClick }: LogoProps) {
  const imageClasses = sizeClasses[size];
  const content = (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSoilData}
        alt="SoilData"
        className={`${imageClasses} object-contain`}
      />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="shrink-0" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div className="shrink-0" onClick={onClick}>
      {content}
    </div>
  );
}

