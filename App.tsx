
import React, { useState, useEffect, useMemo } from 'react';
import { Student, Teacher, InstrumentEntity, MethodEntity, LearningPhase } from './types';
import { storageService } from './services/storageService';
import {
  Users,
  UserCheck,
  Music,
  Star,
  Plus,
  LayoutDashboard,
  BookOpen,
  Library,
  Settings,
  Book
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import StudentList from './components/StudentList';
import StudentProfile from './components/StudentProfile';
import NewLessonModal from './components/NewLessonModal';
import NewStudentModal from './components/NewStudentModal';
import MethodsView from './components/MethodsView';
import HymnsView from './components/HymnsView';
import InstrumentsView from './components/InstrumentsView';
import MethodsManagementView from './components/MethodsManagementView';
import TeachersView from './components/TeachersView';

type ViewState = 'dashboard' | 'methods_progress' | 'hymns' | 'instruments' | 'methods_management' | 'teachers';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [instruments, setInstruments] = useState<InstrumentEntity[]>([]);
  const [methods, setMethods] = useState<MethodEntity[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isNewLessonModalOpen, setIsNewLessonModalOpen] = useState(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [s, t, i, m] = await Promise.all([
        storageService.getStudents(),
        storageService.getTeachers(),
        storageService.getInstruments(),
        storageService.getMethods()
      ]);
      setStudents(s);
      setTeachers(t);
      setInstruments(i);
      setMethods(m);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const active = students.filter(s => s.active).length;
    const ready = students.filter(s => s.isOrchestraReady).length;

    return {
      total: students.length,
      active,
      ready
    };
  }, [students]);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const handleAddLesson = async (lessonData: any) => {
    if (!selectedStudentId) return;

    try {
      await storageService.addLesson(selectedStudentId, lessonData);
      await loadData(); // Refresh data
      setIsNewLessonModalOpen(false);
    } catch (error) {
      alert('Erro ao salvar lição');
    }
  };

  const handleToggleOrchestra = async () => {
    if (!selectedStudentId || !selectedStudent) return;
    try {
      const newStatus = !selectedStudent.isOrchestraReady;
      await storageService.updateStudentOrchestraStatus(selectedStudentId, newStatus);
      setStudents(prev => prev.map(s =>
        s.id === selectedStudentId ? { ...s, isOrchestraReady: newStatus } : s
      ));
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const handleAddNewStudent = async (studentData: any) => {
    try {
      await storageService.saveStudent(studentData);
      await loadData();
      setIsNewStudentModalOpen(false);
    } catch (error) {
      alert('Erro ao salvar aluno');
    }
  };

  const handleAddInstrument = async (inst: Omit<InstrumentEntity, 'id'>) => {
    try {
      await storageService.saveInstrument(inst);
      await loadData();
    } catch (error) {
      alert('Erro ao salvar instrumento');
    }
  };

  const handleDeleteInstrument = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este instrumento?')) {
      try {
        await storageService.deleteInstrument(id);
        await loadData();
      } catch (error) {
        alert('Erro ao excluir instrumento');
      }
    }
  };

  const handleAddMethod = async (m: Omit<MethodEntity, 'id'>) => {
    try {
      await storageService.saveMethod(m);
      await loadData();
    } catch (error) {
      alert('Erro ao salvar método');
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este método?')) {
      try {
        await storageService.deleteMethod(id);
        await loadData();
      } catch (error) {
        alert('Erro ao excluir método');
      }
    }
  };

  const handleAddTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    try {
      await storageService.saveTeacher(teacher);
      await loadData();
    } catch (error) {
      alert('Erro ao salvar professor');
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este professor?')) {
      try {
        await storageService.deleteTeacher(id);
        await loadData();
      } catch (error) {
        alert('Erro ao excluir professor');
      }
    }
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    setSelectedStudentId(null);
  };

  const renderContent = () => {
    if (selectedStudent) {
      return (
        <StudentProfile
          student={selectedStudent}
          onBack={() => setSelectedStudentId(null)}
          onAddLesson={() => setIsNewLessonModalOpen(true)}
          onToggleOrchestra={handleToggleOrchestra}
        />
      );
    }

    switch (currentView) {
      case 'methods_progress':
        return <MethodsView students={students} />;
      case 'hymns':
        return <HymnsView students={students} />;
      case 'instruments':
        return <InstrumentsView
          instruments={instruments}
          onAdd={handleAddInstrument}
          onDelete={handleDeleteInstrument}
        />;
      case 'methods_management':
        return <MethodsManagementView
          methods={methods}
          onAdd={handleAddMethod}
          onDelete={handleDeleteMethod}
        />;
      case 'teachers':
        return <TeachersView
          teachers={teachers}
          availableInstruments={instruments.map(i => i.name)}
          onAdd={handleAddTeacher}
          onDelete={handleDeleteTeacher}
        />;
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dashboard View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Alunos Ativos"
                value={stats.active}
                icon={<UserCheck className="w-6 h-6" />}
                color="bg-blue-500"
              />
              <StatsCard
                title="Total de Alunos"
                value={stats.total}
                icon={<Users className="w-6 h-6" />}
                color="bg-slate-700"
              />
              <StatsCard
                title="Aptos p/ Orquestra"
                value={stats.ready}
                icon={<Star className="w-6 h-6" />}
                color="bg-amber-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <LayoutDashboard className="w-5 h-5 mr-2 text-blue-600" /> Lista de Alunos
              </h2>
            </div>

            <StudentList
              students={students}
              onSelectStudent={(s) => setSelectedStudentId(s.id)}
              availableInstruments={instruments.map(i => i.name)}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('dashboard')}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Music className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sinfonia <span className="text-blue-600">CCB</span></h1>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-1">
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'dashboard' && !selectedStudentId ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Dashboard
                </button>
                <div className="relative group">
                  <button
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${(currentView === 'methods_progress' || currentView === 'methods_management') ? 'text-blue-600' : 'text-slate-500'}`}
                  >
                    Métodos <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40 overflow-hidden">
                    <button onClick={() => navigateTo('methods_progress')} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-600 font-medium">Progresso Alunos</button>
                    <button onClick={() => navigateTo('methods_management')} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-600 font-medium border-t border-slate-50">Cadastro Métodos</button>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('hymns')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'hymns' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Hinos
                </button>
                <button
                  onClick={() => navigateTo('instruments')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'instruments' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Instrumentos
                </button>
                <button
                  onClick={() => navigateTo('teachers')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'teachers' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Professores
                </button>
              </nav>
              <button
                onClick={() => setIsNewStudentModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center shadow-lg shadow-blue-100"
              >
                <Plus className="w-4 h-4 mr-2" /> Novo Aluno
              </button>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden flex items-center space-x-1">
              <button onClick={() => navigateTo('methods_management')} className={`p-2 rounded-lg ${currentView === 'methods_management' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}>
                <Book className="w-5 h-5" />
              </button>
              <button onClick={() => navigateTo('instruments')} className={`p-2 rounded-lg ${currentView === 'instruments' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}>
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={() => setIsNewStudentModalOpen(true)} className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modals */}
      {isNewLessonModalOpen && (
        <NewLessonModal
          onClose={() => setIsNewLessonModalOpen(false)}
          onSave={handleAddLesson}
        />
      )}

      {isNewStudentModalOpen && (
        <NewStudentModal
          teachers={teachers}
          availableInstruments={instruments.map(i => i.name)}
          onClose={() => setIsNewStudentModalOpen(false)}
          onSave={handleAddNewStudent}
        />
      )}

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center">
            Sistema de Gestão Musical <Music className="w-3 h-3 mx-1 text-blue-500" /> Versão 1.2.0
          </p>
        </div>
      </footer>
    </div>
  );
};

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);

export default App;
