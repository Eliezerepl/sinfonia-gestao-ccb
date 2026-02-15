import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { Plus, Trash2, UserCheck, Briefcase, Edit3, X, Check, Save } from 'lucide-react';

interface TeachersViewProps {
    teachers: Teacher[];
    availableInstruments: string[];
    onAdd: (teacher: Omit<Teacher, 'id'>) => void;
    onUpdate: (id: string, teacher: Partial<Teacher>) => void;
    onDelete: (id: string) => void;
}

const TeachersView: React.FC<TeachersViewProps> = ({ teachers, availableInstruments, onAdd, onUpdate, onDelete }) => {
    const [name, setName] = useState('');
    const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
    const [role, setRole] = useState('Instrutor');
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const roles = ['Instrutor', 'Encarregado Local', 'Encarregado Regional', 'Examinadora', 'Auxiliar de Teoria'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || selectedInstruments.length === 0) {
            alert('Por favor, preencha o nome e selecione pelo menos um instrumento.');
            return;
        }

        if (editingTeacher) {
            onUpdate(editingTeacher.id, {
                name: name.trim(),
                instruments: selectedInstruments,
                role: role
            });
            setEditingTeacher(null);
        } else {
            onAdd({
                name: name.trim(),
                instruments: selectedInstruments,
                role: role
            });
        }

        resetForm();
    };

    const resetForm = () => {
        setName('');
        setSelectedInstruments([]);
        setRole('Instrutor');
        setEditingTeacher(null);
    };

    const startEdit = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setName(teacher.name);
        setSelectedInstruments(teacher.instruments || []);
        setRole(teacher.role || 'Instrutor');
    };

    const toggleInstrument = (inst: string) => {
        setSelectedInstruments(prev =>
            prev.includes(inst)
                ? prev.filter(i => i !== inst)
                : [...prev, inst]
        );
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gestão de Instrutores e Encarregados</h2>
                    <p className="text-slate-500">Cadastre e gerencie a equipe musical por instrumentos e cargos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 sticky top-24">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-900 flex items-center">
                                {editingTeacher ? (
                                    <><Edit3 className="w-5 h-5 mr-2 text-amber-500" /> Editar Professor</>
                                ) : (
                                    <><Plus className="w-5 h-5 mr-2 text-blue-500" /> Novo Professor</>
                                )}
                            </h3>
                            {editingTeacher && (
                                <button type="button" onClick={resetForm} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ex: Ir. João Silva"
                                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Cargo / Função</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                            >
                                {roles.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Instrumentos que ensina</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                                {availableInstruments.map(inst => (
                                    <label key={inst} className="flex items-center space-x-2 cursor-pointer group">
                                        <div
                                            onClick={() => toggleInstrument(inst)}
                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedInstruments.includes(inst)
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'bg-white border-slate-300 group-hover:border-blue-400'
                                                }`}
                                        >
                                            {selectedInstruments.includes(inst) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-xs ${selectedInstruments.includes(inst) ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>
                                            {inst}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-2.5 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center active:scale-95 ${editingTeacher
                                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                }`}
                        >
                            {editingTeacher ? (
                                <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>
                            ) : (
                                <><Plus className="w-4 h-4 mr-2" /> Adicionar Professor</>
                            )}
                        </button>
                    </form>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membros da Equipe Musical</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">{teachers.length} TOTAL</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {teachers.length > 0 ? teachers.map(teacher => (
                                <div key={teacher.id} className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center mr-4 shadow-sm">
                                            <UserCheck className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-800">{teacher.name}</p>
                                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase border border-slate-200">
                                                    {teacher.role || 'Instrutor'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                {teacher.instruments?.map(inst => (
                                                    <span key={inst} className="flex items-center text-[10px] text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-full border border-blue-100/50">
                                                        <Briefcase className="w-2.5 h-2.5 mr-1" /> {inst}
                                                    </span>
                                                ))}
                                                {(!teacher.instruments || teacher.instruments.length === 0) && (
                                                    <span className="text-[10px] text-slate-400 italic">Nenhum instrumento atribuído</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(teacher)}
                                            className="p-2 text-slate-300 hover:text-amber-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            title="Editar informações"
                                        >
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(teacher.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            title="Remover professor"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-slate-400">
                                    <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>Nenhum professor cadastrado ainda.</p>
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
