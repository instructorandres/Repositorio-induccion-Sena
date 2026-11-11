import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Play,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { ApprenticeProfile } from '../types/induction';
import {
  SENA_CAMPUS_IMAGE,
  SENA_EMBLEM_IMAGE,
  SENA_LOGO_SVG,
  SENA_BADGES,
} from '../data/senaData';

interface ApprenticeDashboardProps {
  apprentice: ApprenticeProfile;
  setActiveTab: (tab: string) => void;
  onOpenCertificate: () => void;
}

export const ApprenticeDashboard: React.FC<ApprenticeDashboardProps> = ({
  apprentice,
  setActiveTab,
  onOpenCertificate,
}) => {
  // Calculate completion percentage
  const totalSteps = 4; // Identidad, Normativa, Casos, Evaluaciones
  const completedCount = apprentice.modulosCompletados.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalSteps) * 100));

  const isEligibleForCertificate = apprentice.modulosCompletados.includes('identidad') &&
    apprentice.modulosCompletados.includes('normativa') &&
    apprentice.modulosCompletados.includes('casos') &&
    apprentice.modulosCompletados.includes('evaluaciones');

  return (
    <div className="space-y-8">
      {/* Hero Banner with Campus Visual & Key Apprentice Info */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm text-white">
        {/* Visual Background with measured contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={SENA_CAMPUS_IMAGE}
            alt="Campus SENA"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#00324D]/95 via-[#00324D]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-4xl">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-[54px] h-[54px] rounded-xl bg-white/95 dark:bg-white p-1.5 shadow-sm flex items-center justify-center shrink-0">
              <img src={SENA_LOGO_SVG} alt="Logo SENA" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-medium">
              <span>SENA {apprentice.regional}</span>
              <span aria-hidden="true">·</span>
              <span>{apprentice.centroFormacion}</span>
              <span aria-hidden="true">·</span>
              <span>Ficha {apprentice.fichaNombre}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 text-balance">
            Bienvenido a tu Inducción SENA, {apprentice.nombre.split(' ')[0]}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mb-6">
            Inicia tu ruta de formación profesional integral. Aquí apropiarás los valores, los símbolos institucionales, el Reglamento del Aprendiz y certificarás tu proceso de inducción.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('identidad')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#39A900] hover:bg-[#2f8c00] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Identidad Institucional</span>
            </button>
            <button
              onClick={() => setActiveTab('normativa')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/20 transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Consultar Reglamento</span>
            </button>
            {isEligibleForCertificate ? (
              <button
                onClick={onOpenCertificate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Ver Mi Certificado Digital</span>
              </button>
            ) : null}
            <button
              onClick={() => setActiveTab('landing')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/20 transition-colors whitespace-nowrap"
              title="Ver o editar datos de interés de identificación y progreso"
            >
              <UserCheck className="w-4 h-4" />
              <span>Mis Datos de Interés / Cambiar Rol</span>
            </button>
          </div>
        </div>

        {/* Bottom bar summary */}
        <div className="relative z-10 px-6 sm:px-8 py-3 bg-black/40 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Progreso de Inducción: <strong>{apprentice.horasCompletadas} de {apprentice.horasTotales} horas</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Instructor Líder: <strong className="text-white">{apprentice.instructorLider}</strong></span>
          </div>
        </div>
      </div>

      {/* Overview Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Porcentaje Global */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Avance General</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{completedCount} de {totalSteps} fases</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {progressPercent}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-[#39A900] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: Horas Formativas */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Jornada de Inducción</span>
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-[#00324D] dark:text-sky-400 tabular-nums">
            {apprentice.horasCompletadas}h
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Meta curricular: 40 horas cronometradas
          </p>
        </div>

        {/* Card 3: Evaluaciones Aprobadas */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Quizzes de Conocimiento</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {Object.keys(apprentice.quizzesScores).length} / 3
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Promedio actual: <strong className="text-slate-800 dark:text-slate-200">{
              Object.values(apprentice.quizzesScores).length > 0
                ? Math.round(Object.values(apprentice.quizzesScores).reduce((a, b) => a + b, 0) / Object.values(apprentice.quizzesScores).length)
                : 0
            }%</strong>
          </p>
        </div>

        {/* Card 4: Insignias Ganadas */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Insignias Institucionales</span>
            <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
            {apprentice.insigniasGanadas.length} / {SENA_BADGES.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Reconocimientos a tu esfuerzo formativo
          </p>
        </div>
      </div>

      {/* Interactive Induction Learning Pathway */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ruta Pedagógica de Inducción
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completa cada estación interactiva para desbloquear tu certificado institucional
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Station 1: Identidad y Símbolos */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                  <img src={SENA_LOGO_SVG} alt="" className="w-3.5 h-3.5 object-contain" />
                  Módulo 01
                </span>
                {apprentice.modulosCompletados.includes('identidad') ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Completado
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">Pendiente</span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Identidad y Símbolos SENA
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Historia, fundadores (Rodolfo Martínez Tono), escudo, bandera, logotipo interactivo, decálogo de valores y reproductor del himno.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('identidad')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-emerald-700 text-white hover:bg-slate-800 dark:hover:bg-emerald-600 transition-colors text-center"
            >
              {apprentice.modulosCompletados.includes('identidad') ? 'Repasar Módulo' : 'Comenzar Módulo'}
            </button>
          </div>

          {/* Station 2: Reglamento y Normativa */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                  Módulo 02
                </span>
                {apprentice.modulosCompletados.includes('normativa') ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Completado
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">Pendiente</span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Reglamento del Aprendiz
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Acuerdo 007 de 2012: Matriz interactiva de derechos, deberes del aprendiz, prohibiciones y el debido proceso de comités.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('normativa')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-emerald-700 text-white hover:bg-slate-800 dark:hover:bg-emerald-600 transition-colors text-center"
            >
              {apprentice.modulosCompletados.includes('normativa') ? 'Repasar Normas' : 'Estudiar Normativa'}
            </button>
          </div>

          {/* Station 3: Simulador de Casos */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                  Módulo 03
                </span>
                {apprentice.modulosCompletados.includes('casos') ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Completado
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">En curso</span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Simulador de Casos Reales
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Asume el rol de instructor o comité: clasifica faltas académicas vs disciplinarias y determina la medida formativa adecuada.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('casos')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#39A900] text-white hover:bg-[#2e8800] transition-colors text-center"
            >
              {apprentice.modulosCompletados.includes('casos') ? 'Revisar Casos' : 'Resolver Casos'}
            </button>
          </div>

          {/* Station 4: Evaluaciones y Quizzes */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                  Módulo 04
                </span>
                {apprentice.modulosCompletados.includes('evaluaciones') ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Completado
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">Por presentar</span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Evaluaciones & Certificado
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                3 cuestionarios dinámicos con retroalimentación instantánea y emisión del certificado oficial digital de inducción.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('quizzes')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-emerald-700 text-white hover:bg-slate-800 dark:hover:bg-emerald-600 transition-colors text-center"
            >
              Presentar Quizzes
            </button>
          </div>
        </div>
      </div>

      {/* Badges and Certificate Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Badges Showcase (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Insignias Institucionales Obtenidas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reconocimientos oficiales a tu avance en la inducción
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              {apprentice.insigniasGanadas.length} de {SENA_BADGES.length} activas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SENA_BADGES.map((badge) => {
              const isEarned = apprentice.insigniasGanadas.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isEarned
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isEarned
                          ? 'bg-[#39A900] text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {badge.nombre}
                        {isEarned && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                        {badge.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Certificate Status Card (1 col) */}
        <div className="p-6 rounded-xl bg-linear-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Certificado Digital de Inducción
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Documento con código único de verificación institucional para validar ante coordinación académica y bienestar.
            </p>

            {isEligibleForCertificate ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                <span>Requisitos 100% completados. Tu certificado está disponible para descarga.</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 mb-4">
                <p className="font-semibold mb-1">Requisitos pendientes:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {!apprentice.modulosCompletados.includes('identidad') && <li>Completar Módulo de Identidad</li>}
                  {!apprentice.modulosCompletados.includes('normativa') && <li>Revisar Reglamento del Aprendiz</li>}
                  {!apprentice.modulosCompletados.includes('casos') && <li>Resolver los 3 casos en el Simulador</li>}
                  {!apprentice.modulosCompletados.includes('evaluaciones') && <li>Aprobar los 3 Quizzes de Evaluación</li>}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={onOpenCertificate}
            className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
              isEligibleForCertificate
                ? 'bg-[#00324D] dark:bg-sky-600 hover:bg-[#002235] dark:hover:bg-sky-500 text-white shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isEligibleForCertificate ? 'Ver Certificado Oficial' : 'Vista Previa de Certificado'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
