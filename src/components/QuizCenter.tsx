import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { QuizModule, QuizQuestion } from '../types/induction';
import { SENA_QUIZZES, SENA_LOGO_SVG } from '../data/senaData';
import { senaAudio } from '../utils/audioSynth';

interface QuizCenterProps {
  quizzesScores: Record<string, number>;
  onRecordQuizScore: (quizId: string, score: number) => void;
  onCompleteModule: () => void;
  onOpenCertificate: () => void;
}

export const QuizCenter: React.FC<QuizCenterProps> = ({
  quizzesScores,
  onRecordQuizScore,
  onCompleteModule,
  onOpenCertificate,
}) => {
  const [activeQuizId, setActiveQuizId] = useState<string>(SENA_QUIZZES[0].id);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const activeQuiz = SENA_QUIZZES.find((q) => q.id === activeQuizId) || SENA_QUIZZES[0];
  const currentQuestion: QuizQuestion = activeQuiz.preguntas[currentQuestionIdx];

  const handleStartOrResetQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setHasAnsweredCurrent(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (index: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedAnswer(index);
    setHasAnsweredCurrent(true);

    const isCorrect = index === currentQuestion.respuestaCorrecta;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      senaAudio.playSuccessChime();
    } else {
      senaAudio.playErrorChime();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeQuiz.preguntas.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnsweredCurrent(false);
    } else {
      // Finished
      const finalScore = Math.round((correctCount / activeQuiz.preguntas.length) * 100);
      onRecordQuizScore(activeQuiz.id, finalScore);
      setQuizFinished(true);

      if (finalScore >= activeQuiz.umbralAprobacion) {
        senaAudio.playBadgeUnlock();
      }

      // Check if all quizzes have been approved (or are now approved)
      const updatedScores = { ...quizzesScores, [activeQuiz.id]: finalScore };
      const allPassed = SENA_QUIZZES.every(
        (q) => (updatedScores[q.id] || 0) >= q.umbralAprobacion
      );
      if (allPassed) {
        onCompleteModule();
      }
    }
  };

  const currentScore = quizzesScores[activeQuiz.id];
  const isApproved = currentScore !== undefined && currentScore >= activeQuiz.umbralAprobacion;

  return (
    <div className="space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <img src={SENA_LOGO_SVG} alt="" className="w-4 h-4 object-contain inline-block" />
            <Trophy className="w-4 h-4" />
            <span>MÓDULO 04 · EVALUACIÓN CONTINUA Y RETROALIMENTACIÓN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cuestionarios Interactivos
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Demuestra tu dominio sobre la identidad institucional, los deberes y derechos, y el debido proceso. Se requiere un puntaje mínimo del 80% para certificar la inducción.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Award className="w-4 h-4 text-amber-500" />
          <span>
            {Object.keys(quizzesScores).length} de {SENA_QUIZZES.length} evaluaciones presentadas
          </span>
        </div>
      </div>

      {/* Quiz Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SENA_QUIZZES.map((quiz, idx) => {
          const score = quizzesScores[quiz.id];
          const passed = score !== undefined && score >= quiz.umbralAprobacion;
          const isSelected = activeQuiz.id === quiz.id;

          return (
            <button
              key={quiz.id}
              onClick={() => handleStartOrResetQuiz(quiz.id)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#39A900] bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs ring-1 ring-[#39A900]/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quiz 0{idx + 1}
                  </span>
                  {score !== undefined && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        passed
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {score}% {passed ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {quiz.titulo}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {quiz.descripcion}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{quiz.preguntas.length} preguntas</span>
                <span>Mínimo {quiz.umbralAprobacion}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Quiz Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto transition-colors">
        {!quizFinished ? (
          <div className="space-y-6">
            {/* Header: Progress & Question info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {activeQuiz.titulo}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pregunta {currentQuestionIdx + 1} de {activeQuiz.preguntas.length} · Tema: {currentQuestion.tema}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiempo estimado: {activeQuiz.duracionEstimada}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#39A900] h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentQuestionIdx + 1) / activeQuiz.preguntas.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Text */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQuestion.pregunta}
              </h2>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {currentQuestion.opciones.map((opcion, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.respuestaCorrecta;

                let buttonStyle = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';

                if (hasAnsweredCurrent) {
                  if (isCorrect) {
                    buttonStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    buttonStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-semibold ring-1 ring-rose-500';
                  } else {
                    buttonStyle = 'border-slate-200 dark:border-slate-800 opacity-60 text-slate-500 dark:text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnsweredCurrent}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${buttonStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opcion}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answering */}
            {hasAnsweredCurrent && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                  selectedAnswer === currentQuestion.respuestaCorrecta
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {selectedAnswer === currentQuestion.respuestaCorrecta ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>¡Respuesta Correcta!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Respuesta Incorrecta</span>
                    </>
                  )}
                </div>
                <p>{currentQuestion.explicacion}</p>
              </div>
            )}

            {/* Action to proceed */}
            {hasAnsweredCurrent && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-lg bg-[#39A900] hover:bg-[#2e8800] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  {currentQuestionIdx < activeQuiz.preguntas.length - 1
                    ? 'Siguiente Pregunta →'
                    : 'Finalizar Evaluación'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results View */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resultado de la Evaluación
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {activeQuiz.titulo}
              </h2>
            </div>

            <div className="max-w-xs mx-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-4xl font-extrabold text-[#39A900] font-mono tabular-nums">
                {Math.round((correctCount / activeQuiz.preguntas.length) * 100)}%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {correctCount} de {activeQuiz.preguntas.length} respuestas correctas
              </p>
            </div>

            {Math.round((correctCount / activeQuiz.preguntas.length) * 100) >= activeQuiz.umbralAprobacion ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 max-w-md mx-auto">
                <p className="font-bold text-sm mb-1">¡Felicitaciones! Has aprobado este cuestionario.</p>
                <p className="leading-relaxed">
                  Has demostrado un alto conocimiento del componente normativo e institucional. Tus puntos han sido registrados en tu hoja de inducción.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 max-w-md mx-auto">
                <p className="font-bold text-sm mb-1">Puntaje inferior al 80% requerido</p>
                <p className="leading-relaxed">
                  Te invitamos a repasar los contenidos del módulo y volver a presentar el cuestionario para alcanzar la aprobación.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => handleStartOrResetQuiz(activeQuiz.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Presentar de nuevo</span>
              </button>
              <button
                onClick={onOpenCertificate}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-[#00324D] dark:bg-sky-600 hover:bg-[#002235] dark:hover:bg-sky-500 text-white shadow-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Consultar Certificado Digital</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
