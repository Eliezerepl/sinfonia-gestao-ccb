
import { Student, Teacher, InstrumentEntity, MethodEntity } from '../types';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_INSTRUMENTS, INITIAL_METHODS } from '../constants';

const STORAGE_KEYS = {
  STUDENTS: 'sinfonia_students',
  TEACHERS: 'sinfonia_teachers',
  INSTRUMENTS: 'sinfonia_instruments',
  METHODS: 'sinfonia_methods'
};

export const storageService = {
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  },
  
  saveStudents: (students: Student[]): void => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },
  
  getTeachers: (): Teacher[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return data ? JSON.parse(data) : INITIAL_TEACHERS;
  },
  
  saveTeachers: (teachers: Teacher[]): void => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  getInstruments: (): InstrumentEntity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INSTRUMENTS);
    return data ? JSON.parse(data) : INITIAL_INSTRUMENTS;
  },

  saveInstruments: (instruments: InstrumentEntity[]): void => {
    localStorage.setItem(STORAGE_KEYS.INSTRUMENTS, JSON.stringify(instruments));
  },

  getMethods: (): MethodEntity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.METHODS);
    return data ? JSON.parse(data) : INITIAL_METHODS;
  },

  saveMethods: (methods: MethodEntity[]): void => {
    localStorage.setItem(STORAGE_KEYS.METHODS, JSON.stringify(methods));
  }
};
