import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import {
  MedicalDatabase,
  basesDeDatosPort,
  DatabaseSkeletonGrid,
  DatabaseAccordionCard,
  DatabaseMasonry,
  DirectoryFilters,
  DatabaseSearchBar,
} from '../features/databases';
import { normalizeText } from '../utils/textUtils';

interface DirectoryPageProps {
  initialSearchQuery?: string;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({ initialSearchQuery = '' }) => {
  const [databases, setDatabases] = useState<MedicalDatabase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSkeletonExiting, setIsSkeletonExiting] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const skeletonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [hasMobileAppFilter, setHasMobileAppFilter] = useState(false);
  const [selectedCursoIds, setSelectedCursoIds] = useState<number[]>([]);
  const [expandedDbIds, setExpandedDbIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    return () => {
      if (skeletonTimerRef.current) {
        clearTimeout(skeletonTimerRef.current);
      }
    };
  }, []);

  const loadLiveDatabases = useCallback(async () => {
    try {
      setIsLoading(true);
      setShowSkeleton(true);
      setIsSkeletonExiting(false);
      const data = await basesDeDatosPort.getDatabases();
      if (data && data.length > 0) {
        setDatabases(data);
        setIsLiveConnected(true);
      } else {
        setDatabases([]);
        setIsLiveConnected(false);
      }
    } catch {
      setDatabases([]);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
      setIsSkeletonExiting(true);
      if (skeletonTimerRef.current) {
        clearTimeout(skeletonTimerRef.current);
      }
      skeletonTimerRef.current = setTimeout(() => {
        setShowSkeleton(false);
        setIsSkeletonExiting(false);
      }, 350);
    }
  }, []);

  useEffect(() => {
    loadLiveDatabases();
  }, [loadLiveDatabases]);

  const toggleExpand = (id: string) => {
    setExpandedDbIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setLicenseFilter('all');
    setHasMobileAppFilter(false);
    setSelectedCursoIds([]);
    setSearchQuery('');
  };

  const filteredDbs = databases.filter((db) => {
    const q = normalizeText(searchQuery);
    const matchesSearch =
      !q ||
      normalizeText(db.title).includes(q) ||
      normalizeText(db.description).includes(q) ||
      normalizeText(db.accessType).includes(q) ||
      db.cursos.some(
        (c) =>
          normalizeText(c.nombreCurso).includes(q) ||
          (c.codigoCurso && normalizeText(c.codigoCurso).includes(q))
      );

    const matchesLicense =
      licenseFilter === 'all' ||
      (licenseFilter === 'subscription' && db.accessType === 'Suscripción URP') ||
      (licenseFilter === 'open' && db.accessType !== 'Suscripción URP');

    const matchesMobileApp =
      !hasMobileAppFilter || db.hasMobileApp === true;

    const matchesAsignaturas =
      selectedCursoIds.length === 0 ||
      db.cursos.some((c) => selectedCursoIds.includes(c.idCurso));

    return matchesSearch && matchesLicense && matchesMobileApp && matchesAsignaturas;
  });

  const renderCard = (db: MedicalDatabase) => (
    <DatabaseAccordionCard
      key={db.id}
      database={db}
      isExpanded={expandedDbIds.has(db.id)}
      onToggle={() => toggleExpand(db.id)}
    />
  );

  return (
    <div className="w-full pb-20">
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <aside className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="directory-title-search"
                className="font-display font-bold text-xs uppercase tracking-wider text-slate-800"
              >
                Filtrar por título
              </label>
              <DatabaseSearchBar
                variant="compact"
                id="directory-title-search"
                name="titleSearch"
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder="Buscar base de datos..."
              />
            </div>

            <DirectoryFilters
              licenseFilter={licenseFilter}
              onLicenseFilterChange={setLicenseFilter}
              hasMobileAppFilter={hasMobileAppFilter}
              onHasMobileAppFilterChange={setHasMobileAppFilter}
              selectedCursoIds={selectedCursoIds}
              onSelectedCursoIdsChange={setSelectedCursoIds}
              onResetFilters={handleResetFilters}
            />
          </aside>

          <section className="lg:col-span-3 flex flex-col gap-5">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-xl text-slate-900 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <span>Cargando...</span>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#008744]" />
                    </>
                  ) : (
                    `Mostrando recursos (${filteredDbs.length})`
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Haz clic en cualquier plataforma para desplegar su ficha técnica completa, tutorial de acceso remoto y enlace directo.
                </p>
              </div>
            </div>

            <div className="relative w-full min-h-[300px]">
              {showSkeleton && (
                <div
                  className={`w-full transition-opacity duration-300 ease-out ${
                    isSkeletonExiting
                      ? 'absolute inset-0 z-10 pointer-events-none opacity-0'
                      : 'relative z-0 opacity-100'
                  }`}
                >
                  <DatabaseSkeletonGrid count={9} />
                </div>
              )}

              {!isLoading && filteredDbs.length > 0 && (
                <div className="w-full transition-opacity duration-300 ease-out opacity-100">
                  <DatabaseMasonry
                    items={filteredDbs}
                    renderItem={renderCard}
                    ease="power2.out"
                    duration={0.5}
                    stagger={0.03}
                    animateFrom="bottom"
                    blurToFocus={true}
                  />
                </div>
              )}

              {!isLoading && filteredDbs.length === 0 && (
                <div className="py-16 text-center text-slate-500 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-base font-bold text-slate-800">No se encontraron recursos</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isLiveConnected
                      ? 'Prueba con otra palabra clave o limpia los filtros aplicados.'
                      : 'No se pudo establecer conexión con el catálogo de bases de datos médicas.'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
