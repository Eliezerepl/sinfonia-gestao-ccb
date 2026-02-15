
import React, { useMemo } from 'react';
import { Student } from '../types';
import { Library, Music, User } from 'lucide-react';

interface HymnsViewProps {
  students: Student[];
}

const HymnsView: React.FC<HymnsViewProps> = ({ students }) => {
  const hymnProgress = useMemo(() => {
    const progressMap: Record<string, { students: string[], count: number }> = {};
    
    students.forEach(student => {
      const allMastered = student.lessons.flatMap(l => l.hymnsMastered);
      const uniqueMastered = Array.from(new Set(allMastered));
      
      // Explicitly type hymn as string to avoid index type errors
      uniqueMastered.forEach((hymn: string) => {
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
  }, [students]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hinário 5</h2>
          <p className="text-slate-500">Progresso de hinos na escola</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center">
          <Library className="w-5 h-5 mr-2" />
          {hymnProgress.length} Hinos Registrados
        </div>
      </div>

      {hymnProgress.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 font-bold text-slate-600 text-sm">Hino</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Alunos</th>
                <th className="p-4 font-bold text-slate-600 text-sm">Lista de Estudantes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hymnProgress.map(([hymn, data]) => (
                <tr key={hymn} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold mr-3 border border-green-100">
                        {hymn.replace(/\D/g, '') || '#'}
                      </div>
                      <span className="font-bold text-slate-800">{hymn}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                      {data.count}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {data.students.map(name => (
                        <span key={name} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded">
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
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <Library className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400">Nenhum hino registrado</h3>
          <p className="text-slate-500">Os hinos aparecerão conforme os alunos os dominarem nas aulas.</p>
        </div>
      )}
    </div>
  );
};

export default HymnsView;
