
import React, { useState } from 'react';
import { InstrumentEntity, InstrumentFamily } from '../types';
import { Plus, Trash2, Music, Hash } from 'lucide-react';

interface InstrumentsViewProps {
  instruments: InstrumentEntity[];
  onAdd: (instrument: Omit<InstrumentEntity, 'id'>) => void;
  onDelete: (id: string) => void;
}

const InstrumentsView: React.FC<InstrumentsViewProps> = ({ instruments, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [family, setFamily] = useState<InstrumentFamily>(InstrumentFamily.CORDAS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), family });
    setName('');
  };

  const familyColors: Record<InstrumentFamily, string> = {
    [InstrumentFamily.CORDAS]: 'bg-blue-100 text-blue-700 border-blue-200',
    [InstrumentFamily.MADEIRAS]: 'bg-green-100 text-green-700 border-green-200',
    [InstrumentFamily.METAIS]: 'bg-amber-100 text-amber-700 border-amber-200',
    [InstrumentFamily.TECLAS]: 'bg-purple-100 text-purple-700 border-purple-200',
    [InstrumentFamily.OUTROS]: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cadastro de Instrumentos</h2>
          <p className="text-slate-500">Gerencie a lista de instrumentos disponíveis na escola</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center mb-2">
              <Plus className="w-5 h-5 mr-2 text-blue-500" /> Novo Instrumento
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Violoncelo"
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Família</label>
              <select
                value={family}
                onChange={e => setFamily(e.target.value as InstrumentFamily)}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {Object.values(InstrumentFamily).map(fam => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instrumentos Ativos</span>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{instruments.length} TOTAL</span>
            </div>
            <div className="divide-y divide-slate-100">
              {instruments.length > 0 ? instruments.map(instrument => (
                <div key={instrument.id} className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                      <Music className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{instrument.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${familyColors[instrument.family]}`}>
                        {instrument.family}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(instrument.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Remover instrumento"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400">
                  <p>Nenhum instrumento cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentsView;
