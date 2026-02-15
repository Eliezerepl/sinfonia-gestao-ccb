
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
      totalPhases: m.total_phases
    }));
  },

  saveMethod: async (method: Omit<MethodEntity, 'id'>) => {
    const dbData = {
      name: method.name,
      description: method.description,
      total_lessons: method.totalLessons,
      total_exercises: method.totalExercises,
      has_phases: method.hasPhases,
      total_phases: method.totalPhases
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
    return data || [];
  },

  saveTeacher: async (teacher: Omit<Teacher, 'id'>) => {
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacher])
      .select()
      .single();
    if (error) throw error;
    return data;
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
  }
};
