import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Filter,
  GraduationCap,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { SENA_REGULATIONS, SENA_LOGO_SVG } from '../data/senaData';
import { senaAudio } from '../utils/audioSynth';

interface RegulationsModuleProps {
  isCompleted: boolean;
  onCompleteModule: () => void;
}

export const RegulationsModule: React.FC<RegulationsModuleProps> = ({
  isCompleted,
  onCompleteModule,
}) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'derecho' | 'deber' | 'prohibicion'>('todos');
  const [activeAmbito, setActiveAmbito] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'matriz' | 'faltas' | 'debido-proceso'>('matriz');

  const filteredRegulations = SENA_REGULATIONS.filter((item) => {
    const matchesCategory = activeCategory === 'todos' || item.categoria === activeCategory;
    const matchesAmbito = activeAmbito === 'todos' || item.ambito === activeAmbito;
    const matchesSearch =
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.articulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clave.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesAmbito && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Module Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <img src={SENA_LOGO_SVG} alt="" className="w-4 h-4 object-contain inline-block" />
            <BookOpen className="w-4 h-4" />
            <span>MÓDULO 02 · MARCO JURÍDICO Y CONVIVENCIA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reglamento del Aprendiz SENA
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Acuerdo 009 de 2024 y actualizaciones (Acuerdo 002 de 2026): Conoce tus derechos, deberes, prohibiciones y las garantías constitucionales del debido proceso.
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
              <span>Marcar como Estudiado</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-xl transition-colors">
        <button
          onClick={() => setActiveSubTab('matriz')}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
            activeSubTab === 'matriz'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Matriz de Normas (Derechos / Deberes)
        </button>
        <button
          onClick={() => setActiveSubTab('faltas')}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
            activeSubTab === 'faltas'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Faltas y Sanciones
        </button>
        <button
          onClick={() => setActiveSubTab('debido-proceso')}
          className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
            activeSubTab === 'debido-proceso'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          El Debido Proceso & Comité
        </button>
      </div>

      {/* SUBTAB 1: MATRIZ DE NORMAS */}
      {activeSubTab === 'matriz' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por artículo, derecho, deber, carné, inasistencia..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#39A900] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Scope filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={activeAmbito}
                  onChange={(e) => setActiveAmbito(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#39A900] text-slate-800 dark:text-slate-200"
                >
                  <option value="todos">Todos los ámbitos</option>
                  <option value="academico">Ámbito Académico</option>
                  <option value="disciplinario">Ámbito Disciplinario</option>
                  <option value="convivencia">Convivencia y Diálogo</option>
                  <option value="bienestar">Bienestar al Aprendiz</option>
                </select>
              </div>
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Categoría:</span>
              <button
                onClick={() => setActiveCategory('todos')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'todos'
                    ? 'bg-slate-900 dark:bg-emerald-700 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Todas ({SENA_REGULATIONS.length})
              </button>
              <button
                onClick={() => setActiveCategory('derecho')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'derecho'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Derechos (Art. 7)
              </button>
              <button
                onClick={() => setActiveCategory('deber')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'deber'
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Deberes (Art. 9)
              </button>
              <button
                onClick={() => setActiveCategory('prohibicion')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCategory === 'prohibicion'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Prohibiciones (Art. 10)
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRegulations.map((item) => {
              const isDerecho = item.categoria === 'derecho';
              const isDeber = item.categoria === 'deber';
              const isProhibicion = item.categoria === 'prohibicion';

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">
                        {item.articulo}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isDerecho
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : isDeber
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {isDerecho ? 'Derecho' : isDeber ? 'Deber' : 'Prohibición'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {item.descripcion}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="capitalize">{item.ambito}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.clave}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRegulations.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">No se encontraron artículos con esos criterios de búsqueda.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('todos');
                  setActiveAmbito('todos');
                }}
                className="mt-3 text-xs font-semibold text-[#39A900] hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: FALTAS Y SANCIONES */}
      {activeSubTab === 'faltas' && (
        <div className="space-y-6">
          {/* Classification Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Faltas Académicas
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Están directamente relacionadas con el compromiso del aprendiz frente a la apropiación y transferencia del conocimiento, la entrega oportuna de evidencias formativas y el cumplimiento de los resultados de aprendizaje.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span>Plagio o copia en evidencias o proyectos formativos</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span>Inasistencia injustificada a sesiones de formación</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span>Incumplimiento de planes de mejoramiento concertados</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Faltas Disciplinarias
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Están relacionadas directamente con factores de comportamiento, convivencia pacífica, respeto hacia los miembros de la comunidad formativa, la integridad física o moral y el cuidado del patrimonio del SENA.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Agresiones verbales o físicas a instructores o compañeros</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Ingreso en estado de embriaguez o porte de sustancias</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Daño premeditado a maquinaria, talleres o laboratorios</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pyramid of Severity (Leves, Graves, Gravísimas) */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Calificación de la Gravedad de las Faltas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Criterios del Comité: Dolo o culpa, reiteración de la conducta, daño causado y grado de perturbación
            </p>

            <div className="space-y-4">
              {/* Leves */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                    Faltas Leves
                  </h4>
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-0.5 rounded">
                    Medida: Llamado de atención verbal o plan de mejoramiento
                  </span>
                </div>
                <p className="text-xs text-amber-950/80 dark:text-amber-200/80 leading-relaxed">
                  Incumplimientos esporádicos sin intención dolosa ni afectación grave a terceros (ej. no portar el carné visible por olvido ocasional o retraso justificado a formación).
                </p>
              </div>

              {/* Graves */}
              <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300">
                    Faltas Graves
                  </h4>
                  <span className="text-xs font-semibold text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 px-2.5 py-0.5 rounded">
                    Sanción: Llamado de atención por escrito en hoja de vida o condicionamiento
                  </span>
                </div>
                <p className="text-xs text-orange-950/80 dark:text-orange-200/80 leading-relaxed">
                  Conductas con reiteración, plagio comprobado de evidencias, inasistencias injustificadas acumuladas o desacato reiterado a instructores y normas de bioseguridad en talleres.
                </p>
              </div>

              {/* Gravísimas */}
              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300">
                    Faltas Gravísimas
                  </h4>
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 px-2.5 py-0.5 rounded">
                    Sanción: Cancelación definitiva de matrícula e inhabilidad
                  </span>
                </div>
                <p className="text-xs text-rose-950/80 dark:text-rose-200/80 leading-relaxed">
                  Porte de armas, tráfico o consumo de sustancias psicoactivas/alcohol en el centro, agresiones físicas graves, suplantación en plataformas institucionales o hurto calificado.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: EL DEBIDO PROCESO & COMITÉ */}
      {activeSubTab === 'debido-proceso' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
              Capítulo VII · Acuerdo 009 de 2024
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-1">
              Ruta del Debido Proceso y Comité de Evaluación
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
              Nadie en el SENA puede ser sancionado sin haber sido notificado previamente, escuchado en descargos y con plena garantía constitucional del derecho a la defensa.
            </p>
          </div>

          {/* 6 Steps Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00324D] dark:bg-sky-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Informe o Queja Escrita
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El instructor, compañero o funcionario radica la queja motivada con pruebas documentales o testimoniales ante la Coordinación Académica.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00324D] dark:bg-sky-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Citación Formal (Mínimo 3 días)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Se notifica formalmente al aprendiz con formulación clara de cargos, pruebas allegadas y fecha de sesión del Comité (con acudiente si es menor).
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#39A900] text-white text-xs font-bold flex items-center justify-center font-mono">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Sesión y Descargos
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El aprendiz es escuchado en descargos por el Comité de Evaluación y Seguimiento, puede aportar testigos, pruebas y controvertir los cargos.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00324D] dark:bg-sky-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                  4
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Recomendación del Comité
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El Comité delibera y emite un acta con recomendación pedagógica o sancionatoria dirigida al Subdirector de Centro.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00324D] dark:bg-sky-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                  5
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Acto Administrativo Motivado
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El Subdirector de Centro expide la Resolución motivada que exonera, aplica medida formativa o impone la sanción correspondiente.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#39A900] text-white text-xs font-bold flex items-center justify-center font-mono">
                  6
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Recurso de Reposición (5 días)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                El aprendiz tiene derecho legal de presentar recurso de reposición por escrito ante el Subdirector dentro de los 5 días hábiles a la notificación.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
