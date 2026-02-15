
import React, { useState } from 'react';
import { Lesson, Evaluation, MethodEntity } from '../types';
import { X, CheckCircle, Save, Info, Book } from 'lucide-react';

interface NewLessonModalProps {
  methods: MethodEntity[];
  onClose: () => void;
  onSave: (lesson: Partial<Lesson>) => void;
}

const NewLessonModal: React.FC<NewLessonModalProps> = ({ methods, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [present, setPresent] = useState(true);
  const [observation, setObservation] = useState('');

  // Method 1
  const [selectedMethod1, setSelectedMethod1] = useState('');
  const [exerciseNum1, setExerciseNum1] = useState('');

  // Method 2
  const [selectedMethod2, setSelectedMethod2] = useState('');
  const [exerciseNum2, setExerciseNum2] = useState('');

  const [hymns, setHymns] = useState('');
  const [tech, setTech] = useState(7);
  const [rhythm, setRhythm] = useState(7);
  const [reading, setReading] = useState(7);

  const handleSave = () => {
    const mastered = [];
    if (selectedMethod1 && exerciseNum1) {
      mastered.push(`${selectedMethod1} ${exerciseNum1}`);
    }
    if (selectedMethod2 && exerciseNum2) {
      mastered.push(`${selectedMethod2} ${exerciseNum2}`);
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
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
          <h3 className="text-xl font-bold">Registrar Aula</h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
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
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={selectedMethod1}
                      onChange={e => setSelectedMethod1(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all overflow-hidden text-ellipsis"
                    >
                      <option value="">Selecione o Método 1</option>
                      {methods.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      value={exerciseNum1}
                      onChange={e => setExerciseNum1(e.target.value)}
                      placeholder="Lição"
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Method Row 2 */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={selectedMethod2}
                      onChange={e => setSelectedMethod2(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all overflow-hidden text-ellipsis"
                    >
                      <option value="">Selecione o Método 2</option>
                      {methods.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      value={exerciseNum2}
                      onChange={e => setExerciseNum2(e.target.value)}
                      placeholder="Lição"
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
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
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" /> Salvar Aula
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewLessonModal;
