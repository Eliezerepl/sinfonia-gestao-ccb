
import React, { useMemo, useState } from 'react';
import { Student } from '../types';
import { Library, Music, Search, Filter, User } from 'lucide-react';

interface HymnsViewProps {
  students: Student[];
}

const HymnsView: React.FC<HymnsViewProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  const hymnProgress = useMemo(() => {
    const progressMap: Record<string, { students: string[], count: number }> = {};

    students.forEach(student => {
      // Filter students if one is selected
      if (selectedStudent !== 'all' && student.id !== selectedStudent) return;

      const allMastered = student.lessons.flatMap(l => l.hymnsMastered);
      const uniqueMastered = Array.from(new Set(allMastered));

      uniqueMastered.forEach((hymn: string) => {
        // Apply search filter if present
        if (searchTerm && !hymn.toLowerCase().includes(searchTerm.toLowerCase())) return;

        if (!progressMap[hymn]) {
          progressMap[hymn] = { students: [], count: 0 };
        }
        progressMap[hymn].students.push(student.name);
        progressMap[hymn].count++;
      });
    });

    return Object.entries(progressMap)
      .sort((a, b) => {
        const numA = parseInt(a[0].replace(/\D/g, '')) || 0;
        const numB = parseInt(b[0].replace(/\D/g, '')) || 0;
        return numA - numB;
      });
  }, [students, searchTerm, selectedStudent]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hinário 5</h2>
          <p className="text-slate-500">Acompanhamento de hinos dominados</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center shadow-sm">
          <Library className="w-5 h-5 mr-2" />
          {hymnProgress.length} Hinos Registrados
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar por hino (ex: Hino 100)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
          />
        </div>

        <div className="relative group">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm appearance-none"
          >
            <option value="all">Filtro por Aluno: Todos</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {hymnProgress.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-600 text-sm">Hino</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Contagem</th>
                  <th className="p-4 font-bold text-slate-600 text-sm">Lista de Estudantes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hymnProgress.map(([hymn, data]) => (
                  <tr key={hymn} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold mr-3 border border-green-100 shadow-sm">
                          {hymn.replace(/\D/g, '') || '#'}
                        </div>
                        <span className="font-bold text-slate-800">{hymn}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold ring-1 ring-blue-100">
                          {data.count}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {data.students.map(name => (
                          <span key={name} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100 hover:bg-white hover:text-blue-500 hover:border-blue-200 transition-colors cursor-default">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 animate-pulse">
          <Library className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400">Nenhum resultado encontrado</h3>
          <p className="text-slate-500">Tente ajustar seus filtros ou termos de pesquisa.</p>
          {(searchTerm || selectedStudent !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedStudent('all'); }}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HymnsView;
