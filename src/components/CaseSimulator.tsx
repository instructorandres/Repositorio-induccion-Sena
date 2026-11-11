import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Gavel,
  HelpCircle,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { CaseStudy } from '../types/induction';
import { SENA_CASE_STUDIES, SENA_LOGO_SVG } from '../data/senaData';
import { senaAudio } from '../utils/audioSynth';

interface CaseSimulatorProps {
  resolvedCases: string[];
  onSolveCase: (caseId: string) => void;
  onCompleteModule: () => void;
}

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({
  resolvedCases,
  onSolveCase,
  onCompleteModule,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SENA_CASE_STUDIES[0].id);
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedGravedad, setSelectedGravedad] = useState<string>('');
  const [selectedMedida, setSelectedMedida] = useState<string>('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    details: string;
    article: string;
  } | null>(null);

  const activeCase = SENA_CASE_STUDIES.find((c) => c.id === selectedCaseId) || SENA_CASE_STUDIES[0];

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSelectedTipo('');
    setSelectedGravedad('');
    setSelectedMedida('');
    setSubmissionFeedback(null);
  };

  const handleEvaluateDecision = () => {
    if (!selectedTipo || !selectedGravedad || !selectedMedida) return;

    // Check match
    const tipoMatch = selectedTipo.toLowerCase().includes(activeCase.tipoFaltaCorrecta.toLowerCase());
    const gravedadMatch = selectedGravedad.toLowerCase().includes(activeCase.gravedadCorrecta.toLowerCase());
    const medidaMatch = selectedMedida.toLowerCase() === activeCase.medidaCorrecta.toLowerCase();

    const isAllCorrect = tipoMatch && gravedadMatch && medidaMatch;

    if (isAllCorrect) {
      senaAudio.playSuccessChime();
      onSolveCase(activeCase.id);
      // If resolving all 3
      const updatedResolved = Array.from(new Set([...resolvedCases, activeCase.id]));
      if (updatedResolved.length >= SENA_CASE_STUDIES.length) {
        onCompleteModule();
      }
    } else {
      senaAudio.playErrorChime();
    }

    setSubmissionFeedback({
      submitted: true,
      isCorrect: isAllCorrect,
      details: activeCase.explicacionJuridica,
      article: activeCase.articuloReglamento,
    });
  };

  const isCurrentCaseResolved = resolvedCases.includes(activeCase.id);

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <img src={SENA_LOGO_SVG} alt="" className="w-4 h-4 object-contain inline-block" />
            <Scale className="w-4 h-4" />
            <span>MÓDULO 03 · SIMULADOR JURÍDICO Y FORMATIVO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simulador de Casos Prácticos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Asume el rol del Comité de Evaluación y Seguimiento. Analiza expedientes reales, tipifica conductas y determina las medidas formativas conforme al Acuerdo 007 de 2012.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-[#39A900]" />
          <span>{resolvedCases.length} de {SENA_CASE_STUDIES.length} casos dictaminados con éxito</span>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SENA_CASE_STUDIES.map((c, idx) => {
          const isResolved = resolvedCases.includes(c.id);
          const isSelected = activeCase.id === c.id;

          return (
            <button
              key={c.id}
              onClick={() => handleCaseSelect(c.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#39A900] bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Caso 0{idx + 1}
                </span>
                {isResolved && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" /> Resuelto
                  </span>
                )}
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {c.titulo}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {c.programa}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Case Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Case Brief & Evidence (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span>Expediente de Inducción</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{activeCase.personaje}</span>
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-2">
              {activeCase.titulo}
            </h2>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Programa: </span>
                <span>{activeCase.programa}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Antecedentes: </span>
                <span>{activeCase.contexto}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Hechos y Situación Reportada
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/70 dark:border-amber-800">
                {activeCase.situacion}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#39A900] shrink-0" />
            <span>Aplica los principios de proporcionalidad, contradicción y función formativa del SENA.</span>
          </div>
        </div>

        {/* Right: Committee Deliberation & Decision Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Deliberación del Comité de Evaluación
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona la tipificación adecuada según el reglamento
              </p>
            </div>
            <Gavel className="w-5 h-5 text-slate-400" />
          </div>

          {/* Question 1: Tipificación */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              1. ¿Cómo se tipifica la conducta analizada?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeCase.opcionesTipificacion.map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setSelectedTipo(tipo)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    selectedTipo === tipo
                      ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold ring-1 ring-[#39A900]'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Gravedad */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              2. ¿Cuál es la calificación de la gravedad?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeCase.opcionesGravedad.map((grav) => (
                <button
                  key={grav}
                  type="button"
                  onClick={() => setSelectedGravedad(grav)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    selectedGravedad === grav
                      ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold ring-1 ring-[#39A900]'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {grav}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Medida Formativa / Sanción */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              3. ¿Qué medida formativa o sanción corresponde aplicar?
            </label>
            <div className="space-y-2">
              {activeCase.opcionesMedidas.map((medida) => (
                <button
                  key={medida}
                  type="button"
                  onClick={() => setSelectedMedida(medida)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    selectedMedida === medida
                      ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold ring-1 ring-[#39A900]'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {medida}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleEvaluateDecision}
              disabled={!selectedTipo || !selectedGravedad || !selectedMedida}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                selectedTipo && selectedGravedad && selectedMedida
                  ? 'bg-[#39A900] hover:bg-[#2e8800] text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>Emitir Dictamen del Comité</span>
            </button>
          </div>

          {/* Feedback Area */}
          {submissionFeedback && (
            <div
              className={`p-4 rounded-xl border transition-all text-xs ${
                submissionFeedback.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {submissionFeedback.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>¡Dictamen Correcto según el Acuerdo 007!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Dictamen Impreciso · Revisa los fundamentos del reglamento</span>
                  </>
                )}
              </div>
              <p className="mt-1 leading-relaxed">
                {submissionFeedback.details}
              </p>
              <div className="mt-3 pt-2 border-t border-current/20 text-[11px] font-mono flex items-center justify-between">
                <span>Fundamento: {submissionFeedback.article}</span>
                {!submissionFeedback.isCorrect && (
                  <button
                    onClick={() => {
                      setSelectedTipo('');
                      setSelectedGravedad('');
                      setSelectedMedida('');
                      setSubmissionFeedback(null);
                    }}
                    className="underline font-semibold"
                  >
                    Intentar de nuevo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
