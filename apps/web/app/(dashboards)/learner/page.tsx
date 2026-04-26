'use client';

import { useState } from 'react';
import { PlayCircle, Award, Image as ImageIcon, Star } from 'lucide-react';
import { CertificateDownload } from '@/components/certifications/CertificateDownload';

// Mock data
const enrolledCourses = [
  { id: 1, title: 'Maîtrise de la Perspective', progress: 75, lastChapter: 'Lignes d\'horizon', img: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'Peinture Digitale Avancée', progress: 100, lastChapter: 'Masterpiece', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=400' },
];

const completedProjects = [
  { id: 1, course: 'Peinture Digitale', status: 'Corrigé', grade: 4, feedback: 'Très bel usage des calques de fusion. Attention aux contrastes sur le visage.', imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=200' },
  { id: 2, course: 'Perspective', status: 'En attente', grade: null, feedback: null, imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=200' },
];

export default function LearnerDashboard() {
  return (
    <div className="p-8 space-y-12 bg-[#0A0A0A] min-h-screen text-white">
      <div className="border-b border-[#333] pb-4">
        <h1 className="text-3xl font-serif text-[#D4AF37] uppercase tracking-widest">Le Studio Personnel</h1>
        <p className="text-gray-400">Votre espace d'apprentissage • Tang'Art</p>
      </div>

      <section>
        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
          <PlayCircle className="text-[#D4AF37]" /> En Cours d'Apprentissage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map(course => (
            <div key={course.id} className="group relative bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-xl hover:border-[#D4AF37]/50 transition-colors cursor-pointer">
              <div className="h-40 w-full overflow-hidden relative">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-lg font-bold text-white shadow-black drop-shadow-md">{course.title}</h3>
                  <p className="text-sm text-[#D4AF37] font-semibold drop-shadow-md">{course.lastChapter}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Progression</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-1.5">
                  <div className="bg-[#D4AF37] h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
            <Award className="text-[#D4AF37]" /> Mes Succès (Certificats)
          </h2>
          <div className="space-y-4">
            {enrolledCourses.filter(c => c.progress === 100).map(course => (
              <div key={course.id} className="relative">
                <CertificateDownload studentId="STUDENT_MOCK_ID" courseId={course.id.toString()} />
              </div>
            ))}
            {enrolledCourses.filter(c => c.progress === 100).length === 0 && (
              <p className="text-gray-500 text-sm">Terminez un cours à 100% pour obtenir votre premier certificat Prestige.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
            <ImageIcon className="text-[#D4AF37]" /> Suivi des Projets (Galerie)
          </h2>
          <div className="space-y-4">
            {completedProjects.map(proj => (
              <div key={proj.id} className="bg-[#1A1813] border border-[#333] p-4 rounded-xl flex gap-4">
                <img src={proj.imageUrl} alt="Projet" className="w-24 h-24 object-cover rounded border border-[#444]" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{proj.course}</h4>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${proj.status === 'Corrigé' ? 'bg-[#D4AF37] text-black' : 'bg-[#222] text-gray-400 border border-[#444]'}`}>
                      {proj.status}
                    </span>
                  </div>
                  {proj.status === 'Corrigé' ? (
                    <div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star key={star} size={14} className={star <= (proj.grade || 0) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-300 italic">"{proj.feedback}"</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Votre professeur n'a pas encore corrigé cette œuvre. Un peu de patience !</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
