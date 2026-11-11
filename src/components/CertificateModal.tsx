import React from 'react';
import { CheckCircle2, Download, Printer, ShieldCheck, X } from 'lucide-react';
import { ApprenticeProfile } from '../types/induction';
import { SENA_EMBLEM_IMAGE, SENA_LOGO_SVG } from '../data/senaData';

interface CertificateModalProps {
  apprentice: ApprenticeProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  apprentice,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const verificationHash = apprentice.codigoVerificacion || `SENA-IND-2026-${apprentice.documento.slice(-5)}-${apprentice.fichaNombre}`;
  const issueDate = apprentice.fechaCertificado || new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Controls bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <img src={SENA_LOGO_SVG} alt="" className="w-4 h-4 object-contain" />
            <span className="font-semibold text-slate-800 dark:text-white">Certificación Oficial de Inducción</span>
            <span>·</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">{verificationHash}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#00324D] hover:bg-[#002538] text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet (Print Area) */}
        <div className="p-8 sm:p-12 bg-linear-to-b from-emerald-50/30 via-white to-slate-50 relative border-8 border-double border-emerald-900/15 m-4 rounded-lg">
          {/* Institutional Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center">
                <img
                  src={SENA_LOGO_SVG}
                  alt="Logotipo Oficial SENA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-16 h-16 rounded-full border border-amber-500/30 overflow-hidden shadow-xs bg-white p-1 flex items-center justify-center">
                <img
                  src={SENA_EMBLEM_IMAGE}
                  alt="Escudo Institucional SENA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-[11px] tracking-widest uppercase font-semibold text-slate-600">
              República de Colombia
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
              Servicio Nacional de Aprendizaje — SENA
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Dirección de Formación Profesional Integral
            </p>
          </div>

          {/* Statement */}
          <div className="text-center my-6 space-y-3">
            <p className="text-xs tracking-wider uppercase text-slate-600">
              Certifica que el(la) aprendiz:
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] tracking-tight">
              {apprentice.nombre}
            </h3>
            <p className="text-xs text-slate-600 font-mono">
              Identificado(a) con {apprentice.tipoDocumento} No. {apprentice.documento}
            </p>
            <div className="py-2 text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              Cumplió a cabalidad con la totalidad de los módulos y requisitos pedagógicos de la:
              <p className="text-base font-bold text-slate-900 mt-1">
                Jornada de Inducción Institucional a la Formación Profesional Integral
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Apropiando la identidad institucional, símbolos patrios del SENA, valores, principios éticos y el Reglamento del Aprendiz (Acuerdo 007 de 2012).
              </p>
            </div>
          </div>

          {/* Program & Ficha Details Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto py-3 px-4 bg-slate-50/80 rounded-lg border border-slate-200 text-xs text-slate-700">
            <div>
              <span className="text-slate-500 block text-[11px]">Programa de Formación:</span>
              <span className="font-semibold text-slate-900">{apprentice.programaFormacion}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Ficha de Caracterización:</span>
              <span className="font-mono font-bold text-[#39A900]">{apprentice.fichaNombre}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Centro de Formación:</span>
              <span className="font-medium text-slate-800">{apprentice.centroFormacion}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Regional:</span>
              <span className="font-medium text-slate-800">{apprentice.regional}</span>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-10 pt-6 border-t border-slate-300 text-center">
            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-sm text-slate-800">Dra. Claudia Marcela Peña</span>
              </div>
              <div className="w-48 mx-auto border-t border-slate-400 mt-1 pt-1">
                <p className="text-xs font-semibold text-slate-900">Subdirección de Centro</p>
                <p className="text-[10px] text-slate-500">SENA Centro de Formación</p>
              </div>
            </div>

            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="font-serif italic text-sm text-slate-800">{apprentice.instructorLider}</span>
              </div>
              <div className="w-48 mx-auto border-t border-slate-400 mt-1 pt-1">
                <p className="text-xs font-semibold text-slate-900">Instructor Líder de Ficha</p>
                <p className="text-[10px] text-slate-500">Equipo de Inducción SENA</p>
              </div>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              <span>Fecha de expedición: {issueDate}</span>
              <span className="mx-1.5">·</span>
              <span>Duración certificada: 40 horas</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
              <span>Código Único: {verificationHash}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
