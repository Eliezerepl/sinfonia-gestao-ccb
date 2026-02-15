
export enum InstrumentFamily {
  CORDAS = 'Cordas',
  MADEIRAS = 'Madeiras',
  METAIS = 'Metais',
  TECLAS = 'Teclas',
  OUTROS = 'Outros'
}

export interface InstrumentEntity {
  id: string;
  name: string;
  family: InstrumentFamily;
}

export interface MethodEntity {
  id: string;
  name: string;
  description?: string;
  totalLessons?: number;
  totalExercises?: number;
  hasPhases?: boolean;
  totalPhases?: number;
  instrument?: string;
}

export enum LearningPhase {
  FASE_1 = '1ª Fase (Iniciante)',
  FASE_2 = '2ª Fase',
  FASE_3 = '3ª Fase',
  FASE_4 = '4ª Fase',
  RJM = 'RJM (Reunião de Jovens)',
  APTO_ORQUESTRA = 'Apto para Orquestra',
  OFICIALIZADO = 'Oficializado'
}

export interface Evaluation {
  technique: number; // 0-10
  rhythm: number;    // 0-10
  reading: number;   // 0-10
  date: string;
}

export interface Lesson {
  id: string;
  date: string;
  present: boolean;
  observation: string;
  exercisesMastered: string[];
  hymnsMastered: string[];
  evaluation?: Evaluation;
}

export interface Student {
  id: string;
  name: string;
  instrument: string;
  phase: LearningPhase;
  teacherId: string;
  active: boolean;
  enrollmentDate: string;
  lessons: Lesson[];
  isOrchestraReady: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  instruments: string[];
  role: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  orchestraReady: number;
  studentsByInstrument: Record<string, number>;
}
