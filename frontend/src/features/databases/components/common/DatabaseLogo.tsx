import React, { useState } from 'react';
import { basesDeDatosAdapter } from '../../adapters/staticBasesDeDatosAdapter';

interface DatabaseLogoProps {
  logoUrl?: string | null;
  name: string;
  className?: string;
  fallbackText?: string;
}

export const DatabaseLogo: React.FC<DatabaseLogoProps> = ({
  logoUrl,
  name,
  className = 'w-9 h-9',
  fallbackText = 'MED',
}) => {
  const [hasError, setHasError] = useState(false);
  const logoSrc = basesDeDatosAdapter.getLogoUrl(logoUrl || undefined);

  return (
    <div
      className={`${className} rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0`}
    >
      {!hasError && logoSrc ? (
        <img
          src={logoSrc}
          alt={name}
          className="max-w-full max-h-full object-contain"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-[9px] font-bold text-slate-400">{fallbackText}</span>
      )}
    </div>
  );
};
