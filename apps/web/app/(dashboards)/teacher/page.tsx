'use client';

import { useState } from 'react';
import { DollarSign, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';

const mockTransactions = [
  { id: 1, date: 'Aujourd\'hui, 14:30', course: 'Maîtrise de la Perspective', amount: 138.00 },
  { id: 2, date: 'Hier, 09:15', course: 'Peinture Digitale Avancée', amount: 184.00 },
  { id: 3, date: '15 Avril, 18:00', course: 'Maîtrise de la Perspective', amount: 138.00 },
];

const mockSubmissions = [
  { id: 1, student: 'Elias P.', course: 'Peinture Digitale', date: 'il y a 2h', imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=200' },
  { id: 2, student: 'Marie L.', course: 'Perspective', date: 'il y a 5h', imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=200' },
];

export default function TeacherDashboard() {
  return (
    <div className="p-8 space-y-8 bg-[#0A0A0A] min-h-screen text-white">
      <div className="border-b border-[#333] pb-4">
        <h1 className="text-3xl font-serif text-[#D4AF37] uppercase tracking-widest">Le Studio</h1>
        <p className="text-gray-400">Espace Enseignant • Tang'Art</p>
      </div>

      <div className="bg-gradient-to-br from-[#1A1813] to-[#0A0A0A] border border-[#D4AF37]/30 p-8 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.05)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-gray-400 font-medium mb-1 flex items-center gap-2">
            <DollarSign size={18} className="text-[#D4AF37]" /> Wallet USD (Net 92%)
          </h2>
          <p className="text-5xl font-bold text-white">$4,285<span className="text-xl text-gray-500">.50</span></p>
        </div>
        <button className="bg-[#D4AF37] text-black font-semibold py-3 px-8 rounded-lg hover:bg-[#F2D675] hover:scale-105 transition-all">
          Retirer vers Flutterwave
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-xl">
          <h3 className="text-xl font-serif text-[#E8DCC4] mb-6 flex items-center justify-between">
            Dernières Ventes
            <button className="text-sm text-[#D4AF37] font-sans flex items-center gap-1 hover:underline">
              Tout voir <ArrowRight size={14} />
            </button>
          </h3>
          <div className="space-y-4">
            {mockTransactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center bg-[#0A0A0A] p-4 rounded-lg border border-[#222] hover:border-[#333] transition-colors">
                <div>
                  <p className="font-semibold text-gray-200">{tx.course}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#D4AF37]">+{tx.amount}$</p>
                  <p className="text-xs text-gray-600">Net Prof.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#333] p-6 rounded-xl shadow-xl">
          <h3 className="text-xl font-serif text-[#E8DCC4] mb-6 flex items-center justify-between">
            Boîte de Réception (Corrections)
            <span className="bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded-full">
              {mockSubmissions.length} en attente
            </span>
          </h3>
          <div className="space-y-4">
            {mockSubmissions.map(sub => (
              <div key={sub.id} className="flex items-center gap-4 bg-[#0A0A0A] p-3 rounded-lg border border-[#222]">
                <img src={sub.imageUrl} alt="Projet" className="w-16 h-16 object-cover rounded shadow-md border border-[#333]" />
                <div className="flex-1">
                  <p className="font-semibold text-white">{sub.student}</p>
                  <p className="text-xs text-[#D4AF37]">{sub.course}</p>
                  <p className="text-xs text-gray-500">{sub.date}</p>
                </div>
                <button className="w-10 h-10 flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37] rounded hover:bg-[#D4AF37]/20 transition-colors">
                  <MessageCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
