import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Edit3,
  FileCheck2,
  FileSpreadsheet,
  GraduationCap,
  HelpCircle,
  Info,
  Lightbulb,
  RotateCcw,
  Save,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import { ApprenticeProfile, RoleMode } from '../types/induction';
import {
  BLANK_APPRENTICE,
  INSTRUCTOR_INFO,
  SAMPLE_APPRENTICES,
  SAMPLE_FICHAS,
  SENA_CAMPUS_IMAGE,
  SENA_EMBLEM_IMAGE,
  SENA_LOGO_SVG,
} from '../data/senaData';
import { senaAudio } from '../utils/audioSynth';
import { InstructorLoginModal } from './InstructorLoginModal';
import { VideoModal } from './VideoModal';

interface RoleSelectionLandingProps {
  currentApprentice: ApprenticeProfile;
  onSelectRole: (role: RoleMode, selectedApprentice?: ApprenticeProfile) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialMode?: 'select_role' | 'apprentice_identification';
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  currentApprentice,
  onSelectRole,
  isDarkMode,
  onToggleDarkMode,
  initialMode = 'select_role',
}) => {
  const [currentStep, setCurrentStep] = useState<'select_role' | 'apprentice_identification'>(initialMode);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Form State for Apprentice Identification & Progress - Inicia con campos limpios y pistas
  const [formData, setFormData] = useState<ApprenticeProfile>(() => {
    return {
      ...BLANK_APPRENTICE,
      id: `apr-${Date.now()}`,
    };
  });
  const [formValidationMsg, setFormValidationMsg] = useState<string | null>(null);

  // Search filter for apprentice list on landing
  const filteredApprentices = SAMPLE_APPRENTICES.filter((app) => {
    return (
      app.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.documento.includes(searchTerm) ||
      app.fichaNombre.includes(searchTerm)
    );
  });

  // Handler to pick an existing apprentice into the form
  const handleLoadApprentice = (app: ApprenticeProfile) => {
    setFormData({ ...app });
    setCurrentStep('apprentice_identification');
    setFormValidationMsg(null);
  };

  // Handler to start with fresh, clean fields and helpful hints
  const handleStartNewApprentice = () => {
    setFormData({
      ...BLANK_APPRENTICE,
      id: `apr-${Date.now()}`,
    });
    setFormValidationMsg(null);
    setCurrentStep('apprentice_identification');
  };

  // Handler to reset/clear all fields in the current form
  const handleClearForm = () => {
    setFormData({
      ...BLANK_APPRENTICE,
      id: `apr-${Date.now()}`,
    });
    setFormValidationMsg(null);
  };

  // Handler for document lookup
  const handleDocChange = (docNumber: string) => {
    const cleanDoc = docNumber.trim();
    const existing = SAMPLE_APPRENTICES.find((a) => a.documento === cleanDoc);
    if (existing) {
      setFormData({ ...existing, documento: cleanDoc });
    } else {
      setFormData((prev) => ({
        ...prev,
        documento: cleanDoc,
      }));
    }
  };

  // Toggle module completion in the form
  const handleToggleModule = (moduleId: string) => {
    setFormData((prev) => {
      const exists = prev.modulosCompletados.includes(moduleId);
      const updatedModules = exists
        ? prev.modulosCompletados.filter((m) => m !== moduleId)
        : [...prev.modulosCompletados, moduleId];

      // Update badges accordingly
      const nextBadges = [...prev.insigniasGanadas];
      if (updatedModules.includes('identidad') && !nextBadges.includes('badge-identidad')) {
        nextBadges.push('badge-identidad');
      }
      if (updatedModules.includes('normativa') && !nextBadges.includes('badge-normativa')) {
        nextBadges.push('badge-normativa');
      }
      if (updatedModules.includes('casos') && !nextBadges.includes('badge-simulador')) {
        nextBadges.push('badge-simulador');
      }
      if (updatedModules.length >= 4 && !nextBadges.includes('badge-graduado')) {
        nextBadges.push('badge-graduado');
      }

      const allFour = ['identidad', 'normativa', 'casos', 'evaluaciones'].every((m) =>
        updatedModules.includes(m)
      );

      return {
        ...prev,
        modulosCompletados: updatedModules,
        insigniasGanadas: nextBadges,
        estado: allFour && prev.horasCompletadas >= 40 ? 'completado' : prev.horasCompletadas < 20 ? 'rezagado' : 'en_progreso',
        certificadoEmitido: allFour && prev.horasCompletadas >= 40,
      };
    });
  };

  // Save profile and enter the app
  const handleSaveAndProceed = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setFormValidationMsg('Por favor ingresa los nombres y apellidos del aprendiz.');
      return;
    }
    if (!formData.documento.trim()) {
      setFormValidationMsg('Por favor ingresa el número de documento de identificación.');
      return;
    }
    if (!formData.fichaNombre.trim()) {
      setFormValidationMsg('Por favor especifica la ficha de caracterización.');
      return;
    }

    // Determine final status
    const allFour = ['identidad', 'normativa', 'casos', 'evaluaciones'].every((m) =>
      formData.modulosCompletados.includes(m)
    );
    const finalState = allFour && formData.horasCompletadas >= 40
      ? 'completado'
      : formData.horasCompletadas < 20
      ? 'rezagado'
      : 'en_progreso';

    const finalizedProfile: ApprenticeProfile = {
      ...formData,
      nombre: formData.nombre.trim(),
      documento: formData.documento.trim(),
      correo: formData.correo.trim() || `${formData.nombre.toLowerCase().replace(/\s+/g, '.')}@soy.sena.edu.co`,
      estado: finalState,
      certificadoEmitido: finalState === 'completado' || formData.certificadoEmitido,
      fechaCertificado: finalState === 'completado' && !formData.fechaCertificado ? '12 de Febrero de 2026' : formData.fechaCertificado,
      codigoVerificacion: finalState === 'completado' && !formData.codigoVerificacion ? `SENA-IND-2026-${formData.documento.slice(-5)}-${formData.fichaNombre}` : formData.codigoVerificacion,
    };

    senaAudio.playSuccessChime();
    onSelectRole('aprendiz', finalizedProfile);
  };

  return (
    <div className="space-y-10 pb-12">
      <InstructorLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={() => onSelectRole('instructor')}
      />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="/assets/aistudio/2026__5_17_p.m._3a5d7745.mp4"
      />
      {/* ---------------- STEP 1: LANDING & ROLE SELECTION ---------------- */}
      {currentStep === 'select_role' ? (
        <div className="space-y-10">
          {/* Institutional Hero Banner */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#00324D] text-white shadow-xl">
            <div className="absolute inset-0 z-0">
              <img
                src={SENA_CAMPUS_IMAGE}
                alt="Campus SENA"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#00324D] via-[#00324D]/90 to-[#002538]/80" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-5xl">
              {/* Top Identity Row */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <img
                    src={SENA_LOGO_SVG}
                    alt="Logo SENA"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0 border border-amber-500/30">
                  <img
                    src={SENA_EMBLEM_IMAGE}
                    alt="Escudo Institucional SENA"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-emerald-400 uppercase">
                    Servicio Nacional de Aprendizaje — SENA
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Dirección de Formación Profesional Integral · Inducción Institucional
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                Portal de Inducción y Seguimiento Formativo
              </h1>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl mb-8">
                Bienvenido al sistema institucional de inducción del SENA. El acceso se organiza por roles: un <strong>instructor único</strong> encargado de la auditoría y revisión global de los avances, y <strong>múltiples aprendices</strong> que ingresan diligenciando sus datos de interés de identificación y progreso para continuar su formación integral.
              </p>

              {/* Quick Pillar Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-200">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>40 Horas de Inducción Reglamentarias</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Acuerdo 007 de 2012 (Reglamento del Aprendiz)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  <FileCheck2 className="w-4 h-4 text-sky-400" />
                  <span>Certificación Digital con Código Verificable</span>
                </span>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#39A900] text-white hover:bg-[#2e8800] backdrop-blur-xs border border-[#39A900] transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Video de Manual</span>
                </button>
              </div>
            </div>
          </section>

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-[#39A900]" />
              <span>Acceso Institucional por Perfil</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Selecciona tu Rol de Acceso
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Elige el rol con el que deseas ingresar a la plataforma:
            </p>
          </div>

          {/* The 2 Role Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* ROL INSTRUCTOR (INSTRUCTOR ÚNICO SUPERVISOR) */}
            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-400/50 dark:border-sky-500/40 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Rol Docente · Instructor Único</span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    1 Titular Supervisor
                  </span>
                </div>

                {/* Profile Snapshot */}
                <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#00324D] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    CG
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {INSTRUCTOR_INFO.nombre}
                    </div>
                    <div className="text-xs text-sky-700 dark:text-sky-300 font-semibold">
                      {INSTRUCTOR_INFO.cargo}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {INSTRUCTOR_INFO.centro} · {INSTRUCTOR_INFO.regional}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <p className="font-medium leading-relaxed">
                    El <strong>instructor es uno solo</strong> y cuenta con acceso administrativo centralizado para supervisar y auditar la información de todas las fichas:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>Control de las fichas <strong>{INSTRUCTOR_INFO.fichasACargo.join(', ')}</strong> y sus aprendices.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>Monitoreo de horas de inducción acumuladas (meta de 40h) y rezagos formativos.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>Revisión de deliberaciones en el Simulador de Casos y calificaciones de quizzes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>Descarga de reportes consolidados en CSV y emisión de constancias.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#00324D] hover:bg-[#002538] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all group"
                >
                  <span>Ingresar como Instructor Líder Único</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                  Panel de Supervisión, Auditoría y Reportes de Ficha
                </p>
              </div>
            </div>

            {/* ROL APRENDIZ (MÚLTIPLES APRENDICES CON FORMULARIO DE ACCESO) */}
            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400/50 dark:border-emerald-500/40 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <GraduationCap className="w-3.5 h-3.5 text-[#39A900]" />
                    <span>Rol Formativo · Múltiples Aprendices</span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    Acceso Individual
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#39A900]" />
                      <span>Flujo de Acceso del Aprendiz</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      El aprendiz escoge su rol, <strong>diligencia o valida sus datos de interés requeridos (identificación, programa y progreso)</strong>, guarda su perfil y continúa de inmediato con el acceso completo a la aplicación.
                    </p>
                  </div>

                  {/* Quick Select from Registered Apprentices */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                        Aprendices en Formación (Muestra):
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Click para cargar datos
                      </span>
                    </div>

                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, documento o ficha..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#39A900]"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                      {filteredApprentices.slice(0, 5).map((app) => (
                        <div
                          key={app.id}
                          onClick={() => handleLoadApprentice(app)}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-[#39A900] cursor-pointer transition-all flex items-center justify-between text-xs group"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#39A900] transition-colors">
                              {app.nombre}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {app.tipoDocumento} {app.documento} · Ficha {app.fichaNombre}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                            {app.horasCompletadas}/40h →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleStartNewApprentice}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#39A900] hover:bg-[#2e8800] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all group"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Escoger Rol de Aprendiz e Identificarme</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                  Diligencia tus datos de interés y progreso para acceder a tu inducción
                </p>
              </div>
            </div>
          </div>

          {/* 4 Pillars Section */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Estructura de la Inducción Institucional
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Los 4 componentes formativos que completan los aprendices y supervisa el instructor líder:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#39A900] flex items-center justify-center font-bold mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  01. Identidad Institucional
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Escudo oficial, logotipo del aprendiz, himno en sintetizador de audio, bandera y decálogo de valores.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold mb-3">
                  <Scale className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  02. Reglamento del Aprendiz
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Acuerdo 007 de 2012: Deberes, derechos, prohibiciones y las 6 etapas del debido proceso.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  03. Simulador de Casos
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Resolución de expedientes prácticos como Comité de Evaluación para aplicar medidas formativas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  04. Evaluación y Certificado
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Cuestionarios de evaluación continua (80% requerido), registro de 40h y certificación oficial.
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ---------------- STEP 2: FORMULARIO DE IDENTIFICACIÓN Y PROGRESO DEL APRENDIZ ---------------- */
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('select_role')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#39A900] dark:hover:text-[#39A900] transition-colors"
            >
              ← Volver a Selección de Rol
            </button>
            <span className="text-xs font-bold text-[#39A900] bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Paso 2 de 2: Identificación y Progreso
            </span>
          </div>

          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-2 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                  <img src={SENA_LOGO_SVG} alt="SENA" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Ficha de Identificación del Aprendiz y Progreso
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Formulario con campos limpios y pistas de ayuda. Diligencia tus datos para identificarte y acceder a la plataforma.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Clean & Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Restablecer todos los campos a blanco"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Limpiar Campos</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 mr-1">
                    Cargar prueba:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLoadApprentice(SAMPLE_APPRENTICES[0])}
                    className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Julián (32h)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadApprentice(SAMPLE_APPRENTICES[1])}
                    className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Laura (40h)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadApprentice(SAMPLE_APPRENTICES[2])}
                    className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Brayan (14h)
                  </button>
                </div>
              </div>
            </div>

            {/* General Guidance Banner with Hint */}
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2.5 shadow-2xs">
              <Lightbulb className="w-5 h-5 text-[#39A900] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  Guía con pistas para el diligenciamiento
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Todos los campos inician limpios listos para tu registro. Revisa la <strong>pista verde</strong> situada debajo de cada campo para saber qué dato y formato ingresar. Los campos marcados con <strong>(*)</strong> son obligatorios para habilitar el acceso.
                </p>
              </div>
            </div>

            {/* Validation Message */}
            {formValidationMsg && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formValidationMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveAndProceed} className="mt-6 space-y-8">
              {/* SECTION 1: DATOS DE IDENTIFICACIÓN */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#39A900]" />
                  <span>1. Datos de Identificación del Aprendiz</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Tipo de Documento */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Documento *
                    </label>
                    <select
                      value={formData.tipoDocumento}
                      onChange={(e) =>
                        setFormData({ ...formData, tipoDocumento: e.target.value as any })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PPT">Permiso por Protección Temporal (PPT)</option>
                    </select>
                    {/* Pista Tipo Documento */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Selecciona CC si eres mayor de edad, TI si eres menor de 18 años, o CE/PPT según tu documento legal.</span>
                    </div>
                  </div>

                  {/* Número de Documento */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.documento}
                      onChange={(e) => handleDocChange(e.target.value)}
                      placeholder="Escribe tu número de documento..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900] font-mono"
                    />
                    {/* Pista Documento */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Digita solo números sin puntos ni comas (ej. 1023948572). Si ya estás registrado, tus avances se cargarán.</span>
                    </div>
                  </div>

                  {/* Nombres y Apellidos */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombres y Apellidos Completos *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Escribe aquí tus nombres y apellidos..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    />
                    {/* Pista Nombres */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Digita tus nombres y apellidos completos tal como aparecen en tu documento oficial y en SofiaPlus.</span>
                    </div>
                  </div>

                  {/* Correo Institucional */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico / Institucional
                    </label>
                    <input
                      type="email"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      placeholder="ejemplo@soy.sena.edu.co o tu correo..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    />
                    {/* Pista Correo */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Ingresa tu correo @soy.sena.edu.co o correo personal donde recibirás avisos y tu certificado de inducción.</span>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono Celular de Contacto
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="Ej. 312 458 9201"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    />
                    {/* Pista Teléfono */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Número celular de 10 dígitos para comunicación con el instructor y Bienestar al Aprendiz.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATOS FORMATIVOS Y FICHA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>2. Información de la Ficha y Formación</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Ficha de Caracterización */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ficha de Caracterización *
                    </label>
                    <select
                      value={formData.fichaNombre}
                      onChange={(e) => {
                        const fichaNum = e.target.value;
                        const matchFicha = SAMPLE_FICHAS.find((f) => f.numero === fichaNum);
                        setFormData({
                          ...formData,
                          fichaNombre: fichaNum,
                          fichaId: matchFicha ? matchFicha.id : `ficha-${fichaNum}`,
                          programaFormacion: matchFicha ? matchFicha.programa : formData.programaFormacion,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900] font-mono font-bold"
                    >
                      {SAMPLE_FICHAS.map((f) => (
                        <option key={f.id} value={f.numero}>
                          Ficha {f.numero} — {f.programa}
                        </option>
                      ))}
                    </select>
                    {/* Pista Ficha */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 text-[11px] text-sky-800 dark:text-sky-300">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Código numérico de 7 dígitos de tu ficha en SofiaPlus / Zajuna. Al seleccionarla se sincroniza tu programa.</span>
                    </div>
                  </div>

                  {/* Programa de Formación */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Programa de Formación *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.programaFormacion}
                      onChange={(e) =>
                        setFormData({ ...formData, programaFormacion: e.target.value })
                      }
                      placeholder="Escribe el nombre del programa formativo..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    />
                    {/* Pista Programa */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 text-[11px] text-sky-800 dark:text-sky-300">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Denominación oficial del programa en el que te encuentras matriculado (ej. Análisis y Desarrollo de Software - ADSO).</span>
                    </div>
                  </div>

                  {/* Nivel */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nivel de Formación
                    </label>
                    <select
                      value={formData.nivel}
                      onChange={(e) => setFormData({ ...formData, nivel: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    >
                      <option value="Tecnólogo">Tecnólogo</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Operario">Operario</option>
                    </select>
                    {/* Pista Nivel */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 text-[11px] text-sky-800 dark:text-sky-300">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Modalidad académica y nivel de certificación del programa.</span>
                    </div>
                  </div>

                  {/* Regional */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Regional SENA
                    </label>
                    <input
                      type="text"
                      value={formData.regional}
                      onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                      placeholder="Ej. Regional Distrito Capital"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    />
                    {/* Pista Regional */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 text-[11px] text-sky-800 dark:text-sky-300">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Regional geográfica del SENA donde realizas tu proceso formativo.</span>
                    </div>
                  </div>

                  {/* Centro de Formación */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Centro de Formación
                    </label>
                    <input
                      type="text"
                      value={formData.centroFormacion}
                      onChange={(e) =>
                        setFormData({ ...formData, centroFormacion: e.target.value })
                      }
                      placeholder="Ej. Centro de Electricidad, Electrónica y Telecomunicaciones"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#39A900]"
                    />
                    {/* Pista Centro */}
                    <div className="flex items-start gap-1.5 mt-1.5 p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 text-[11px] text-sky-800 dark:text-sky-300">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span><strong>Pista:</strong> Sede o centro formador del SENA al que está adscrita tu ficha.</span>
                    </div>
                  </div>

                  {/* Instructor Líder */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <div className="p-3 bg-sky-50 dark:bg-sky-950/30 rounded-lg border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-medium">
                        <UserCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>
                          Instructor Líder de Inducción Asignado: <strong>{INSTRUCTOR_INFO.nombre}</strong> (Instructor Único)
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-400">
                        CEET · Distrito Capital
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ESTADO Y PROGRESO EN LA INDUCCIÓN */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>3. Registro de Progreso en la Inducción (Meta: 40 horas)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#39A900]">
                    {formData.horasCompletadas} / 40 horas ({Math.round((formData.horasCompletadas / 40) * 100)}%)
                  </span>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  {/* Horas Slider / Number */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5">
                      <span>Horas Formativas de Inducción Acumuladas:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formData.horasCompletadas} horas
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      step={2}
                      value={formData.horasCompletadas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horasCompletadas: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#39A900]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0h (Inicio de Inducción)</span>
                      <span>20h (Mitad)</span>
                      <span>40h (Completado)</span>
                    </div>

                    {/* Pista Horas */}
                    <div className="flex items-start gap-1.5 mt-2.5 p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                      <span><strong>Pista de Horas:</strong> La meta total de inducción SENA es de 40 horas. Si estás iniciando hoy tu proceso, <strong>mantén el control en 0 horas</strong>; tus horas se irán sumando automáticamente conforme realices las actividades dentro de la app. Si tu instructor te indicó horas previas convalidadas, ajusta el selector.</span>
                    </div>
                  </div>

                  {/* Modules Checkboxes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Módulos Formatívos Desarrollados / Aprobados:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-white dark:bg-slate-850 cursor-pointer border-slate-200 dark:border-slate-700 hover:border-[#39A900]">
                        <input
                          type="checkbox"
                          checked={formData.modulosCompletados.includes('identidad')}
                          onChange={() => handleToggleModule('identidad')}
                          className="rounded text-[#39A900] focus:ring-[#39A900]"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Módulo 01: Identidad y Símbolos SENA
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-white dark:bg-slate-850 cursor-pointer border-slate-200 dark:border-slate-700 hover:border-[#39A900]">
                        <input
                          type="checkbox"
                          checked={formData.modulosCompletados.includes('normativa')}
                          onChange={() => handleToggleModule('normativa')}
                          className="rounded text-[#39A900] focus:ring-[#39A900]"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Módulo 02: Reglamento del Aprendiz (Acuerdo 007)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-white dark:bg-slate-850 cursor-pointer border-slate-200 dark:border-slate-700 hover:border-[#39A900]">
                        <input
                          type="checkbox"
                          checked={formData.modulosCompletados.includes('casos')}
                          onChange={() => handleToggleModule('casos')}
                          className="rounded text-[#39A900] focus:ring-[#39A900]"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Módulo 03: Simulador de Casos Prácticos
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-white dark:bg-slate-850 cursor-pointer border-slate-200 dark:border-slate-700 hover:border-[#39A900]">
                        <input
                          type="checkbox"
                          checked={formData.modulosCompletados.includes('evaluaciones')}
                          onChange={() => handleToggleModule('evaluaciones')}
                          className="rounded text-[#39A900] focus:ring-[#39A900]"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Módulo 04: Cuestionarios Evaluativos
                        </span>
                      </label>
                    </div>

                    {/* Pista Módulos */}
                    <div className="flex items-start gap-1.5 mt-2.5 p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Lightbulb className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                      <span><strong>Pista de Módulos:</strong> Si ingresas por primera vez, <strong>deja todas las casillas desmarcadas</strong>. Cada módulo se marcará como completado cuando lo desarrolles dentro de la aplicación.</span>
                    </div>
                  </div>

                  {/* Dynamic Status Preview Banner */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">
                      Estado proyectado del aprendiz:
                    </span>
                    {formData.horasCompletadas >= 40 && formData.modulosCompletados.length >= 4 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Inducción Completada (Certificado Apto)
                      </span>
                    ) : formData.horasCompletadas >= 20 ? (
                      <span className="text-sky-700 dark:text-sky-400 font-bold flex items-center gap-1">
                        <Clock className="w-4 h-4" /> En Progreso Activo
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Estado Inicial / Alerta de Rezago (&lt; 20 horas)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('select_role')}
                    className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    ← Cambiar Rol
                  </button>
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Limpiar Todo</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#39A900] hover:bg-[#2e8800] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all group"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Perfil del Aprendiz y Continuar a la App</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
