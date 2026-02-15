
import React, { useState } from 'react';
import { Student } from '../types';
import { Users, Music, Star, Search, Filter } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  availableInstruments: string[];
}

const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent, availableInstruments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstrument, setFilterInstrument] = useState<string>('All');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstrument = filterInstrument === 'All' || s.instrument === filterInstrument;
    return matchesSearch && matchesInstrument;
  });

  const instruments = ['All', ...availableInstruments];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar aluno por nome..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-slate-400 w-5 h-5" />
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={filterInstrument}
            onChange={(e) => setFilterInstrument(e.target.value)}
          >
            {instruments.map(inst => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            onClick={() => onSelectStudent(student)}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</h3>
                  <p className="text-xs text-slate-500">{student.instrument}</p>
                </div>
              </div>
              {student.isOrchestraReady && (
                <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full" title="Apto para Orquestra">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-xs font-medium">
                {student.phase}
              </span>
              <span className={`text-xs font-medium ${student.active ? 'text-green-600' : 'text-red-500'}`}>
                {student.active ? '● Ativo' : '● Inativo'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhum aluno encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default StudentList;
