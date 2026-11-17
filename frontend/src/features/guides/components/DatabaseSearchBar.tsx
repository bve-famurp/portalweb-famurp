import { Search, X, ChevronDown } from 'lucide-react';

interface DatabaseSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  licenseFilter?: 'all' | 'subscription' | 'open';
  onLicenseFilterChange?: (value: 'all' | 'subscription' | 'open') => void;
  statusFilter?: 'all' | 'active' | 'inactive';
  onStatusFilterChange?: (value: 'all' | 'active' | 'inactive') => void;
  actionsRight?: React.ReactNode;
  variant?: 'panel' | 'hero';
  id?: string;
  name?: string;
}

export const DatabaseSearchBar: React.FC<DatabaseSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Buscar base de datos, por asignatura académica o recurso...',
  licenseFilter,
  onLicenseFilterChange,
  statusFilter,
  onStatusFilterChange,
  actionsRight,
  variant = 'panel',
  id = 'database-search',
  name = 'search',
}) => {
  if (variant === 'hero') {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
        >
          <div className="relative flex-1 bg-white rounded-lg border border-slate-200 shadow-sm focus-within:border-[#008744] focus-within:ring-2 focus-within:ring-[#008744]/20 px-4 h-11 flex items-center gap-2.5 transition-all">
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400 shrink-0" />
            <input
              id={`${id}-hero-input`}
              name={name}
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer transition-colors shrink-0"
                title="Limpiar búsqueda"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {onLicenseFilterChange && (
            <div className="relative shrink-0 w-full sm:w-auto">
              <select
                id={`${id}-hero-license-filter`}
                name="licenseFilter"
                aria-label="Filtrar por tipo de licencia"
                value={licenseFilter || 'all'}
                onChange={(e) => onLicenseFilterChange(e.target.value as 'all' | 'subscription' | 'open')}
                className="w-full sm:w-auto h-11 appearance-none pl-4 pr-10 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-sm outline-none cursor-pointer hover:border-slate-400 focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all flex items-center"
              >
                <option value="all">Todas las licencias</option>
                <option value="subscription">Suscripción URP</option>
                <option value="open">Acceso Abierto</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-800 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>
          )}

          {actionsRight}
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id={`${id}-panel-input`}
            name={name}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full pl-10 pr-9 py-2 rounded-lg border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              title="Limpiar búsqueda"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {(onLicenseFilterChange || onStatusFilterChange) && (
          <div className="flex items-center gap-2">
            {onLicenseFilterChange && (
              <div className="relative">
                <select
                  id={`${id}-panel-license-filter`}
                  name="licenseFilter"
                  aria-label="Filtrar por tipo de licencia"
                  value={licenseFilter || 'all'}
                  onChange={(e) => onLicenseFilterChange(e.target.value as 'all' | 'subscription' | 'open')}
                  className="appearance-none py-2 pl-3 pr-8 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:border-[#008744] outline-none cursor-pointer hover:border-slate-400 transition-colors"
                >
                  <option value="all">Todas las licencias</option>
                  <option value="subscription">Suscripción URP</option>
                  <option value="open">Acceso Abierto</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {onStatusFilterChange && (
              <div className="relative">
                <select
                  id={`${id}-panel-status-filter`}
                  name="statusFilter"
                  aria-label="Filtrar por estado del recurso"
                  value={statusFilter || 'all'}
                  onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
                  className="appearance-none py-2 pl-3 pr-8 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:border-[#008744] outline-none cursor-pointer hover:border-slate-400 transition-colors"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Solo Activos</option>
                  <option value="inactive">Solo Inactivos</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>
        )}
      </div>

      {actionsRight && (
        <div className="flex items-center gap-2 shrink-0">
          {actionsRight}
        </div>
      )}
    </div>
  );
};
