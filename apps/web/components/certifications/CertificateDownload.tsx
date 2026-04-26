'use client';

import { useState } from 'react';
import { Award, Download } from 'lucide-react';

interface CertificateDownloadProps {
  studentId: string;
  courseId: string;
}

export function CertificateDownload({ studentId, courseId }: CertificateDownloadProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/certifications/${courseId}/${studentId}/download`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      // Create a blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Certificat_TangArt.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Impossible de télécharger le certificat. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1813] to-[#0A0A0A] border border-[#D4AF37]/30 rounded-xl p-8 max-w-lg text-center shadow-[0_0_40px_rgba(212,175,55,0.1)]">
      <div className="flex justify-center mb-6">
        <div className="bg-[#D4AF37]/10 p-4 rounded-full border border-[#D4AF37]/50">
          <Award className="w-12 h-12 text-[#D4AF37]" />
        </div>
      </div>
      <h3 className="text-2xl font-serif text-[#D4AF37] mb-2 uppercase tracking-widest">Félicitations</h3>
      <p className="text-[#E8DCC4] mb-8 font-light text-sm">
        Vous avez terminé cette formation avec succès. Obtenez votre certificat d'accomplissement prestige.
      </p>
      
      <button 
        onClick={handleDownload}
        disabled={loading}
        className="w-full bg-[#D4AF37] text-black font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-[#F2D675] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
      >
        <Download size={20} />
        {loading ? 'Génération du PDF...' : 'Télécharger le Certificat (PDF)'}
      </button>
    </div>
  );
}
