import React from 'react';

export type ParticipantRole = 'Estudiante' | 'Docente' | 'Residentado' | 'Otros';

export interface ConferenceParticipantFormFieldsProps {
  apellidoPaterno: string;
  onApellidoPaternoChange: (val: string) => void;
  apellidoMaterno: string;
  onApellidoMaternoChange: (val: string) => void;
  nombres: string;
  onNombresChange: (val: string) => void;
  correo: string;
  onCorreoChange: (val: string) => void;
  idPrefix?: string;
  required?: boolean;
  emailPlaceholder?: string;
}

export const ConferenceParticipantFormFields: React.FC<ConferenceParticipantFormFieldsProps> = ({
  apellidoPaterno,
  onApellidoPaternoChange,
  apellidoMaterno,
  onApellidoMaternoChange,
  nombres,
  onNombresChange,
  correo,
  onCorreoChange,
  idPrefix = 'participant',
  required = true,
  emailPlaceholder = 'Ej. carlos.mendoza@urp.edu.pe',
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`${idPrefix}-paterno-input`}
            className="block text-xs font-bold text-slate-800 mb-1"
          >
            Apellido Paterno <span className="text-red-600">*</span>
          </label>
          <input
            id={`${idPrefix}-paterno-input`}
            type="text"
            value={apellidoPaterno}
            onChange={(e) => onApellidoPaternoChange(e.target.value)}
            placeholder="Ej. Mendoza"
            required={required}
            className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
          />
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-materno-input`}
            className="block text-xs font-bold text-slate-800 mb-1"
          >
            Apellido Materno
          </label>
          <input
            id={`${idPrefix}-materno-input`}
            type="text"
            value={apellidoMaterno}
            onChange={(e) => onApellidoMaternoChange(e.target.value)}
            placeholder="Ej. Morales"
            className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-nombres-input`}
          className="block text-xs font-bold text-slate-800 mb-1"
        >
          Nombres Completos <span className="text-red-600">*</span>
        </label>
        <input
          id={`${idPrefix}-nombres-input`}
          type="text"
          value={nombres}
          onChange={(e) => onNombresChange(e.target.value)}
          placeholder="Ej. Carlos Eduardo"
          required={required}
          className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-correo-input`}
          className="block text-xs font-bold text-slate-800 mb-1"
        >
          Correo Institucional o de Contacto <span className="text-red-600">*</span>
        </label>
        <input
          id={`${idPrefix}-correo-input`}
          type="email"
          value={correo}
          onChange={(e) => onCorreoChange(e.target.value)}
          placeholder={emailPlaceholder}
          required={required}
          className="w-full h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 transition-all"
        />
      </div>
    </div>
  );
};

export interface ConferenceRoleSelectorProps {
  role: ParticipantRole;
  onRoleChange: (val: ParticipantRole) => void;
  variant?: 'tabs' | 'pills';
  label?: string;
}

export const ConferenceRoleSelector: React.FC<ConferenceRoleSelectorProps> = ({
  role,
  onRoleChange,
  variant = 'tabs',
  label = 'Tipo de Participante',
}) => {
  const roles: ParticipantRole[] = ['Estudiante', 'Docente', 'Residentado', 'Otros'];

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
        <span>{label}</span>
      </label>
      <div
        className={
          variant === 'tabs'
            ? 'grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl'
            : 'grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-white border border-slate-200 rounded-lg'
        }
      >
        {roles.map((r) => {
          const isActive = role === r;
          const buttonClass =
            variant === 'tabs'
              ? isActive
                ? 'bg-white text-[#008744] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              : isActive
                ? 'bg-[#008744] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';

          return (
            <button
              key={r}
              type="button"
              onClick={() => onRoleChange(r)}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${buttonClass}`}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
};
