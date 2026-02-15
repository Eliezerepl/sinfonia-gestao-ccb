
import React, { useState } from 'react';
import { Student, Lesson, LearningPhase } from '../types';
import { Calendar, ChevronLeft, CheckCircle, Clock, BookOpen, Music, Star, Edit3, PlusCircle, FileText, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onAddLesson: () => void;
  onToggleOrchestra: () => void;
  onUpdatePhase: (phase: LearningPhase) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  onBack,
  onAddLesson,
  onToggleOrchestra,
  onUpdatePhase
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(59, 130, 246); // Blue-600
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Relatorio Individual do Aluno', 15, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`, 15, 30);

    // Student Info Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(student.name, 15, 55);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const info = [
      ['Instrumento:', student.instrument],
      ['Fase Atual:', student.phase],
      ['Data de Matricula:', new Date(student.enrollmentDate).toLocaleDateString('pt-BR')],
      ['Status Orquestra:', student.isOrchestraReady ? 'APTO' : 'EM ESTUDO']
    ];

    autoTable(doc, {
      startY: 60,
      head: [],
      body: info,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });

    // Summary Stats
    const totalExercises = student.lessons.reduce((acc, curr) => acc + curr.exercisesMastered.length, 0);
    const totalHymns = student.lessons.reduce((acc, curr) => acc + curr.hymnsMastered.length, 0);

    doc.setFontSize(14);
    doc.text('Resumo de Aproveitamento', 15, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Metrica', 'Total Realizado']],
      body: [
        ['Total de Aulas', student.lessons.length.toString()],
        ['Exercicios Dominados', totalExercises.toString()],
        ['Hinos Dominados', totalHymns.toString()]
      ],
      headStyles: { fillColor: [71, 85, 105] }
    });

    // Evolution Data Table
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Historico de Avaliacoes Tecnicas', 15, 20);

    const evaluationData = student.lessons
      .filter(l => l.evaluation)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(l => [
        new Date(l.date).toLocaleDateString('pt-BR'),
        l.evaluation?.technique.toString() || '-',
        l.evaluation?.rhythm.toString() || '-',
        l.evaluation?.reading.toString() || '-'
      ]);

    autoTable(doc, {
      startY: 25,
      head: [['Data', 'Tecnica', 'Ritmo', 'Leitura']],
      body: evaluationData,
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Detailed Lessons History
    doc.setFontSize(14);
    doc.text('Detalhes das Ultimas Aulas', 15, (doc as any).lastAutoTable.finalY + 15);

    const lessonDetails = student.lessons
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(l => [
        new Date(l.date).toLocaleDateString('pt-BR'),
        l.present ? 'Presente' : 'Faltou',
        l.observation || '-',
        [...l.exercisesMastered, ...l.hymnsMastered.map(h => `Hino ${h}`)].join(', ') || '-'
      ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Data', 'Presenca', 'Observacoes', 'Conteudo Dominado']],
      body: lessonDetails,
      headStyles: { fillColor: [15, 23, 42] },
      columnStyles: { 2: { cellWidth: 50 }, 3: { cellWidth: 60 } }
    });

    // Footer on each page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Sinfonia CCB - Gestao Musical | Pagina ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save(`Relatorio_${student.name.replace(/\s+/g, '_')}.pdf`);
  };
  const chartData = student.lessons
    .filter(l => l.evaluation)
    .map(l => ({
      date: new Date(l.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      técnica: l.evaluation?.technique,
      ritmo: l.evaluation?.rhythm,
      leitura: l.evaluation?.reading,
    }));

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Voltar para lista
        </button>

        <button
          onClick={generatePDF}
          className="flex items-center bg-white text-slate-700 px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <Download className="w-4 h-4 mr-2" /> PDF Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4 border-4 border-blue-50">
              {student.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{student.name}</h2>
            <p className="text-blue-600 font-medium mb-6 flex items-center justify-center">
              <Music className="w-4 h-4 mr-2" /> {student.instrument}
            </p>

            <div className="flex flex-col gap-3">
              <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Fase Atual</label>
                <div className="relative group">
                  <GraduationCap className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <select
                    value={student.phase}
                    onChange={(e) => onUpdatePhase(e.target.value as LearningPhase)}
                    className="w-full bg-transparent font-semibold text-slate-800 outline-none pl-6 appearance-none cursor-pointer"
                  >
                    {Object.values(LearningPhase).map(ph => (
                      <option key={ph} value={ph}>{ph}</option>
                    ))}
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Data de Início</p>
                <div className="flex items-center font-semibold text-slate-800">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {new Date(student.enrollmentDate).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleOrchestra}
              className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-all ${student.isOrchestraReady
                ? 'bg-amber-100 text-amber-700 border-2 border-amber-200 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200'
                }`}
            >
              <Star className={`w-5 h-5 mr-2 ${student.isOrchestraReady ? 'fill-current' : ''}`} />
              {student.isOrchestraReady ? 'Apto para Orquestra' : 'Marcar como Apto'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Domínio de Métodos
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Exercícios Concluídos</span>
                  <span className="font-bold text-blue-600">
                    {student.lessons.reduce((acc, curr) => acc + curr.exercisesMastered.length, 0)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Hinos Aprendidos</span>
                  <span className="font-bold text-green-600">
                    {student.lessons.reduce((acc, curr) => acc + curr.hymnsMastered.length, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History & Evolution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" /> Evolução Técnica
            </h3>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="técnica" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="ritmo" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="leitura" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <p>Sem dados de avaliação suficientes.</p>
                </div>
              )}
            </div>
          </div>

          {/* Lessons History */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-blue-500" /> Histórico de Aulas
              </h3>
              <button
                onClick={onAddLesson}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Nova Aula
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {student.lessons.length > 0 ? (
                student.lessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(lesson => (
                  <div key={lesson.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <span className="font-bold text-slate-900 mr-3">
                          {new Date(lesson.date).toLocaleDateString('pt-BR')}
                        </span>
                        {lesson.present ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">PRESENTE</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">FALTOU</span>
                        )}
                      </div>
                    </div>

                    {lesson.present && (
                      <>
                        <p className="text-slate-600 text-sm mb-3 italic">"{lesson.observation}"</p>
                        <div className="flex flex-wrap gap-2">
                          {lesson.exercisesMastered.map(ex => (
                            <span key={ex} className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-100 uppercase font-bold">
                              Ex: {ex}
                            </span>
                          ))}
                          {lesson.hymnsMastered.map(hy => (
                            <span key={hy} className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full border border-green-100 uppercase font-bold">
                              Hino: {hy}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Nenhuma aula registrada ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GraduationCap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

export default StudentProfile;
