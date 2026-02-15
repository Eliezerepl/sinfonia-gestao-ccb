import React, { useState, useEffect } from 'react';
import { Student, LearningPhase, Teacher } from '../types';
import { X, UserPlus, Music, Briefcase, GraduationCap, Save } from 'lucide-react';

interface NewStudentModalProps {
  teachers: Teacher[];
  availableInstruments: string[];
  studentToEdit?: Student | null;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
}

const NewStudentModal: React.FC<NewStudentModalProps> = ({ teachers, availableInstruments, studentToEdit, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState(availableInstruments[0] || '');
  const [phase, setPhase] = useState<LearningPhase>(LearningPhase.FASE_1);
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setInstrument(studentToEdit.instrument);
      setPhase(studentToEdit.phase as LearningPhase);
      setTeacherId(studentToEdit.teacherId);
    }
  }, [studentToEdit]);

  const handleSave = () => {
    if (!name.trim()) return alert('Nome é obrigatório');
    if (!instrument) return alert('Selecione um instrumento');

    const studentData: Partial<Student> = {
      name: name.trim(),
      instrument,
      phase,
      teacherId,
    };

    if (!studentToEdit) {
      studentData.active = true;
      studentData.enrollmentDate = new Date().toISOString().split('T')[0];
      studentData.lessons = [];
      studentData.isOrchestraReady = false;
    }

    onSave(studentData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${studentToEdit ? 'bg-amber-500' : 'bg-blue-600'} text-white`}>
          <h3 className="text-xl font-bold flex items-center">
            {studentToEdit ? <><Save className="w-6 h-6 mr-2" /> Editar Aluno</> : <><UserPlus className="w-6 h-6 mr-2" /> Cadastrar Novo Aluno</>}
          </h3>
          <button onClick={onClose} className="hover:opacity-80 p-1 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Pedro Henrique Silva"
              className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center">
                <Music className="w-4 h-4 mr-2 text-slate-400" /> Instrumento
              </label>
              <select
                value={instrument}
                onChange={e => setInstrument(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {availableInstruments.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-slate-400" /> Fase
              </label>
              <select
                value={phase}
                onChange={e => setPhase(e.target.value as LearningPhase)}
                className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {Object.values(LearningPhase).map(ph => (
                  <option key={ph} value={ph}>{ph}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-slate-400" /> Professor Responsável
              </label>
              <select
                value={teacherId}
                onChange={e => setTeacherId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.instruments?.join(', ') || 'Nenhum'})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center shadow-lg active:scale-95 ${studentToEdit ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {studentToEdit ? 'Salvar Alterações' : 'Cadastrar Aluno'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewStudentModal;
