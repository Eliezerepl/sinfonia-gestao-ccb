
import React, { useState } from 'react';
import { Teacher } from '../types';
import { Plus, Trash2, UserCheck, Briefcase } from 'lucide-react';

interface TeachersViewProps {
    teachers: Teacher[];
    availableInstruments: string[];
    onAdd: (teacher: Omit<Teacher, 'id'>) => void;
    onDelete: (id: string) => void;
}

const TeachersView: React.FC<TeachersViewProps> = ({ teachers, availableInstruments, onAdd, onDelete }) => {
    const [name, setName] = useState('');
    const [instrument, setInstrument] = useState(availableInstruments[0] || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !instrument) return;
        onAdd({ name: name.trim(), instrument });
        setName('');
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Cadastro de Professores</h2>
                    <p className="text-slate-500">Gerencie a lista de instrutores da escola musical</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center mb-2">
                            <Plus className="w-5 h-5 mr-2 text-blue-500" /> Novo Professor
                        </h3>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ex: Ir. João Silva"
                                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Instrumento Principal</label>
                            <select
                                value={instrument}
                                onChange={e => setInstrument(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Selecione...</option>
                                {availableInstruments.map(inst => (
                                    <option key={inst} value={inst}>{inst}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Adicionar Professor
                        </button>
                    </form>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professores Ativos</span>
                            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{teachers.length} TOTAL</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {teachers.length > 0 ? teachers.map(teacher => (
                                <div key={teacher.id} className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                                            <UserCheck className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{teacher.name}</p>
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Briefcase className="w-3.h-3 mr-1" /> {teacher.instrument}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDelete(teacher.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remover professor"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-slate-400">
                                    <p>Nenhum professor cadastrado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeachersView;
