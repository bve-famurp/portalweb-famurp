import React from 'react';
import { Phone, Mail, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { INSTITUTIONAL_LINKS } from '../../constants/institutionalLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white bg-[#0F172A] mt-auto">
      <div className="px-6 max-w-[1280px] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="md:col-span-1 lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <span className="font-display text-2xl text-white font-extrabold block tracking-tight">
                BVE-FAMURP
              </span>
              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                Biblioteca Virtual y Especializada de la Facultad de Medicina Humana – Universidad Ricardo Palma.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Síguenos en:
              </span>
              <div className="flex items-center gap-4">
                <a
                  href={INSTITUTIONAL_LINKS.facebookFamurp}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Oficial Facultad de Medicina Humana URP"
                  aria-label="Facebook Oficial FAMURP"
                  className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all transform hover:scale-105 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-[#8cf9a9] transition-colors">
                    Facebook
                  </span>
                </a>

                <a
                  href={INSTITUTIONAL_LINKS.instagramBibFamurp}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram Oficial @bib_famurp"
                  aria-label="Instagram Oficial Biblioteca FMH URP"
                  className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all transform hover:scale-105 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-[#8cf9a9] transition-colors">
                    Instagram
                  </span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-sm text-slate-300">
              <MapPin className="w-5 h-5 text-slate-300 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Ubicación</span>
                <span className="font-semibold text-white">Pabellón F, 2do Piso &bull; Campus Central URP</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-4 space-y-6 text-left">
            <div>
              <h4 className="font-display text-2xl text-white font-extrabold block tracking-tight">
                Contáctanos
              </h4>
            </div>

            <div className="space-y-4 pt-1 w-full flex flex-col items-start">
              <a
                href="tel:+51017080000"
                title="Llamar a la central telefónica URP"
                aria-label="Llamar al +51 (01) 708-0000 anexo 4210"
                className="flex items-center gap-3.5 text-sm text-slate-300 hover:text-white transition-colors group"
              >
                <Phone className="w-5 h-5 text-slate-300 group-hover:text-[#8CF9A9] shrink-0 transition-colors" />
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Atención Rápida</span>
                  <span className="font-semibold text-white group-hover:text-[#8CF9A9] transition-colors">+51 (01) 708-0000 anexo 4210</span>
                </div>
              </a>

              <a
                href="mailto:biblioteca.famurp@urp.edu.pe"
                title="Enviar correo a biblioteca.famurp@urp.edu.pe"
                aria-label="Correo institucional biblioteca.famurp@urp.edu.pe"
                className="flex items-center gap-3.5 text-sm text-slate-300 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 text-slate-300 group-hover:text-[#8CF9A9] shrink-0 transition-colors" />
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Correo Institucional</span>
                  <span className="font-semibold text-white group-hover:text-[#8CF9A9] transition-colors">biblioteca.famurp@urp.edu.pe</span>
                </div>
              </a>

              <div className="pt-2">
                <a
                  href="mailto:biblioteca.famurp@urp.edu.pe"
                  title="Enviar correo a la Biblioteca Virtual"
                  aria-label="Enviar correo a biblioteca.famurp@urp.edu.pe"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-[#8CF9A9] text-[#0F172A] font-display text-xs font-extrabold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  <span>Enviar Mensaje</span>
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 space-y-6 text-left">
            <div>
              <h4 className="font-display text-2xl text-white font-extrabold block tracking-tight">
                Sobre la Universidad
              </h4>
            </div>

            <div className="space-y-3.5 pt-1 w-full flex flex-col items-start text-sm">
              <a
                href={INSTITUTIONAL_LINKS.urpIntranet}
                target="_blank"
                rel="noopener noreferrer"
                title="Acceso a la Intranet URP"
                aria-label="Acceso a la Intranet URP"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#8CF9A9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                <span className="font-semibold group-hover:text-[#8CF9A9] transition-colors">Intranet URP</span>
              </a>

              <a
                href="https://www.urp.edu.pe/"
                target="_blank"
                rel="noreferrer"
                title="Portal oficial de la Universidad Ricardo Palma"
                aria-label="Universidad Ricardo Palma – URP"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#8CF9A9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                <span className="font-semibold group-hover:text-[#8CF9A9] transition-colors">Universidad Ricardo Palma</span>
              </a>

              <a
                href="https://www.urp.edu.pe/pregrado/facultad-de-medicina-humana/"
                target="_blank"
                rel="noreferrer"
                title="Facultad de Medicina Humana URP"
                aria-label="Facultad de Medicina Humana URP"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#8CF9A9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                <span className="font-semibold group-hover:text-[#8CF9A9] transition-colors">Facultad de Medicina</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 bg-[#020617] py-5">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Universidad Ricardo Palma. Todos los derechos reservados.</p>
          <p className="text-slate-400">
            Portal de Recursos Médicos &bull; FAMURP
          </p>
        </div>
      </div>
    </footer>
  );
};
