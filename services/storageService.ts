
import { supabase } from './supabaseClient';
import { Student, Teacher, InstrumentEntity, MethodEntity, Lesson } from '../types';

export const storageService = {
  // Instruments
  getInstruments: async (): Promise<InstrumentEntity[]> => {
    const { data, error } = await supabase
      .from('instruments')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  saveInstrument: async (instrument: Omit<InstrumentEntity, 'id'>) => {
    const { data, error } = await supabase
      .from('instruments')
      .insert([instrument])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteInstrument: async (id: string) => {
    const { error } = await supabase
      .from('instruments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Methods
  getMethods: async (): Promise<MethodEntity[]> => {
    const { data, error } = await supabase
      .from('methods')
      .select('*')
      .order('name');
    if (error) throw error;
    return (data || []).map((m: any) => ({
      ...m,
      totalLessons: m.total_lessons,
      totalExercises: m.total_exercises,
      hasPhases: m.has_phases,
      totalPhases: m.total_phases,
      instrument: m.instrument
    }));
  },

  saveMethod: async (method: Omit<MethodEntity, 'id'>) => {
    const dbData = {
      name: method.name,
      description: method.description,
      total_lessons: method.totalLessons,
      total_exercises: method.totalExercises,
      has_phases: method.hasPhases,
      total_phases: method.totalPhases,
      instrument: method.instrument || 'Todos'
    };
    const { data, error } = await supabase
      .from('methods')
      .insert([dbData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteMethod: async (id: string) => {
    const { error } = await supabase
      .from('methods')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Teachers
  getTeachers: async (): Promise<Teacher[]> => {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    if (error) throw error;
    return (data || []).map((t: any) => ({
      ...t,
      instruments: t.instruments || (t.instrument ? [t.instrument] : []),
      role: t.role || 'Instrutor'
    }));
  },

  saveTeacher: async (teacher: Omit<Teacher, 'id'>) => {
    const dbData = {
      name: teacher.name,
      instruments: teacher.instruments,
      role: teacher.role
    };
    const { data, error } = await supabase
      .from('teachers')
      .insert([dbData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateTeacher: async (id: string, teacher: Partial<Teacher>) => {
    const dbData: any = {};
    if (teacher.name) dbData.name = teacher.name;
    if (teacher.instruments) dbData.instruments = teacher.instruments;
    if (teacher.role) dbData.role = teacher.role;

    const { error } = await supabase
      .from('teachers')
      .update(dbData)
      .eq('id', id);
    if (error) throw error;
  },

  deleteTeacher: async (id: string) => {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        lessons (*)
      `)
      .order('name');

    if (error) throw error;

    // Map Snake Case to Camel Case if necessary, though Supabase might return what we need
    return (data || []).map((s: any) => ({
      ...s,
      teacherId: s.teacher_id,
      enrollmentDate: s.enrollment_date,
      isOrchestraReady: s.is_orchestra_ready,
      lessons: (s.lessons || []).map((l: any) => ({
        ...l,
        exercisesMastered: l.exercises_mastered,
        hymnsMastered: l.hymns_mastered
      }))
    }));
  },

  saveStudent: async (student: Omit<Student, 'id' | 'lessons'>) => {
    const dbData = {
      name: student.name,
      instrument: student.instrument,
      phase: student.phase,
      teacher_id: student.teacherId,
      active: student.active,
      enrollment_date: student.enrollmentDate,
      is_orchestra_ready: student.isOrchestraReady
    };

    const { data, error } = await supabase
      .from('students')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateStudentOrchestraStatus: async (id: string, isReady: boolean) => {
    const { error } = await supabase
      .from('students')
      .update({ is_orchestra_ready: isReady })
      .eq('id', id);
    if (error) throw error;
  },

  updateStudentPhase: async (id: string, phase: string) => {
    const { error } = await supabase
      .from('students')
      .update({ phase })
      .eq('id', id);
    if (error) throw error;
  },

  // Lessons
  addLesson: async (studentId: string, lesson: Omit<Lesson, 'id'>) => {
    const dbData = {
      student_id: studentId,
      date: lesson.date,
      present: lesson.present,
      observation: lesson.observation,
      exercises_mastered: lesson.exercisesMastered,
      hymns_mastered: lesson.hymnsMastered,
      evaluation: lesson.evaluation
    };

    const { data, error } = await supabase
      .from('lessons')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateLesson: async (id: string, lesson: Partial<Lesson>) => {
    const dbData: any = {};
    if (lesson.date) dbData.date = lesson.date;
    if (lesson.present !== undefined) dbData.present = lesson.present;
    if (lesson.observation !== undefined) dbData.observation = lesson.observation;
    if (lesson.exercisesMastered) dbData.exercises_mastered = lesson.exercisesMastered;
    if (lesson.hymnsMastered) dbData.hymns_mastered = lesson.hymnsMastered;
    if (lesson.evaluation !== undefined) dbData.evaluation = lesson.evaluation;

    const { error } = await supabase
      .from('lessons')
      .update(dbData)
      .eq('id', id);
    if (error) throw error;
  },

  deleteLesson: async (id: string) => {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  updateStudent: async (id: string, student: Partial<Student>) => {
    const dbData: any = {};
    if (student.name) dbData.name = student.name;
    if (student.instrument) dbData.instrument = student.instrument;
    if (student.phase) dbData.phase = student.phase;
    if (student.teacherId) dbData.teacher_id = student.teacherId;
    if (student.active !== undefined) dbData.active = student.active;
    if (student.enrollmentDate) dbData.enrollment_date = student.enrollmentDate;
    if (student.isOrchestraReady !== undefined) dbData.is_orchestra_ready = student.isOrchestraReady;

    const { error } = await supabase
      .from('students')
      .update(dbData)
      .eq('id', id);
    if (error) throw error;
  }
};
