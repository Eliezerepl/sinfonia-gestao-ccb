import React, { useState, useMemo, useEffect } from 'react';
import { Lesson, MethodEntity } from '../types';
import { X, CheckCircle, Save, Book } from 'lucide-react';

interface NewLessonModalProps {
  methods: MethodEntity[];
  studentInstrument?: string;
  lessonToEdit?: Lesson | null;
  onClose: () => void;
  onSave: (lesson: Partial<Lesson>) => void;
}

const NewLessonModal: React.FC<NewLessonModalProps> = ({ methods, studentInstrument, lessonToEdit, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [present, setPresent] = useState(true);
  const [observation, setObservation] = useState('');

  const filteredMethods = useMemo(() => {
    return methods.filter(m =>
      m.instrument === 'Todos' ||
      m.instrument === studentInstrument ||
      !m.instrument
    );
  }, [methods, studentInstrument]);

  // Method 1
  const [selectedMethod1, setSelectedMethod1] = useState('');
  const [phase1, setPhase1] = useState('');
  const [lesson1, setLesson1] = useState('');
  const [exercise1, setExercise1] = useState('');

  // Method 2
  const [selectedMethod2, setSelectedMethod2] = useState('');
  const [phase2, setPhase2] = useState('');
  const [lesson2, setLesson2] = useState('');
  const [exercise2, setExercise2] = useState('');

  const [hymns, setHymns] = useState('');
  const [tech, setTech] = useState(7);
  const [rhythm, setRhythm] = useState(7);
  const [reading, setReading] = useState(7);

  useEffect(() => {
    if (lessonToEdit) {
      setDate(lessonToEdit.date);
      setPresent(lessonToEdit.present);
      setObservation(lessonToEdit.observation || '');
      setHymns(lessonToEdit.hymnsMastered?.join(', ') || '');

      if (lessonToEdit.evaluation) {
        setTech(lessonToEdit.evaluation.technique);
        setRhythm(lessonToEdit.evaluation.rhythm);
        setReading(lessonToEdit.evaluation.reading);
      }

      // Parse exercisesMastered
      // Format is usually "MethodName Fase X Lição Y Ex Z"
      if (lessonToEdit.exercisesMastered && lessonToEdit.exercisesMastered.length > 0) {
        const parseMethod = (str: string) => {
          // This is a simple parser, might need more robust logic if format varies
          const parts = str.split(' ');
          let methodName = "";
          let phase = "";
          let lesson = "";
          let exercise = "";

          // Find where "Fase", "Lição", "Ex" start
          const faseIdx = parts.indexOf("Fase");
          const licaoIdx = parts.indexOf("Lição");
          const exIdx = parts.indexOf("Ex");

          const nameEnd = faseIdx !== -1 ? faseIdx : (licaoIdx !== -1 ? licaoIdx : (exIdx !== -1 ? exIdx : parts.length));
          methodName = parts.slice(0, nameEnd).join(' ').trim();

          if (faseIdx !== -1) phase = parts[faseIdx + 1];
          if (licaoIdx !== -1) lesson = parts[licaoIdx + 1];
          if (exIdx !== -1) exercise = parts[exIdx + 1];

          return { methodName, phase, lesson, exercise };
        };

        const m1 = parseMethod(lessonToEdit.exercisesMastered[0]);
        setSelectedMethod1(m1.methodName);
        setPhase1(m1.phase);
        setLesson1(m1.lesson);
        setExercise1(m1.exercise);

        if (lessonToEdit.exercisesMastered[1]) {
          const m2 = parseMethod(lessonToEdit.exercisesMastered[1]);
          setSelectedMethod2(m2.methodName);
          setPhase2(m2.phase);
          setLesson2(m2.lesson);
          setExercise2(m2.exercise);
        }
      }
    }
  }, [lessonToEdit]);

  const handleSave = () => {
    const mastered = [];

    // Format Method 1
    if (selectedMethod1) {
      let m1Str = selectedMethod1;
      if (phase1) m1Str += ` Fase ${phase1}`;
      if (lesson1) m1Str += ` Lição ${lesson1}`;
      if (exercise1) m1Str += ` Ex ${exercise1}`;
      if (phase1 || lesson1 || exercise1) mastered.push(m1Str);
    }

    // Format Method 2
    if (selectedMethod2) {
      let m2Str = selectedMethod2;
      if (phase2) m2Str += ` Fase ${phase2}`;
      if (lesson2) m2Str += ` Lição ${lesson2}`;
      if (exercise2) m2Str += ` Ex ${exercise2}`;
      if (phase2 || lesson2 || exercise2) mastered.push(m2Str);
    }

    onSave({
      date,
      present,
      observation,
      exercisesMastered: mastered,
      hymnsMastered: hymns.split(',').map(s => s.trim()).filter(s => s !== ''),
      evaluation: present ? {
        technique: tech,
        rhythm: rhythm,
        reading: reading,
        date
      } : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${lessonToEdit ? 'bg-amber-500' : 'bg-blue-600'} text-white`}>
          <h3 className="text-xl font-bold">{lessonToEdit ? 'Editar Registro de Aula' : 'Registrar Aula'}</h3>
          <button onClick={onClose} className="hover:opacity-80 p-1 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Presença</label>
              <select
                value={present ? "true" : "false"}
                onChange={e => setPresent(e.target.value === "true")}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all pointer-events-auto"
              >
                <option value="true">Presente</option>
                <option value="false">Faltou</option>
              </select>
            </div>
          </div>

          {present && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Observações / Feedback</label>
                <textarea
                  value={observation}
                  onChange={e => setObservation(e.target.value)}
                  placeholder="Como foi o desempenho do aluno?"
                  className="w-full border border-slate-200 rounded-lg p-2.5 h-20 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-sm font-bold text-slate-800 flex items-center">
                  <Book className="w-4 h-4 mr-2 text-blue-500" /> Exercícios Masterizados (Máx 2)
                </label>

                {/* Method Row 1 */}
                <div className="space-y-2 border-b border-slate-200/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <select
                        value={selectedMethod1}
                        onChange={e => setSelectedMethod1(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all overflow-hidden text-ellipsis font-semibold"
                      >
                        <option value="">Selecione o Método 1</option>
                        {filteredMethods.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedMethod1 && (
                    <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {methods.find(m => m.name === selectedMethod1)?.hasPhases && (
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Fase</label>
                          <input
                            type="number"
                            value={phase1}
                            onChange={e => setPhase1(e.target.value)}
                            placeholder={`Max ${methods.find(m => m.name === selectedMethod1)?.totalPhases || '?'}`}
                            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                          />
                        </div>
                      )}
                      {selectedMethod1.toUpperCase() !== 'MSA' && (
                        <>
                          <div>
                            <label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Lição</label>
                            <input
                              type="number"
                              value={lesson1}
                              onChange={e => setLesson1(e.target.value)}
                              placeholder={`Max ${methods.find(m => m.name === selectedMethod1)?.totalLessons || '?'}`}
                              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Exercício</label>
                            <input
                              type="number"
                              value={exercise1}
                              onChange={e => setExercise1(e.target.value)}
                              placeholder={`Max ${methods.find(m => m.name === selectedMethod1)?.totalExercises || '?'}`}
                              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Method Row 2 */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <select
                        value={selectedMethod2}
                        onChange={e => setSelectedMethod2(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all overflow-hidden text-ellipsis font-semibold"
                      >
                        <option value="">Selecione o Método 2</option>
                        {filteredMethods.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedMethod2 && (
                    <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      {methods.find(m => m.name === selectedMethod2)?.hasPhases && (
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Fase</label>
                          <input
                            type="number"
                            value={phase2}
                            onChange={e => setPhase2(e.target.value)}
                            placeholder={`Max ${methods.find(m => m.name === selectedMethod2)?.totalPhases || '?'}`}
                            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                          />
                        </div>
                      )}
                      {selectedMethod2.toUpperCase() !== 'MSA' && (
                        <>
                          <div>
                            <label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Lição</label>
                            <input
                              type="number"
                              value={lesson2}
                              onChange={e => setLesson2(e.target.value)}
                              placeholder={`Max ${methods.find(m => m.name === selectedMethod2)?.totalLessons || '?'}`}
                              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">Exercício</label>
                            <input
                              type="number"
                              value={exercise2}
                              onChange={e => setExercise2(e.target.value)}
                              placeholder={`Max ${methods.find(m => m.name === selectedMethod2)?.totalExercises || '?'}`}
                              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hinos Masterizados</label>
                <input
                  type="text"
                  value={hymns}
                  onChange={e => setHymns(e.target.value)}
                  placeholder="ex: 432, 21"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                <p className="font-bold text-slate-800 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Avaliação da Aula (0-10)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Técnica</label>
                    <input type="number" min="0" max="10" value={tech} onChange={e => setTech(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Ritmo</label>
                    <input type="number" min="0" max="10" value={rhythm} onChange={e => setRhythm(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Leitura</label>
                    <input type="number" min="0" max="10" value={reading} onChange={e => setReading(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-semibold border-2 border-slate-200 text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center shadow-lg active:scale-95 ${lessonToEdit ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
          >
            {lessonToEdit ? <><Save className="w-5 h-5 mr-2" /> Atualizar Registro</> : <><Save className="w-5 h-5 mr-2" /> Salvar Aula</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewLessonModal;
