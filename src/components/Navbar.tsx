import React from 'react';
import { Award, BookOpen, GraduationCap, Scale, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { RoleMode } from '../types/induction';
import { SENA_LOGO_SVG } from '../data/senaData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  roleMode: RoleMode;
  setRoleMode: (mode: RoleMode) => void;
  apprenticeName: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isBlurring: boolean;
  onOpenVideo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  roleMode,
  setRoleMode,
  apprenticeName,
  isDarkMode,
  onToggleDarkMode,
  isBlurring,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
            title="Ir al Portal de Inicio y Selección de Rol"
          >
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shadow-xs group-hover:border-[#39A900] transition-colors shrink-0">
              <img
                src={SENA_LOGO_SVG}
                alt="Logo SENA"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#39A900] dark:group-hover:text-[#39A900] transition-colors whitespace-nowrap">
                SENA Inducción
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                Formación Profesional Integral
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-1.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                activeTab === 'landing'
                  ? 'text-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Inicio / Roles
            </button>
            <button
              onClick={() => setActiveTab('resumen')}
              className={`px-1.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                activeTab === 'resumen'
                  ? 'text-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Mi Inducción
            </button>
            <button
              onClick={() => setActiveTab('identidad')}
              className={`px-1.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                activeTab === 'identidad'
                  ? 'text-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Identidad
            </button>
            <button
              onClick={() => setActiveTab('normativa')}
              className={`px-1.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                activeTab === 'normativa'
                  ? 'text-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Normas
            </button>
            <button
              onClick={() => setActiveTab('casos')}
              className={`px-1.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                activeTab === 'casos'
                  ? 'text-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Casos
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-1.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                activeTab === 'quizzes'
                  ? 'text-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Evaluaciones
            </button>
            {roleMode === 'instructor' && (
              <button
                onClick={() => setActiveTab('instructor')}
                className={`px-1.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                  activeTab === 'instructor'
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Seguimiento
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action area (Modo de rol + Botón de Modo Oscuro en esquina superior derecha) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dark Mode Toggle Button (Esquina Superior Derecha) */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              disabled={isBlurring}
              aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 transition-colors whitespace-nowrap shadow-xs focus:outline-none"
            >
              <span>
                {isDarkMode ? '☀️' : '🌙'}
              </span>
              <span className="hidden sm:inline">
                {isDarkMode ? 'Claro' : 'Oscuro'}
              </span>
            </button>

            {/* Role Switcher */}
            <button
              onClick={() => {
                const nextMode = roleMode === 'aprendiz' ? 'instructor' : 'aprendiz';
                setRoleMode(nextMode);
                if (nextMode === 'instructor') {
                  setActiveTab('instructor');
                } else if (activeTab === 'instructor') {
                  setActiveTab('resumen');
                }
              }}
              className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shadow-xs"
              title="Alternar entre la vista del aprendiz y el panel del instructor líder"
            >
              {roleMode === 'aprendiz' ? (
                <>
                  <Users className="w-3 h-3 text-[#39A900]" />
                  <span className="hidden sm:inline">Aprendiz</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3 h-3 text-sky-500" />
                  <span className="hidden sm:inline">Instructor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav links strip */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'landing'
                ? 'bg-[#39A900] text-white font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Inicio / Roles
          </button>
          <button
            onClick={() => setActiveTab('resumen')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'resumen'
                ? 'bg-[#39A900] text-white font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mi Inducción
          </button>
          <button
            onClick={() => setActiveTab('identidad')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'identidad'
                ? 'bg-[#39A900] text-white font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Identidad
          </button>
          <button
            onClick={() => setActiveTab('normativa')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'normativa'
                ? 'bg-[#39A900] text-white font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reglamento
          </button>
          <button
            onClick={() => setActiveTab('casos')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'casos'
                ? 'bg-[#39A900] text-white font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Casos
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'quizzes'
                ? 'bg-[#39A900] text-white font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Evaluaciones
          </button>
          {roleMode === 'instructor' && (
            <button
              onClick={() => setActiveTab('instructor')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'instructor'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Seguimiento
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
