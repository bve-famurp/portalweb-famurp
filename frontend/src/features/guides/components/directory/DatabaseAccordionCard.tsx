import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Database,
  PlayCircle,
  Lock,
  Globe,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import {
  MedicalDatabase,
} from '../../data/databasesData';
import { basesDeDatosAdapter } from '../../adapters/staticBasesDeDatosAdapter';

interface DatabaseAccordionCardProps {
  database: MedicalDatabase;
  isExpanded: boolean;
  onToggle: () => void;
  onDetailLoaded?: (updated: MedicalDatabase) => void;
}

export const DatabaseAccordionCard: React.FC<DatabaseAccordionCardProps> = ({
  database,
  isExpanded,
  onToggle,
  onDetailLoaded,
}) => {
  const [detail, setDetail] = useState<MedicalDatabase>(database);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [imageScaleClass, setImageScaleClass] = useState('max-h-20 sm:max-h-24');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setDetail(database);
  }, [database]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio <= 1.3) {
        setImageScaleClass('max-h-24 sm:max-h-28 scale-125 sm:scale-135');
      } else if (ratio < 2.0) {
        setImageScaleClass('max-h-22 sm:max-h-24 scale-110 sm:scale-115');
      } else {
        setImageScaleClass('max-h-16 sm:max-h-20 max-w-[88%]');
      }
    }
  };

  const handleClickHeader = async () => {
    onToggle();

    if (!isExpanded && !detail.description) {
      const targetId = detail.rawId ?? detail.id;
      try {
        setIsLoadingDetail(true);
        const item = await basesDeDatosAdapter.getDatabaseById(targetId);
        if (item) {
          setDetail(item);
          onDetailLoaded?.(item);
        }
      } catch {
        setDetail((prev) => ({
          ...prev,
          description: 'Recurso de información médica de la Universidad Ricardo Palma.',
        }));
      } finally {
        setIsLoadingDetail(false);
      }
    }
  };

  const logoSrc = basesDeDatosAdapter.getLogoUrl(detail.logoFile);

  return (
    <div
      className={`rounded-lg transition-all duration-300 border-2 overflow-hidden ${
        isExpanded
          ? 'bg-white border-slate-900 shadow-urp-brutal'
          : 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-urp-brutal-sm'
      }`}
    >
      <div
        onClick={handleClickHeader}
        className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="min-w-0 pr-3">
          <h4
            className={`text-xs sm:text-sm font-bold transition-colors truncate ${
              isExpanded ? 'text-[#008744]' : 'text-slate-900 group-hover:text-[#008744]'
            }`}
          >
            {detail.title}
          </h4>
          <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
            {detail.tags && detail.tags.length > 0
              ? detail.tags.slice(0, 2).join(' • ')
              : detail.accessType}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform duration-300 ${
              isExpanded
                ? 'rotate-180 bg-[#008744] text-white border-[#008744]'
                : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-900 group-hover:text-slate-900'
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-3 border-t-2 border-slate-100 flex flex-col gap-4">
          <div className="flex justify-center items-center h-28 sm:h-32 p-4 bg-slate-50/90 border-2 border-slate-200 rounded-lg shadow-inner overflow-hidden select-none">
            {logoSrc && !imageError ? (
              <img
                src={logoSrc}
                alt={detail.title}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={() => setImageError(true)}
                className={`${imageScaleClass} max-w-full object-contain transition-transform duration-200`}
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                <Database className="w-5 h-5 text-[#008744]" />
                <span className="truncate max-w-[240px]">{detail.title}</span>
              </div>
            )}
          </div>

          <div>
            {detail.tags && detail.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-2.5">
                {detail.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold"
                  >
                    {tag}
                  </span>
                ))}
                {detail.tags.length > 3 && (
                  <span
                    className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold"
                    title={detail.tags.slice(3).join(', ')}
                  >
                    {detail.tags.length - 3}+
                  </span>
                )}
              </div>
            )}

            {isLoadingDetail ? (
              <div className="space-y-2 py-2 animate-pulse">
                <div className="h-3.5 bg-slate-200 rounded w-full" />
                <div className="h-3.5 bg-slate-200 rounded w-5/6" />
                <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                <div className="flex items-center gap-2 pt-1 text-xs text-[#008744] font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#008744]" />
                  <span>Cargando descripción clínica y tutorial...</span>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {detail.description ||
                  'Recurso de información médica suscrito o seleccionado por la Facultad de Medicina Humana URP.'}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-800">
            <div
              className={`flex items-center justify-between ${
                detail.hasMobileApp ? 'pb-1.5 border-b border-slate-200/80' : ''
              }`}
            >
              <span className="font-bold text-slate-500">Modalidad de Acceso:</span>
              <span className="font-black text-slate-900 flex items-center gap-1">
                {detail.accessType === 'Suscripción URP' ? (
                  <Lock className="w-3 h-3 text-[#008744]" />
                ) : (
                  <Globe className="w-3 h-3 text-[#008744]" />
                )}
                {detail.accessType}
              </span>
            </div>
            {detail.hasMobileApp && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">App Móvil:</span>
                <span className="font-black text-[#008744]">Disponible (iOS / Android)</span>
              </div>
            )}
          </div>

          <a
            href={detail.accessUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-3 px-5 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white font-bold text-xs sm:text-sm tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {detail.accessType === 'Suscripción URP'
                ? 'Acceder vía Intranet URP'
                : 'Ir a la Base de Datos'}
            </span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {!isLoadingDetail && Boolean(detail.tutorialVideoId) && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#008744] flex items-center justify-center text-white shrink-0">
                    <PlayCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-black tracking-wider uppercase text-slate-800">
                    Tutorial Oficial
                  </span>
                </div>
                {detail.tutorialUrl && (
                  <a
                    href={detail.tutorialUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-bold text-slate-500 hover:text-[#008744] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    title="Ver en YouTube"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="w-full aspect-video rounded-lg border-2 border-slate-900 shadow-urp-brutal-sm overflow-hidden bg-[#020617]">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${detail.tutorialVideoId}?rel=0`}
                  title={`Tutorial Oficial - ${detail.title}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
