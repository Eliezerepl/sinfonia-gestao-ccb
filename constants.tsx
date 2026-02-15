
import { Student, LearningPhase, Teacher, InstrumentEntity, InstrumentFamily, MethodEntity } from './types';

export const INITIAL_METHODS: MethodEntity[] = [
  { id: 'm1', name: 'Schmoll', description: 'Método para piano e violino' },
  { id: 'm2', name: 'Bona', description: 'Método para divisão musical' },
  { id: 'm3', name: 'Suzuki', description: 'Método de aprendizado por audição' },
  { id: 'm4', name: 'Kohlerman', description: 'Estudos progressivos' },
  { id: 'm5', name: 'Arban', description: 'Método completo para metais' },
];

export const INITIAL_INSTRUMENTS: InstrumentEntity[] = [
  { id: 'i1', name: 'Violino', family: InstrumentFamily.CORDAS },
  { id: 'i2', name: 'Viola', family: InstrumentFamily.CORDAS },
  { id: 'i3', name: 'Violoncelo', family: InstrumentFamily.CORDAS },
  { id: 'i4', name: 'Flauta', family: InstrumentFamily.MADEIRAS },
  { id: 'i5', name: 'Clarinete', family: InstrumentFamily.MADEIRAS },
  { id: 'i6', name: 'Saxofone', family: InstrumentFamily.MADEIRAS },
  { id: 'i7', name: 'Trompete', family: InstrumentFamily.METAIS },
  { id: 'i8', name: 'Trombone', family: InstrumentFamily.METAIS },
  { id: 'i9', name: 'Órgão', family: InstrumentFamily.TECLAS },
];

export const INITIAL_TEACHERS: Teacher[] = [
  { id: '1', name: 'Ir. João Silva', instrument: 'Violino' },
  { id: '2', name: 'Ir. Maria Santos', instrument: 'Órgão' },
  { id: '3', name: 'Ir. Pedro Oliveira', instrument: 'Trompete' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Gabriel Mendonça',
    instrument: 'Violino',
    phase: LearningPhase.FASE_3,
    teacherId: '1',
    active: true,
    enrollmentDate: '2023-01-15',
    isOrchestraReady: false,
    lessons: [
      {
        id: 'l1',
        date: '2023-10-01',
        present: true,
        observation: 'Boa postura, mas precisa focar mais na afinação da 3ª posição.',
        exercisesMastered: ['Schmoll 21', 'Schmoll 22'],
        hymnsMastered: ['Hino 1', 'Hino 5'],
        evaluation: { technique: 8, rhythm: 7, reading: 7, date: '2023-10-01' }
      }
    ]
  },
  {
    id: 's2',
    name: 'Ana Clara Souza',
    instrument: 'Órgão',
    phase: LearningPhase.RJM,
    teacherId: '2',
    active: true,
    enrollmentDate: '2022-05-20',
    isOrchestraReady: true,
    lessons: []
  }
];
