
import React, { useState, useEffect, useMemo } from 'react';
import { Student, Teacher, InstrumentEntity, MethodEntity, LearningPhase, Lesson } from './types';
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
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);
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
      if (lessonToEdit) {
        await storageService.updateLesson(lessonToEdit.id, lessonData);
      } else {
        await storageService.addLesson(selectedStudentId, lessonData);
      }
      await loadData(); // Refresh data
      setIsNewLessonModalOpen(false);
      setLessonToEdit(null);
    } catch (error) {
      alert('Erro ao salvar lição');
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonToEdit(lesson);
    setIsNewLessonModalOpen(true);
  };

  const handleDeleteLesson = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este registro de aula?')) {
      try {
        await storageService.deleteLesson(id);
        await loadData();
      } catch (error) {
        alert('Erro ao excluir aula');
      }
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

  const handleUpdateStudentPhase = async (phase: LearningPhase) => {
    if (!selectedStudentId) return;
    try {
      await storageService.updateStudentPhase(selectedStudentId, phase);
      setStudents(prev => prev.map(s =>
        s.id === selectedStudentId ? { ...s, phase } : s
      ));
    } catch (error) {
      alert('Erro ao atualizar fase');
    }
  };

  const handleAddNewStudent = async (studentData: any) => {
    try {
      if (studentToEdit) {
        await storageService.updateStudent(studentToEdit.id, studentData);
      } else {
        await storageService.saveStudent(studentData);
      }
      await loadData();
      setIsNewStudentModalOpen(false);
      setStudentToEdit(null);
    } catch (error) {
      alert('Erro ao salvar aluno');
    }
  };

  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsNewStudentModalOpen(true);
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

  const handleUpdateTeacher = async (id: string, teacher: Partial<Teacher>) => {
    try {
      await storageService.updateTeacher(id, teacher);
      await loadData();
    } catch (error) {
      alert('Erro ao atualizar professor');
    }
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    setSelectedStudentId(null);
  };

  const SidebarItem: React.FC<{ view: ViewState; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => {
    const isActive = currentView === view && !selectedStudentId;
    return (
      <button
        onClick={() => navigateTo(view)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 font-semibold'
          : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 group'
          }`}
      >
        <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </button>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (selectedStudent) {
      return (
        <StudentProfile
          student={selectedStudent}
          onBack={() => setSelectedStudentId(null)}
          onAddLesson={() => setIsNewLessonModalOpen(true)}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
          onEditStudent={handleEditStudent}
          onToggleOrchestra={handleToggleOrchestra}
          onUpdatePhase={handleUpdateStudentPhase}
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
          availableInstruments={instruments.map(i => i.name)}
          onAdd={handleAddMethod}
          onDelete={handleDeleteMethod}
        />;
      case 'teachers':
        return <TeachersView
          teachers={teachers}
          availableInstruments={instruments.map(i => i.name)}
          onAdd={handleAddTeacher}
          onUpdate={handleUpdateTeacher}
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigateTo('dashboard')}
          >
            <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-100">
              <Music className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Sinfonia <span className="text-blue-600">CCB</span></h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Gestão Musical</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Principal</div>
          <SidebarItem view="dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />

          <div className="pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Cadastros</div>
          <SidebarItem view="teachers" icon={<Users className="w-5 h-5" />} label="Professores" />
          <SidebarItem view="instruments" icon={<Settings className="w-5 h-5" />} label="Instrumentos" />
          <SidebarItem view="methods_management" icon={<BookOpen className="w-5 h-5" />} label="Métodos" />

          <div className="pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Acompanhamento</div>
          <SidebarItem view="methods_progress" icon={<Library className="w-5 h-5" />} label="Progresso Alunos" />
          <SidebarItem view="hymns" icon={<Music className="w-5 h-5" />} label="Hinos" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setIsNewStudentModalOpen(true)}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" /> Novo Aluno
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-30 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2" onClick={() => navigateTo('dashboard')}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Music className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900">Sinfonia CCB</span>
            </div>
            <button
              onClick={() => setIsNewStudentModalOpen(true)}
              className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bg-white border-t border-slate-200 sticky bottom-0 z-30 flex justify-around p-2">
          <button onClick={() => navigateTo('dashboard')} className={`p-2 flex flex-col items-center ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] mt-1">Home</span>
          </button>
          <button onClick={() => navigateTo('teachers')} className={`p-2 flex flex-col items-center ${currentView === 'teachers' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Users className="w-6 h-6" />
            <span className="text-[10px] mt-1">Prof</span>
          </button>
          <button onClick={() => navigateTo('instruments')} className={`p-2 flex flex-col items-center ${currentView === 'instruments' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Settings className="w-6 h-6" />
            <span className="text-[10px] mt-1">Inst</span>
          </button>
          <button onClick={() => navigateTo('methods_progress')} className={`p-2 flex flex-col items-center ${currentView === 'methods_progress' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Library className="w-6 h-6" />
            <span className="text-[10px] mt-1">Prog</span>
          </button>
        </nav>

        <footer className="hidden md:block py-6 px-8 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500 flex items-center justify-center">
            Sistema de Gestão Musical <Music className="w-3 h-3 mx-1 text-blue-500" /> Versão 1.3.0
          </p>
        </footer>
      </div>

      {/* Modals */}
      {isNewLessonModalOpen && (
        <NewLessonModal
          methods={methods}
          studentInstrument={selectedStudent?.instrument}
          lessonToEdit={lessonToEdit}
          onClose={() => {
            setIsNewLessonModalOpen(false);
            setLessonToEdit(null);
          }}
          onSave={handleAddLesson}
        />
      )}

      {isNewStudentModalOpen && (
        <NewStudentModal
          teachers={teachers}
          studentToEdit={studentToEdit}
          availableInstruments={instruments.map(i => i.name)}
          onClose={() => {
            setIsNewStudentModalOpen(false);
            setStudentToEdit(null);
          }}
          onSave={handleAddNewStudent}
        />
      )}
    </div>
  );
};

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);

export default App;
