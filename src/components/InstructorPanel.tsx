import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Mail,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { ApprenticeProfile, FichaInfo, InductionStatus } from '../types/induction';
import { SAMPLE_APPRENTICES, SAMPLE_FICHAS, SENA_LOGO_SVG } from '../data/senaData';

interface InstructorPanelProps {
  currentApprenticeId: string;
  onSelectApprentice: (apprentice: ApprenticeProfile) => void;
  onOpenCertificate: (apprentice: ApprenticeProfile) => void;
  apprentices?: ApprenticeProfile[];
}

export const InstructorPanel: React.FC<InstructorPanelProps> = ({
  currentApprenticeId,
  onSelectApprentice,
  onOpenCertificate,
  apprentices,
}) => {
  const allApprentices = apprentices && apprentices.length > 0 ? apprentices : SAMPLE_APPRENTICES;
  const [selectedFichaId, setSelectedFichaId] = useState<string>(SAMPLE_FICHAS[0].id);
  const [statusFilter, setStatusFilter] = useState<'todos' | InductionStatus>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inspectedApprentice, setInspectedApprentice] = useState<ApprenticeProfile | null>(null);
  const [sentReminderId, setSentReminderId] = useState<string | null>(null);

  const selectedFicha = SAMPLE_FICHAS.find((f) => f.id === selectedFichaId) || SAMPLE_FICHAS[0];

  const filteredApprentices = allApprentices.filter((app) => {
    const matchesStatus = statusFilter === 'todos' || app.estado === statusFilter;
    const matchesSearch =
      app.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.documento.includes(searchTerm) ||
      app.correo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendReminder = (apprenticeId: string) => {
    setSentReminderId(apprenticeId);
    setTimeout(() => {
      setSentReminderId(null);
    }, 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Tipo Doc', 'Documento', 'Ficha', 'Programa', 'Horas Induccion', 'Estado', 'Promedio Quizzes', 'Certificado'];
    const rows = allApprentices.map((a) => {
      const avg = Object.values(a.quizzesScores).length > 0
        ? Math.round(Object.values(a.quizzesScores).reduce((x, y) => x + y, 0) / Object.values(a.quizzesScores).length)
        : 0;
      return [
        `"${a.nombre}"`,
        a.tipoDocumento,
        a.documento,
        a.fichaNombre,
        `"${a.programaFormacion}"`,
        `${a.horasCompletadas}/40`,
        a.estado,
        `${avg}%`,
        a.certificadoEmitido ? 'Emitido' : 'Pendiente',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Seguimiento_Induccion_${selectedFicha.numero}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Title & Ficha Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 dark:text-sky-400 mb-1">
            <img src={SENA_LOGO_SVG} alt="" className="w-4 h-4 object-contain inline-block" />
            <UserCheck className="w-4 h-4" />
            <span>GESTIÓN DOCENTE · SEGUIMIENTO DE INDUCCIÓN SENA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Panel de Seguimiento a Fichas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Supervisa en tiempo real el avance de los aprendices, cumplimiento de horas formativas, calificaciones de quizzes normativos y generación de certificados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedFichaId}
            onChange={(e) => setSelectedFichaId(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs focus:outline-none focus:border-[#39A900]"
          >
            {SAMPLE_FICHAS.map((f) => (
              <option key={f.id} value={f.id}>
                Ficha {f.numero} — {f.programa}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#00324D] hover:bg-[#002538] text-white transition-colors shadow-xs whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Reporte CSV</span>
          </button>
        </div>
      </div>

      {/* Ficha Key Statistics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Total Aprendices en Ficha</span>
            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {selectedFicha.totalAprendices}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Jornada {selectedFicha.jornada} · {selectedFicha.modalidad}
          </p>
        </div>

        {/* Card 2: Inducción Completada */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Inducción Completada</span>
            <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-3xl font-extrabold text-[#39A900] tabular-nums">
            {selectedFicha.completados}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {Math.round((selectedFicha.completados / selectedFicha.totalAprendices) * 100)}% de la ficha certificado
          </p>
        </div>

        {/* Card 3: En progreso */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>En Progreso Activo</span>
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-sky-700 dark:text-sky-400 tabular-nums">
            {selectedFicha.enProgreso}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Desarrollando módulos y simulador
          </p>
        </div>

        {/* Card 4: Rezagados / Alerta */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Alerta de Rezago</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
            {selectedFicha.rezagados}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Menos de 20h o quizzes pendientes
          </p>
        </div>
      </div>

      {/* Cohort Search and Filters */}
      <div className="bg-white dark:bg-slate-850 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar aprendiz por nombre, número de documento o correo..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#39A900] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estado:</span>
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                statusFilter === 'todos'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Todos ({allApprentices.length})
            </button>
            <button
              onClick={() => setStatusFilter('completado')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                statusFilter === 'completado'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Completados
            </button>
            <button
              onClick={() => setStatusFilter('en_progreso')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                statusFilter === 'en_progreso'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              En progreso
            </button>
            <button
              onClick={() => setStatusFilter('rezagado')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                statusFilter === 'rezagado'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              Rezagados
            </button>
          </div>
        </div>

        {/* Apprentices Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Aprendiz</th>
                <th className="py-3 px-3">Documento</th>
                <th className="py-3 px-3">Horas Inducción</th>
                <th className="py-3 px-3">Quizzes Aprobados</th>
                <th className="py-3 px-3">Promedio</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acciones de Seguimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800/60">
              {filteredApprentices.map((app) => {
                const isSelected = app.id === currentApprenticeId;
                const scoresList = Object.values(app.quizzesScores);
                const avg = scoresList.length > 0
                  ? Math.round(scoresList.reduce((a, b) => a + b, 0) / scoresList.length)
                  : 0;

                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors ${
                      isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                      <div>
                        <span className="font-bold block">{app.nombre}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{app.correo}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-mono">
                      {app.tipoDocumento} {app.documento}
                    </td>
                    <td className="py-3.5 px-3 tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      <span>{app.horasCompletadas} / 40 h</span>
                    </td>
                    <td className="py-3.5 px-3 tabular-nums text-slate-700 dark:text-slate-300">
                      {Object.keys(app.quizzesScores).length} de 3
                    </td>
                    <td className="py-3.5 px-3 tabular-nums font-mono font-semibold text-slate-900 dark:text-white">
                      {avg > 0 ? `${avg}%` : '—'}
                    </td>
                    <td className="py-3.5 px-3">
                      {app.estado === 'completado' ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                        </span>
                      ) : app.estado === 'en_progreso' ? (
                        <span className="text-sky-700 dark:text-sky-400 font-semibold text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> En Progreso
                        </span>
                      ) : (
                        <span className="text-rose-700 dark:text-rose-400 font-semibold text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Rezagado
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInspectedApprentice(app)}
                          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Ver Ficha Detallada"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendReminder(app.id)}
                          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Enviar Recordatorio por Correo Institucional"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectApprentice(app)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          {isSelected ? 'Aprendiz Activo' : 'Cargar Perfil'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Toast confirmation of reminder */}
        {sentReminderId && (
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-lg text-xs text-sky-800 dark:text-sky-200 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Recordatorio de inducción enviado exitosamente al correo institucional del aprendiz.</span>
          </div>
        )}
      </div>

      {/* Individual Apprentice Inspection Drawer Modal */}
      {inspectedApprentice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#39A900]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ficha de Inducción del Aprendiz
                </h3>
              </div>
              <button
                onClick={() => setInspectedApprentice(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-sm text-slate-900 dark:text-white">{inspectedApprentice.nombre}</div>
                <div className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {inspectedApprentice.tipoDocumento} {inspectedApprentice.documento} · {inspectedApprentice.correo}
                </div>
                <div className="text-slate-600 dark:text-slate-300 mt-1">
                  Programa: {inspectedApprentice.programaFormacion} (Ficha {inspectedApprentice.fichaNombre})
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                  Estado de Módulos
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Identidad & Símbolos:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {inspectedApprentice.modulosCompletados.includes('identidad') ? '✓ Completado' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Reglamento & Normas:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {inspectedApprentice.modulosCompletados.includes('normativa') ? '✓ Completado' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Simulador de Casos:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {inspectedApprentice.casosResueltos.length} de 3 resueltos
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Certificado Oficial:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {inspectedApprentice.certificadoEmitido ? '✓ Expedido' : 'En trámite'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                  Quizzes Presentados
                </h4>
                <div className="space-y-1.5">
                  {Object.entries(inspectedApprentice.quizzesScores).map(([qId, score]) => (
                    <div
                      key={qId}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{qId.replace('quiz-', '')}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{score}%</span>
                    </div>
                  ))}
                  {Object.keys(inspectedApprentice.quizzesScores).length === 0 && (
                    <p className="text-slate-400 dark:text-slate-500 italic">No ha presentado evaluaciones aún.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onSelectApprentice(inspectedApprentice);
                  setInspectedApprentice(null);
                }}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-[#39A900] hover:bg-[#2e8800] text-white transition-colors"
              >
                Ver como este Aprendiz
              </button>
              <button
                onClick={() => {
                  onOpenCertificate(inspectedApprentice);
                  setInspectedApprentice(null);
                }}
                className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Ver Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
