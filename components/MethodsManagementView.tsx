
import React, { useState } from 'react';
import { MethodEntity } from '../types';
import { Plus, Trash2, Book, Edit3, Star } from 'lucide-react';

interface MethodsManagementViewProps {
  methods: MethodEntity[];
  availableInstruments: string[];
  onAdd: (method: Omit<MethodEntity, 'id'>) => void;
  onDelete: (id: string) => void;
}

const MethodsManagementView: React.FC<MethodsManagementViewProps> = ({ methods, availableInstruments, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalLessons, setTotalLessons] = useState<string>('');
  const [totalExercises, setTotalExercises] = useState<string>('');
  const [hasPhases, setHasPhases] = useState(false);
  const [totalPhases, setTotalPhases] = useState<string>('');
  const [instrument, setInstrument] = useState('Todos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      totalLessons: parseInt(totalLessons) || 0,
      totalExercises: parseInt(totalExercises) || 0,
      hasPhases,
      totalPhases: hasPhases ? (parseInt(totalPhases) || 0) : 0,
      instrument
    });
    setName('');
    setDescription('');
    setTotalLessons('');
    setTotalExercises('');
    setHasPhases(false);
    setTotalPhases('');
    setInstrument('Todos');
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cadastro de Métodos</h2>
        <p className="text-slate-500">Gerencie a biblioteca de métodos por instrumento (MSA é a base para todos)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center mb-2">
              <Plus className="w-5 h-5 mr-2 text-blue-500" /> Novo Método
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Método</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Schmoll, Bona, Suzuki"
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Instrumento</label>
              <select
                value={instrument}
                onChange={e => setInstrument(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="Todos">Todos (Teoria/MSA)</option>
                {availableInstruments.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Total Lições</label>
                <input
                  type="number"
                  value={totalLessons}
                  onChange={e => setTotalLessons(e.target.value)}
                  placeholder="0"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Total Exercícios</label>
                <input
                  type="number"
                  value={totalExercises}
                  onChange={e => setTotalExercises(e.target.value)}
                  placeholder="0"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className={`w-10 h-6 flex items-center bg-slate-200 rounded-full p-1 duration-300 ease-in-out ${hasPhases ? 'bg-blue-600' : ''}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${hasPhases ? 'translate-x-4' : ''}`}></div>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={hasPhases}
                  onChange={(e) => setHasPhases(e.target.checked)}
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Possui Fases?</span>
              </label>
            </div>

            {hasPhases && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Quantidade de Fases</label>
                <input
                  type="number"
                  value={totalPhases}
                  onChange={e => setTotalPhases(e.target.value)}
                  placeholder="Ex: 4"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição (opcional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Breve descrição sobre o método..."
                className="w-full border border-slate-200 rounded-lg p-2.5 h-20 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" /> Cadastrar Método
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Métodos Registrados</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">{methods.length} TOTAL</span>
            </div>
            <div className="divide-y divide-slate-100">
              {methods.length > 0 ? methods.map(method => (
                <div key={method.id} className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4 border border-blue-100 shadow-sm relative">
                      <Book className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 bg-white text-[8px] px-1 border border-blue-200 rounded font-bold text-blue-800 shadow-sm">
                        {method.instrument === 'Todos' ? 'Teoria' : 'Instr.'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">{method.name}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${method.instrument === 'Todos' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                          {method.instrument}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center text-[10px] text-slate-500 font-medium">
                          <Book className="w-3 h-3 mr-1 text-slate-400" />
                          <span>{method.totalLessons || 0} Lições</span>
                        </div>
                        <div className="flex items-center text-[10px] text-slate-500 font-medium">
                          <Edit3 className="w-3 h-3 mr-1 text-slate-400" />
                          <span>{method.totalExercises || 0} Exercícios</span>
                        </div>
                        {method.hasPhases && (
                          <div className="flex items-center text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            <Star className="w-3 h-3 mr-1" />
                            <span>{method.totalPhases || 0} Fases</span>
                          </div>
                        )}
                      </div>
                      {method.description && <p className="text-[11px] text-slate-400 mt-1">{method.description}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(method.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Excluir método"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400">
                  <Book className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Nenhum método cadastrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodsManagementView;
