
import React, { useState } from 'react';
import { MethodEntity } from '../types';
import { Plus, Trash2, Book, Edit3 } from 'lucide-react';

interface MethodsManagementViewProps {
  methods: MethodEntity[];
  onAdd: (method: Omit<MethodEntity, 'id'>) => void;
  onDelete: (id: string) => void;
}

const MethodsManagementView: React.FC<MethodsManagementViewProps> = ({ methods, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cadastro de Métodos</h2>
        <p className="text-slate-500">Gerencie a biblioteca de métodos utilizados nas aulas</p>
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
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição (opcional)</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Breve descrição sobre o método..."
                className="w-full border border-slate-200 rounded-lg p-2.5 h-20 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center"
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
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{methods.length} TOTAL</span>
            </div>
            <div className="divide-y divide-slate-100">
              {methods.length > 0 ? methods.map(method => (
                <div key={method.id} className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-3 border border-blue-100">
                      <Book className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{method.name}</p>
                      <p className="text-xs text-slate-500">{method.description || 'Sem descrição'}</p>
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
