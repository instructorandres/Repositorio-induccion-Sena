/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { ApprenticeDashboard } from './components/ApprenticeDashboard';
import { IdentityModule } from './components/IdentityModule';
import { RegulationsModule } from './components/RegulationsModule';
import { CaseSimulator } from './components/CaseSimulator';
import { QuizCenter } from './components/QuizCenter';
import { InstructorPanel } from './components/InstructorPanel';
import { CertificateModal } from './components/CertificateModal';
import { ApprenticeProfile, RoleMode } from './types/induction';
import { INITIAL_APPRENTICE, SAMPLE_APPRENTICES, SENA_BADGES, SENA_LOGO_SVG, SENA_QUIZZES } from './data/senaData';

import { senaAudio } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [roleMode, setRoleMode] = useState<RoleMode>('aprendiz');
  const [apprentice, setApprentice] = useState<ApprenticeProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_active_apprentice');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_APPRENTICE;
  });
  const [apprenticesList, setApprenticesList] = useState<ApprenticeProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_apprentices_list');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return SAMPLE_APPRENTICES;
  });
  const [certificateModalOpen, setCertificateModalOpen] = useState<boolean>(false);
  const [certificateApprentice, setCertificateApprentice] = useState<ApprenticeProfile>(INITIAL_APPRENTICE);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isBlurring, setIsBlurring] = useState<boolean>(false);

  // Sync initial theme class
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dark mode toggle with blur-fade transition
  const handleToggleDarkMode = () => {
    setIsBlurring(true);
    senaAudio.playTone(isDarkMode ? 440 : 620, 0.2, 'sine', 0.12);

    // Halfway through the blur animation, change the theme
    setTimeout(() => {
      setIsDarkMode((prev) => {
        const next = !prev;
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('sena_dark_mode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('sena_dark_mode', 'false');
        }
        return next;
      });
    }, 200);

    // End blur effect smoothly
    setTimeout(() => {
      setIsBlurring(false);
    }, 500);
  };

  // Sync changes to both active apprentice and the apprenticesList
  const syncApprenticeUpdate = (updated: ApprenticeProfile) => {
    setApprentice(updated);
    setApprenticesList((prev) => {
      const idx = prev.findIndex((a) => a.id === updated.id || a.documento === updated.documento);
      let nextList: ApprenticeProfile[];
      if (idx >= 0) {
        nextList = [...prev];
        nextList[idx] = updated;
      } else {
        nextList = [updated, ...prev];
      }
      localStorage.setItem('sena_apprentices_list', JSON.stringify(nextList));
      localStorage.setItem('sena_active_apprentice', JSON.stringify(updated));
      return nextList;
    });
  };

  const handleSelectRole = (selectedRole: RoleMode, selectedApp?: ApprenticeProfile) => {
    setRoleMode(selectedRole);
    if (selectedApp) {
      syncApprenticeUpdate(selectedApp);
    }
    if (selectedRole === 'instructor') {
      setActiveTab('instructor');
    } else {
      setActiveTab('resumen');
    }
  };

  // Handlers for completing modules and quizzes
  const handleCompleteModule = (moduleId: string) => {
    const alreadyDone = apprentice.modulosCompletados.includes(moduleId);
    const nextModules = alreadyDone ? apprentice.modulosCompletados : [...apprentice.modulosCompletados, moduleId];

    // Add appropriate badges
    const nextBadges = [...apprentice.insigniasGanadas];
    if (moduleId === 'identidad' && !nextBadges.includes('badge-identidad')) {
      nextBadges.push('badge-identidad');
    }
    if (moduleId === 'normativa' && !nextBadges.includes('badge-normativa')) {
      nextBadges.push('badge-normativa');
    }
    if (moduleId === 'casos' && !nextBadges.includes('badge-simulador')) {
      nextBadges.push('badge-simulador');
    }

    // Check if all 4 are completed
    const allFour = ['identidad', 'normativa', 'casos', 'evaluaciones'].every((m) =>
      nextModules.includes(m)
    );
    if (allFour && !nextBadges.includes('badge-graduado')) {
      nextBadges.push('badge-graduado');
    }

    const isCompleted = allFour;

    const updated: ApprenticeProfile = {
      ...apprentice,
      modulosCompletados: nextModules,
      horasCompletadas: Math.min(40, apprentice.horasCompletadas + (alreadyDone ? 0 : 4)),
      insigniasGanadas: nextBadges,
      estado: isCompleted ? 'completado' : 'en_progreso',
      certificadoEmitido: isCompleted || apprentice.certificadoEmitido,
    };
    syncApprenticeUpdate(updated);
  };

  const handleRecordQuizScore = (quizId: string, score: number) => {
    const updatedScores = { ...apprentice.quizzesScores, [quizId]: score };
    const nextBadges = [...apprentice.insigniasGanadas];

    if (quizId === 'quiz-identidad' && score >= 80 && !nextBadges.includes('badge-identidad')) {
      nextBadges.push('badge-identidad');
    }
    if (quizId === 'quiz-deberes-derechos' && score >= 80 && !nextBadges.includes('badge-normativa')) {
      nextBadges.push('badge-normativa');
    }
    if (quizId === 'quiz-debido-proceso' && score >= 80 && !nextBadges.includes('badge-debido-proceso')) {
      nextBadges.push('badge-debido-proceso');
    }

    // Check all passed
    const allPassed = SENA_QUIZZES.every((q) => (updatedScores[q.id] || 0) >= q.umbralAprobacion);
    const nextModules = allPassed && !apprentice.modulosCompletados.includes('evaluaciones')
      ? [...apprentice.modulosCompletados, 'evaluaciones']
      : apprentice.modulosCompletados;

    if (allPassed && !nextBadges.includes('badge-graduado') && nextModules.includes('identidad') && nextModules.includes('normativa') && nextModules.includes('casos')) {
      nextBadges.push('badge-graduado');
    }

    const isFinished = nextModules.length >= 4;

    const updated: ApprenticeProfile = {
      ...apprentice,
      quizzesScores: updatedScores,
      modulosCompletados: nextModules,
      horasCompletadas: Math.min(40, apprentice.horasCompletadas + 2),
      insigniasGanadas: nextBadges,
      estado: isFinished ? 'completado' : 'en_progreso',
      certificadoEmitido: isFinished || apprentice.certificadoEmitido,
    };
    syncApprenticeUpdate(updated);
  };

  const handleSolveCase = (caseId: string) => {
    const alreadySolved = apprentice.casosResueltos.includes(caseId);
    const nextCases = alreadySolved ? apprentice.casosResueltos : [...apprentice.casosResueltos, caseId];
    const nextBadges = [...apprentice.insigniasGanadas];

    if (nextCases.length >= 3 && !nextBadges.includes('badge-simulador')) {
      nextBadges.push('badge-simulador');
    }

    const nextModules = nextCases.length >= 3 && !apprentice.modulosCompletados.includes('casos')
      ? [...apprentice.modulosCompletados, 'casos']
      : apprentice.modulosCompletados;

    const updated: ApprenticeProfile = {
      ...apprentice,
      casosResueltos: nextCases,
      modulosCompletados: nextModules,
      insigniasGanadas: nextBadges,
      horasCompletadas: Math.min(40, apprentice.horasCompletadas + (alreadySolved ? 0 : 2)),
    };
    syncApprenticeUpdate(updated);
  };

  const handleOpenCertificate = (customApprentice?: ApprenticeProfile) => {
    setCertificateApprentice(customApprentice || apprentice);
    setCertificateModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-[#39A900] selection:text-white transition-colors duration-300 relative ${
        isBlurring ? 'theme-blur-active' : ''
      }`}
    >
      {/* Full-screen dynamic blur transition layer when toggling themes */}
      {isBlurring && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 pointer-events-none backdrop-blur-xl bg-slate-900/20 dark:bg-black/30 transition-all duration-300"
        />
      )}

      {/* Top Navbar with Dark Mode Toggle in top right corner */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        roleMode={roleMode}
        setRoleMode={setRoleMode}
        apprenticeName={apprentice.nombre}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isBlurring={isBlurring}
        onOpenVideo={() => setIsVideoModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
        {activeTab === 'landing' && (
          <RoleSelectionLanding
            currentApprentice={apprentice}
            onSelectRole={handleSelectRole}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        )}

        {activeTab === 'resumen' && (
          <ApprenticeDashboard
            apprentice={apprentice}
            setActiveTab={setActiveTab}
            onOpenCertificate={() => handleOpenCertificate()}
          />
        )}

        {activeTab === 'identidad' && (
          <IdentityModule
            isCompleted={apprentice.modulosCompletados.includes('identidad')}
            onCompleteModule={() => handleCompleteModule('identidad')}
          />
        )}

        {activeTab === 'normativa' && (
          <RegulationsModule
            isCompleted={apprentice.modulosCompletados.includes('normativa')}
            onCompleteModule={() => handleCompleteModule('normativa')}
          />
        )}

        {activeTab === 'casos' && (
          <CaseSimulator
            resolvedCases={apprentice.casosResueltos}
            onSolveCase={handleSolveCase}
            onCompleteModule={() => handleCompleteModule('casos')}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizCenter
            quizzesScores={apprentice.quizzesScores}
            onRecordQuizScore={handleRecordQuizScore}
            onCompleteModule={() => handleCompleteModule('evaluaciones')}
            onOpenCertificate={() => handleOpenCertificate()}
          />
        )}

        {activeTab === 'instructor' && (
          <InstructorPanel
            currentApprenticeId={apprentice.id}
            onSelectApprentice={(selected) => {
              setApprentice(selected);
              setActiveTab('resumen');
            }}
            onOpenCertificate={(selected) => handleOpenCertificate(selected)}
            apprentices={apprenticesList}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 print:hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shadow-xs shrink-0">
                <img src={SENA_LOGO_SVG} alt="SENA" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Servicio Nacional de Aprendizaje — SENA
              </span>
              <span aria-hidden="true">·</span>
              <span>Dirección de Formación Profesional Integral</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
              <span>Acuerdo 007 de 2012</span>
              <span aria-hidden="true">·</span>
              <span>LMS Zajuna / SofiaPlus</span>
              <span aria-hidden="true">·</span>
              <span>Línea Gratuita Nacional: 01 8000 910 270</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Official Certificate Modal */}
      <CertificateModal
        apprentice={certificateApprentice}
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
      />
    </div>
  );
}
