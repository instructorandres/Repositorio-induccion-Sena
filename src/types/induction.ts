export type RoleMode = 'aprendiz' | 'instructor';

export type InductionStatus = 'completado' | 'en_progreso' | 'rezagado';

export interface ApprenticeProfile {
  id: string;
  nombre: string;
  documento: string;
  tipoDocumento: 'CC' | 'TI' | 'CE' | 'PPT';
  correo: string;
  telefono: string;
  fichaId: string;
  fichaNombre: string;
  programaFormacion: string;
  nivel: 'Técnico' | 'Tecnólogo' | 'Operario';
  regional: string;
  centroFormacion: string;
  instructorLider: string;
  fechaInicio: string;
  horasCompletadas: number;
  horasTotales: number;
  estado: InductionStatus;
  avatarUrl?: string;
  modulosCompletados: string[]; // ids of completed modules
  quizzesScores: Record<string, number>; // quizId -> score percentage
  casosResueltos: string[]; // caseId[]
  insigniasGanadas: string[]; // badgeId[]
  certificadoEmitido: boolean;
  fechaCertificado?: string;
  codigoVerificacion?: string;
}

export interface FichaInfo {
  id: string;
  numero: string;
  programa: string;
  modalidad: 'Presencial' | 'Virtual' | 'Mixta';
  jornada: 'Diurna' | 'Nocturna' | 'Madrugada' | 'Fines de semana';
  regional: string;
  centro: string;
  totalAprendices: number;
  completados: number;
  enProgreso: number;
  rezagados: number;
  promedioGeneral: number;
}

export interface SenaSymbol {
  id: string;
  nombre: string;
  significado: string;
  descripcionDetallada: string;
  elementos: {
    nombre: string;
    descripcion: string;
  }[];
}

export interface TimelineEvent {
  year: number;
  titulo: string;
  descripcion: string;
  hito: string;
}

export interface InstitutionalValue {
  id: string;
  nombre: string;
  lema: string;
  descripcion: string;
  aplicacionAprendiz: string;
}

export interface SenaRegulationItem {
  id: string;
  articulo: string;
  titulo: string;
  descripcion: string;
  categoria: 'derecho' | 'deber' | 'prohibicion';
  ambito: 'academico' | 'disciplinario' | 'convivencia' | 'bienestar';
  clave: string;
}

export interface CaseStudy {
  id: string;
  titulo: string;
  contexto: string;
  personaje: string;
  programa: string;
  situacion: string;
  preguntaTipificacion: string;
  tipoFaltaCorrecta: 'Academica' | 'Disciplinaria' | 'No constituye falta';
  gravedadCorrecta: 'Leve' | 'Grave' | 'Gravisima' | 'Inexistente';
  medidaCorrecta: string;
  opcionesTipificacion: string[];
  opcionesGravedad: string[];
  opcionesMedidas: string[];
  explicacionJuridica: string;
  articuloReglamento: string;
}

export interface QuizQuestion {
  id: string;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number; // index
  explicacion: string;
  tema: string;
}

export interface QuizModule {
  id: string;
  titulo: string;
  descripcion: string;
  duracionEstimada: string;
  preguntas: QuizQuestion[];
  umbralAprobacion: number; // percentage
}

export interface Badge {
  id: string;
  nombre: string;
  descripcion: string;
  criterio: string;
  icono: string;
}
