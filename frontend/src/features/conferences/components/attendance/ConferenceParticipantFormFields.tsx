import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { TipoParticipante, TipoDocumento } from '../../types';

interface ConferenceParticipantFormFieldsProps {
  tipoParticipante: TipoParticipante;
  setTipoParticipante: (val: TipoParticipante) => void;
  tipoDocumento: TipoDocumento;
  setTipoDocumento: (val: TipoDocumento) => void;
  numeroDocumento: string;
  onDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nombres: string;
  setNombres: (val: string) => void;
  apellidos: string;
  setApellidos: (val: string) => void;
  correo: string;
  setCorreo: (val: string) => void;
}

export const ConferenceParticipantFormFields: React.FC<ConferenceParticipantFormFieldsProps> = ({
  tipoParticipante,
  setTipoParticipante,
  tipoDocumento,
  setTipoDocumento,
  numeroDocumento,
  onDocumentChange,
  nombres,
  setNombres,
  apellidos,
  setApellidos,
  correo,
  setCorreo,
}) => {
  const [isEstudianteDropdownOpen, setIsEstudianteDropdownOpen] = useState(false);
  const estudianteDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (estudianteDropdownRef.current && !estudianteDropdownRef.current.contains(event.target as Node)) {
        setIsEstudianteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isEstudianteActive = tipoParticipante === 'Pregrado' || tipoParticipante === 'Posgrado' || tipoParticipante === 'Estudiante';

  return (
    <>
      <div>
        <label className="text-xs font-extrabold text-slate-800 block mb-2">
          Tipo de Participante:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="relative" ref={estudianteDropdownRef}>
            <button
              type="button"
              onClick={() => setIsEstudianteDropdownOpen((prev) => !prev)}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                isEstudianteActive
                  ? 'bg-[#008744] text-white border-slate-900 shadow-urp-brutal-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>
                {tipoParticipante === 'Posgrado'
                  ? 'Est. Posgrado'
                  : tipoParticipante === 'Pregrado'
                    ? 'Est. Pregrado'
                    : 'Estudiante'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {isEstudianteDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 w-full min-w-[140px] bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setTipoParticipante('Pregrado');
                    setIsEstudianteDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    tipoParticipante === 'Pregrado' || tipoParticipante === 'Estudiante'
                      ? 'bg-slate-100 text-[#008744]'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>Pregrado</span>
                  {(tipoParticipante === 'Pregrado' || tipoParticipante === 'Estudiante') && (
                    <Check className="w-3.5 h-3.5 text-[#008744]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipoParticipante('Posgrado');
                    setIsEstudianteDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    tipoParticipante === 'Posgrado'
                      ? 'bg-slate-100 text-[#008744]'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>Posgrado</span>
                  {tipoParticipante === 'Posgrado' && (
                    <Check className="w-3.5 h-3.5 text-[#008744]" />
                  )}
                </button>
              </div>
            )}
          </div>

          {(['Docente', 'Residentado', 'Otro'] as TipoParticipante[]).map((rol) => (
            <button
              key={rol}
              type="button"
              onClick={() => {
                setTipoParticipante(rol);
                setIsEstudianteDropdownOpen(false);
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                tipoParticipante === rol
                  ? 'bg-[#008744] text-white border-slate-900 shadow-urp-brutal-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {rol}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5">
          <label htmlFor="participant-doc-type" className="text-xs font-extrabold text-slate-800 block mb-1">
            Tipo de Documento:
          </label>
          <select
            id="participant-doc-type"
            name="document-type"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
          >
            <option value="CODIGO_URP">Código Universitario (9 dígitos)</option>
            <option value="DNI">DNI (8 dígitos)</option>
            <option value="CE">Carné de Extranjería (CE)</option>
          </select>
        </div>

        <div className="sm:col-span-7">
          <label htmlFor="participant-doc-number" className="text-xs font-extrabold text-slate-800 block mb-1">
            N° de Documento / Código:
          </label>
          <input
            id="participant-doc-number"
            name="username"
            autoComplete="username"
            type="text"
            value={numeroDocumento}
            onChange={onDocumentChange}
            placeholder={
              tipoDocumento === 'DNI'
                ? 'Ej. 74829103'
                : tipoDocumento === 'CODIGO_URP'
                  ? 'Ej. 202210452'
                  : 'Ej. 001234567'
            }
            maxLength={tipoDocumento === 'DNI' ? 8 : 9}
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-sans font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="participant-given-name" className="text-xs font-extrabold text-slate-800 block mb-1">
            Nombres Completos:
          </label>
          <input
            id="participant-given-name"
            name="given-name"
            autoComplete="given-name"
            type="text"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            placeholder="Ej. Carlos Eduardo"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
          />
        </div>
        <div>
          <label htmlFor="participant-family-name" className="text-xs font-extrabold text-slate-800 block mb-1">
            Apellidos Completos:
          </label>
          <input
            id="participant-family-name"
            name="family-name"
            autoComplete="family-name"
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder="Ej. Mendoza Morales"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="participant-email" className="text-xs font-extrabold text-slate-800 block mb-1">
          Correo Institucional o de Contacto:
        </label>
        <input
          id="participant-email"
          name="email"
          autoComplete="email"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="ejemplo@urp.edu.pe"
          required
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
        />
      </div>
    </>
  );
};
