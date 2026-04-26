'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Users, TrendingUp, Power, CheckCircle, XCircle } from 'lucide-react';

const mockData = [
  { name: 'Lun', sales: 4000, platform: 320 },
  { name: 'Mar', sales: 3000, platform: 240 },
  { name: 'Mer', sales: 2000, platform: 160 },
  { name: 'Jeu', sales: 2780, platform: 222 },
  { name: 'Ven', sales: 1890, platform: 151 },
  { name: 'Sam', sales: 2390, platform: 191 },
  { name: 'Dim', sales: 3490, platform: 279 },
];

const mockAlerts = [
  { id: 1, course: 'Peinture Digitale Avancée', teacher: 'Sarah DaVinci', avg: 3.2, dropoff: '45% au Chapitre 2' },
];

export default function AdminDashboard() {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Maîtrise de la Perspective', suspended: false },
    { id: 2, title: 'Peinture Digitale Avancée', suspended: false },
  ]);

  const toggleSuspend = (id: number) => {
    // In real app, calls API which sends email and updates DB
    setCourses(courses.map(c => c.id === id ? { ...c, suspended: !c.suspended } : c));
  };

  return (
    <div className="p-8 space-y-8 bg-[#0A0A0A] min-h-screen text-white">
      <div className="flex justify-between items-end border-b border-[#333] pb-4">
        <div>
          <h1 className="text-3xl font-serif text-[#D4AF37] uppercase tracking-widest">Le Trône</h1>
          <p className="text-gray-400">Poste de contrôle Super-Admin • Tang'Art</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <TrendingUp className="text-[#D4AF37]" />
            <h3 className="text-gray-400 font-medium">Revenu Net Plateforme (8%)</h3>
          </div>
          <p className="text-3xl font-bold">$1,563.00</p>
        </div>
        <div className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <Users className="text-[#D4AF37]" />
            <h3 className="text-gray-400 font-medium">Inscriptions Actives</h3>
          </div>
          <p className="text-3xl font-bold">1,204</p>
        </div>
        <div className="bg-[#2A1111] border border-[#552222] p-6 rounded-xl shadow-xl">
          <div className="flex items-center gap-4 mb-2">
            <ShieldAlert className="text-red-400" />
            <h3 className="text-red-400 font-medium">Alertes Qualité</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">1</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-xl">
        <h3 className="text-xl font-serif text-[#D4AF37] mb-6">Volume Financier (Revenus vs Part Tang'Art)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" name="Ventes Brutes" />
              <Area type="monotone" dataKey="platform" stroke="#D4AF37" fillOpacity={1} fill="url(#colorPlatform)" name="Commission 8%" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1A1813] border border-[#D4AF37]/30 p-6 rounded-xl shadow-xl">
          <h3 className="text-xl font-serif text-[#D4AF37] mb-6 flex items-center gap-2">
            <ShieldAlert size={20} /> Dark Business : Alertes & Rétention
          </h3>
          <div className="space-y-4">
            {mockAlerts.map(alert => (
              <div key={alert.id} className="bg-[#111] border border-[#333] p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white">{alert.course}</h4>
                  <span className="bg-red-900/50 text-red-400 px-2 py-1 rounded text-xs font-bold">{alert.avg}/5</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Prof. {alert.teacher}</p>
                <p className="text-sm text-yellow-500 font-semibold bg-yellow-900/20 inline-block px-2 py-1 rounded">
                  ⚠️ Taux d'abandon critique : {alert.dropoff}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#552222] p-6 rounded-xl shadow-xl">
          <h3 className="text-xl font-serif text-red-500 mb-6 flex items-center gap-2">
            <Power size={20} /> Le "Kill Switch"
          </h3>
          <p className="text-sm text-gray-400 mb-6">Suspend immédiatement un cours. Les achats existants restent actifs, mais toute nouvelle vente est bloquée. Un email est envoyé au professeur.</p>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="flex justify-between items-center bg-[#0A0A0A] p-4 rounded-lg border border-[#333]">
                <span className={course.suspended ? 'text-gray-500 line-through' : 'text-white'}>{course.title}</span>
                <button 
                  onClick={() => toggleSuspend(course.id)}
                  className={`px-4 py-2 rounded text-sm font-bold transition-all ${
                    course.suspended ? 'bg-[#333] hover:bg-[#444] text-white' : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  }`}
                >
                  {course.suspended ? 'Réactiver' : 'SUSPENDRE'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
