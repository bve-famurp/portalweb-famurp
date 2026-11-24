import React, { useState } from 'react';
import { ChevronDown, Layers, Smartphone, BookOpen, RefreshCw, RotateCcw, Check } from 'lucide-react';
import { cursosPort } from '../../adapters';
import { CourseApiDto } from '../../types/resourceApiTypes';

interface FilterCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ checked, onChange, label }) => (
  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors group/chk select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <span
      aria-hidden="true"
      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#008744] peer-focus-visible:ring-offset-1 ${
        checked
          ? 'bg-[#008744] border-[#008744] text-white'
          : 'bg-white border-slate-400 group-hover/chk:border-[#008744]'
      }`}
    >
      {checked && <Check className="w-3 h-3 stroke-[3]" />}
    </span>
    <span className="flex-1 min-w-0 font-medium leading-snug break-words">{label}</span>
  </label>
);

export interface DirectoryFiltersProps {
  licenseFilter: 'all' | 'subscription' | 'open';
  onLicenseFilterChange: (value: 'all' | 'subscription' | 'open') => void;
  hasMobileAppFilter: boolean;
  onHasMobileAppFilterChange: (value: boolean) => void;
  selectedCursoIds?: number[];
  onSelectedCursoIdsChange?: (cursoIds: number[]) => void;
  onResetFilters?: () => void;
}

export const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({
  licenseFilter,
  onLicenseFilterChange,
  hasMobileAppFilter,
  onHasMobileAppFilterChange,
  selectedCursoIds = [],
  onSelectedCursoIdsChange,
  onResetFilters,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLicenseOpen, setIsLicenseOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  const [isAsignaturasOpen, setIsAsignaturasOpen] = useState(false);
  const [cursos, setCursos] = useState<CourseApiDto[]>([]);
  const [isLoadingCursos, setIsLoadingCursos] = useState(false);
  const [hasLoadedCursos, setHasLoadedCursos] = useState(false);

  const hasActiveFilters =
    licenseFilter !== 'all' || hasMobileAppFilter || selectedCursoIds.length > 0;

  const handleToggleAsignaturas = async () => {
    const nextState = !isAsignaturasOpen;
    setIsAsignaturasOpen(nextState);

    if (nextState && !hasLoadedCursos && !isLoadingCursos) {
      setIsLoadingCursos(true);
      try {
        const data = await cursosPort.getCursos();
        setCursos(data);
        setHasLoadedCursos(true);
      } catch {
        setCursos([]);
      } finally {
        setIsLoadingCursos(false);
      }
    }
  };

  const handleCheckbox = (idCurso: number) => {
    if (!onSelectedCursoIdsChange) return;
    if (selectedCursoIds.includes(idCurso)) {
      onSelectedCursoIdsChange(selectedCursoIds.filter((id) => id !== idCurso));
    } else {
      onSelectedCursoIdsChange([...selectedCursoIds, idCurso]);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div
        className={`px-4 py-3 transition-colors duration-200 flex items-center justify-between ${
          isPanelOpen
            ? 'bg-[#008744] text-white border-b border-[#007A3D]'
            : 'bg-white text-slate-900'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="w-full flex items-center justify-between text-left font-display font-bold text-sm cursor-pointer"
        >
          <span className={isPanelOpen ? 'text-white' : 'text-slate-900 hover:text-[#008744] transition-colors'}>
            Filtros
          </span>
          <div className="flex items-center gap-2.5">
            {hasActiveFilters && onResetFilters && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onResetFilters();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onResetFilters();
                  }
                }}
                className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer hover:underline ${
                  isPanelOpen ? 'text-white' : 'text-[#008744]'
                }`}
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isPanelOpen ? 'rotate-180 text-white' : 'text-slate-600'
              }`}
            />
          </div>
        </button>
      </div>

      {isPanelOpen && (
        <div className="p-4 flex flex-col gap-5">
          <div className="border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setIsLicenseOpen(!isLicenseOpen)}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1 group"
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#008744]" />
                Tipo de licencia
              </span>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                  isLicenseOpen
                    ? 'rotate-180 bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-700'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </button>

            {isLicenseOpen && (
              <div className="mt-2.5 flex flex-col gap-2 pl-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="radio"
                    name="licenseFilter"
                    value="all"
                    checked={licenseFilter === 'all'}
                    onChange={() => onLicenseFilterChange('all')}
                    className="w-4 h-4 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Todas las licencias</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="radio"
                    name="licenseFilter"
                    value="subscription"
                    checked={licenseFilter === 'subscription'}
                    onChange={() => onLicenseFilterChange('subscription')}
                    className="w-4 h-4 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Suscripción URP</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="radio"
                    name="licenseFilter"
                    value="open"
                    checked={licenseFilter === 'open'}
                    onChange={() => onLicenseFilterChange('open')}
                    className="w-4 h-4 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Acceso Abierto</span>
                </label>
              </div>
            )}
          </div>

          <div className="border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1 group"
            >
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#008744]" />
                App Móvil
              </span>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                  isMobileOpen
                    ? 'rotate-180 bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-700'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </button>

            {isMobileOpen && (
              <div className="mt-2.5 pl-1">
                <FilterCheckbox
                  checked={hasMobileAppFilter}
                  onChange={() => onHasMobileAppFilterChange(!hasMobileAppFilter)}
                  label="Cuenta con app móvil"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={handleToggleAsignaturas}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1 group"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#008744]" />
                Filtrar por Asignatura
              </span>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                  isAsignaturasOpen
                    ? 'rotate-180 bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-700'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </button>

            {isAsignaturasOpen && (
              <div className="mt-2.5">
                {isLoadingCursos ? (
                  <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#008744]" />
                    <span>Cargando asignaturas...</span>
                  </div>
                ) : cursos.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No hay asignaturas disponibles.</p>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto px-1 py-1 pr-2 flex flex-col gap-2.5">
                    {cursos.map((curso) => (
                      <FilterCheckbox
                        key={curso.idCurso}
                        checked={selectedCursoIds.includes(curso.idCurso)}
                        onChange={() => handleCheckbox(curso.idCurso)}
                        label={curso.nombreCurso}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
