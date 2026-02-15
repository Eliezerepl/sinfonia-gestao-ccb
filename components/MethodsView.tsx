
import React, { useMemo } from 'react';
import { Student } from '../types';
import { BookOpen, Search, User } from 'lucide-react';

interface MethodsViewProps {
  students: Student[];
}

const MethodsView: React.FC<MethodsViewProps> = ({ students }) => {
  const methodProgress = useMemo(() => {
    const progressMap: Record<string, { students: string[], count: number }> = {};
    
    students.forEach(student => {
      const allMastered = student.lessons.flatMap(l => l.exercisesMastered);
      const uniqueMastered = Array.from(new Set(allMastered));
      
      // Explicitly type exercise as string to avoid index type errors
      uniqueMastered.forEach((exercise: string) => {
        if (!progressMap[exercise]) {
          progressMap[exercise] = { students: [], count: 0 };
        }
        progressMap[exercise].students.push(student.name);
        progressMap[exercise].count++;
      });
    });
    
    return Object.entries(progressMap)
      .sort((a, b) => b[1].count - a[1].count);
  }, [students]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Acompanhamento de Métodos</h2>
          <p className="text-slate-500">Exercícios dominados pelos alunos</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          {methodProgress.length} Exercícios Diferentes
        </div>
      </div>

      {methodProgress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodProgress.map(([exercise, data]) => (
            <div key={exercise} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800">{exercise}</h3>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                  {data.count} Alunos
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Estudando:</p>
                <div className="flex flex-wrap gap-2">
                  {data.students.map(name => (
                    <span key={name} className="flex items-center text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <User className="w-3 h-3 mr-1 text-slate-400" />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400">Nenhum exercício registrado</h3>
          <p className="text-slate-500">Comece registrando aulas para ver o progresso aqui.</p>
        </div>
      )}
    </div>
  );
};

export default MethodsView;
