import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  History,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  SENA_EMBLEM_IMAGE,
  SENA_LOGO_SVG,
  SENA_SYMBOLS,
  SENA_TIMELINE,
  SENA_VALUES,
} from '../data/senaData';
import { senaAudio } from '../utils/audioSynth';

interface IdentityModuleProps {
  isCompleted: boolean;
  onCompleteModule: () => void;
}

export const IdentityModule: React.FC<IdentityModuleProps> = ({
  isCompleted,
  onCompleteModule,
}) => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('escudo');
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);
  const [activeVerse, setActiveVerse] = useState<number>(0);
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'simbolos' | 'himno' | 'historia' | 'valores'>('simbolos');

  useEffect(() => {
    return () => {
      senaAudio.stopAnthem();
    };
  }, []);

  const handleToggleAnthem = () => {
    if (isPlayingAnthem) {
      senaAudio.stopAnthem();
      setIsPlayingAnthem(false);
      setActiveVerse(0);
    } else {
      setIsPlayingAnthem(true);
      senaAudio.startAnthem((verseIndex) => {
        setActiveVerse(verseIndex);
        if (!senaAudio.isAnthemPlaying()) {
          setIsPlayingAnthem(false);
        }
      });
    }
  };

  const selectedSymbol = SENA_SYMBOLS.find((s) => s.id === selectedSymbolId) || SENA_SYMBOLS[0];

  return (
    <div className="space-y-8">
      {/* Header & Sub-navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>MÓDULO 01 · FORMACIÓN INSTITUCIONAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Identidad y Símbolos del SENA
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Apropia los valores, el himno, el escudo, la bandera y el legado histórico de Rodolfo Martínez Tono como pilar de tu formación integral.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
              <span>Módulo Completado</span>
            </span>
          ) : (
            <button
              onClick={() => {
                senaAudio.playBadgeUnlock();
                onCompleteModule();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#39A900] hover:bg-[#2e8800] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Marcar como Aprendido</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-xl transition-colors">
        <button
          onClick={() => setActiveTab('simbolos')}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
            activeTab === 'simbolos'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Símbolos Oficiales
        </button>
        <button
          onClick={() => setActiveTab('himno')}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
            activeTab === 'himno'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Himno Institucional
        </button>
        <button
          onClick={() => setActiveTab('historia')}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
            activeTab === 'historia'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Historia & Hitos
        </button>
        <button
          onClick={() => setActiveTab('valores')}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
            activeTab === 'valores'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Valores & Principios
        </button>
      </div>

      {/* TAB 1: SÍMBOLOS OFICIALES */}
      {activeTab === 'simbolos' && (
        <div className="space-y-6">
          {/* Symbol Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SENA_SYMBOLS.map((sym) => (
              <button
                key={sym.id}
                onClick={() => setSelectedSymbolId(sym.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedSymbolId === sym.id
                    ? 'border-[#39A900] bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Símbolo
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {sym.nombre}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive Symbol Canvas & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
            {/* Visual Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-linear-to-b from-slate-50 to-emerald-50/40 dark:from-slate-950 dark:to-emerald-950/20 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              {selectedSymbol.id === 'escudo' && (
                <div className="relative">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-500/30 bg-white dark:bg-slate-800 p-4 flex items-center justify-center">
                    <img
                      src={SENA_EMBLEM_IMAGE}
                      alt="Escudo Institucional SENA"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Escudo Heráldico de los Tres Sectores
                  </div>
                </div>
              )}

              {selectedSymbol.id === 'bandera' && (
                <div className="w-full max-w-xs">
                  <div className="h-44 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-300 dark:border-slate-700 shadow-md relative flex items-center justify-center overflow-hidden">
                    {/* Mast strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-slate-300 dark:bg-slate-600" />
                    {/* Emblem in center */}
                    <div className="w-20 h-20 rounded-full border border-amber-400/40 overflow-hidden shadow-xs bg-white dark:bg-slate-800 p-1 flex items-center justify-center">
                      <img
                        src={SENA_EMBLEM_IMAGE}
                        alt="Escudo Central"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Bandera Oficial: Fondo Blanco Puro y Escudo Centrado
                  </p>
                </div>
              )}

              {selectedSymbol.id === 'logosimbolo' && (
                <div className="w-full max-w-xs flex flex-col items-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-md border-2 border-emerald-500/30 flex items-center justify-center relative">
                    <img
                      src={SENA_LOGO_SVG}
                      alt="Logotipo Oficial SENA"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Logotipo y Símbolo Oficial del Aprendiz SENA
                  </p>
                </div>
              )}

              {selectedSymbol.id === 'himno' && (
                <div className="w-full max-w-xs flex flex-col items-center">
                  <div className="w-44 h-44 rounded-2xl bg-[#00324D] text-white flex flex-col items-center justify-center p-4 shadow-md">
                    <Music2 className="w-16 h-16 text-emerald-400 mb-2" />
                    <span className="text-xs uppercase tracking-widest text-slate-300">
                      Canto de Honor
                    </span>
                    <span className="text-sm font-bold text-white mt-1">
                      Marcha Solemne
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Letra: Luis A. Sánchez · Música: Daniel Marlez
                  </p>
                </div>
              )}
            </div>

            {/* Explanation Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  Significado Pedagógico
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-2">
                  {selectedSymbol.nombre}
                </h2>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {selectedSymbol.descripcionDetallada}
                </p>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Elementos y Simbología Clave
                </h3>

                <div className="space-y-3">
                  {selectedSymbol.elementos.map((elem, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs"
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">
                        {elem.nombre}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {elem.descripcion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSymbol.id === 'himno' && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setActiveTab('himno')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#39A900] hover:text-[#2e8800]"
                  >
                    <span>Abrir reproductor y letra interactiva del Himno</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HIMNO INSTITUCIONAL INTERACTIVO */}
      {activeTab === 'himno' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-linear-to-r from-[#00324D] to-[#004e75] text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Music2 className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Himno Oficial del SENA</h3>
                <p className="text-xs text-slate-200">
                  Marcha triunfal institucional sintetizada con Web Audio API en tiempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAnthem}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  isPlayingAnthem
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-900'
                    : 'bg-[#39A900] hover:bg-[#2e8800] text-white'
                }`}
              >
                {isPlayingAnthem ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar Himno</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Reproducir Himno</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lyrics with Real-time Verse Highlighting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coro */}
            <div
              className={`p-6 rounded-xl border transition-all ${
                isPlayingAnthem && activeVerse === 0
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-[#39A900]/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  CORO (Himno SENA)
                </span>
                {isPlayingAnthem && activeVerse === 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#39A900] animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" /> Sonando ahora
                  </span>
                )}
              </div>
              <p className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-loose">
                Estudiantes del SENA adelante,<br />
                por Colombia luchad con amor,<br />
                con el ánimo noble y constante,<br />
                sembraremos la paz y el honor.
              </p>
            </div>

            {/* Estrofa I */}
            <div
              className={`p-6 rounded-xl border transition-all ${
                isPlayingAnthem && activeVerse === 1
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-[#39A900]/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  ESTROFA I
                </span>
                {isPlayingAnthem && activeVerse === 1 && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#39A900] animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" /> Sonando ahora
                  </span>
                )}
              </div>
              <p className="text-sm font-serif text-slate-800 dark:text-slate-200 leading-loose">
                En la forja del SENA se aprende,<br />
                en las aulas de ciencia y lealtad,<br />
                a labrar el futuro más noble,<br />
                de una patria que pide la paz.
              </p>
            </div>

            {/* Estrofa II */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-3">
                ESTROFA II
              </span>
              <p className="text-sm font-serif text-slate-800 dark:text-slate-200 leading-loose">
                Hoy la patria nos llama al trabajo,<br />
                al esfuerzo creador y tenaz,<br />
                en la fábrica, el campo y la ciencia,<br />
                nuestro esfuerzo es simiente de paz.
              </p>
            </div>

            {/* Estrofa III */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-3">
                ESTROFA III
              </span>
              <p className="text-sm font-serif text-slate-800 dark:text-slate-200 leading-loose">
                Adelante con fe en el mañana,<br />
                colombianos de noble existir,<br />
                en el SENA se forja la llama,<br />
                de un grandioso y mejor porvenir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORIA & HITOS */}
      {activeTab === 'historia' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-400">
                Fundador Histórico del SENA
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Dr. Rodolfo Martínez Tono (1927 — 2015)
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 max-w-xl">
                Economista y jurista cartagenero. Concibió el SENA en su tesis de grado para brindar formación profesional integral gratuita a los trabajadores colombianos.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-emerald-900 dark:text-emerald-300 whitespace-nowrap shadow-xs">
              Decreto 118 de 1957
            </div>
          </div>

          {/* Interactive Timeline */}
          <div className="relative border-l-2 border-emerald-200 dark:border-emerald-800 ml-4 pl-6 space-y-8 my-6">
            {SENA_TIMELINE.map((event, idx) => (
              <div
                key={event.year}
                onClick={() => setActiveTimelineIdx(idx)}
                className={`cursor-pointer transition-all ${
                  activeTimelineIdx === idx ? 'scale-[1.01]' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {/* Timeline node */}
                <div
                  className={`absolute -left-[31px] w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                    activeTimelineIdx === idx
                      ? 'bg-[#39A900] border-white dark:border-slate-900 ring-4 ring-emerald-100 dark:ring-emerald-900/50'
                      : 'bg-white dark:bg-slate-900 border-emerald-400'
                  }`}
                />

                <div
                  className={`p-4 rounded-xl border transition-colors ${
                    activeTimelineIdx === idx
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-[#39A900] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-extrabold text-[#39A900] font-mono tabular-nums">
                      {event.year}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {event.hito}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {event.titulo}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {event.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VALORES & PRINCIPIOS */}
      {activeTab === 'valores' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SENA_VALUES.map((val) => (
              <div
                key={val.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Valor SENA
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2 mb-1">
                    {val.nombre}
                  </h3>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 mb-3">
                    "{val.lema}"
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    {val.descripcion}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white block text-[11px] mb-1">
                    En tu rol de aprendiz:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {val.aplicacionAprendiz}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
