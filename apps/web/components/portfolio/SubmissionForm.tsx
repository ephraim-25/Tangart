'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

interface SubmissionFormProps {
  studentId: string;
}

export function SubmissionForm({ studentId }: SubmissionFormProps) {
  const [fileUrl, setFileUrl] = useState('');
  const [isPublicGallery, setPublicGallery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/portfolio/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, fileUrl, isPublicGallery }),
      });
      if (response.ok) {
        setSuccess(true);
        setFileUrl('');
        setPublicGallery(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#333] p-6 rounded-xl text-white max-w-lg shadow-2xl">
      <h3 className="text-xl font-serif text-[#D4AF37] mb-2">Soumettre un Projet</h3>
      <p className="text-sm text-gray-400 mb-6">Déposez votre création pour obtenir le retour de votre professeur.</p>
      
      {success ? (
        <div className="bg-green-900/40 text-green-400 border border-green-800 p-4 rounded text-center">
          Superbe travail ! Votre portfolio a été soumis avec succès.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block">Lien du fichier ou de l'image (URL)</label>
            <input 
              type="url" 
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://votre-image.com/..."
              className="w-full bg-[#111] border border-[#333] text-white rounded p-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#333] rounded-lg hover:bg-[#111] transition-colors">
            <input 
              type="checkbox" 
              checked={isPublicGallery}
              onChange={(e) => setPublicGallery(e.target.checked)}
              className="w-5 h-5 text-[#D4AF37] rounded border-[#444] focus:ring-[#D4AF37] focus:ring-2 bg-[#222]" 
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Exposer dans la Galerie Publique</span>
              <span className="text-xs text-gray-500">Permet aux autres élèves de s'inspirer de votre travail</span>
            </div>
          </label>

          <button 
            type="submit" 
            disabled={loading || !fileUrl}
            className="w-full bg-[#D4AF37] text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#F2D675] disabled:opacity-50 disabled:hover:bg-[#D4AF37] transition-colors"
          >
            <Upload size={18} />
            {loading ? 'Envoi en cours...' : 'Envoyer le projet'}
          </button>
        </form>
      )}
    </div>
  );
}
