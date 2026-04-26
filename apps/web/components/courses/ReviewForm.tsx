'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  courseId: string;
  authorId: string;
}

export function ReviewForm({ courseId, authorId }: ReviewFormProps) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (stars === 0) {
      setError('Veuillez sélectionner une note.');
      return;
    }
    
    if (stars < 3 && !comment.trim()) {
      setError('Un commentaire est obligatoire pour les notes inférieures à 3.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, stars, comment, authorId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la note');
      }

      setSuccess(true);
      setStars(0);
      setComment('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-6 max-w-lg w-full text-white shadow-2xl">
      <h3 className="text-xl font-serif text-[#D4AF37] mb-4">Évaluez ce cours</h3>
      
      {success && (
        <div className="bg-green-900/40 text-green-400 border border-green-800 p-3 rounded mb-4 text-sm">
          Merci pour votre retour ! Votre note a bien été enregistrée.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((idx) => (
            <button
              key={idx}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => setStars(idx)}
              onMouseEnter={() => setHover(idx)}
              onMouseLeave={() => setHover(0)}
            >
              <Star 
                className={`w-8 h-8 ${
                  idx <= (hover || stars) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'
                } transition-colors duration-200`}
              />
            </button>
          ))}
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={stars > 0 && stars < 3 ? "Oups ! Dites-nous ce qui n'allait pas (obligatoire)..." : "Laissez un commentaire (optionnel)..."}
          className="w-full bg-[#111] border border-[#333] text-white rounded p-3 text-sm focus:outline-none focus:border-[#D4AF37] h-24 resize-none transition-colors"
        />

        <button 
          type="submit" 
          disabled={stars === 0}
          className="bg-[#D4AF37] text-black font-semibold py-2 px-6 rounded hover:bg-[#F2D675] disabled:opacity-50 disabled:hover:bg-[#D4AF37] transition-all"
        >
          Envoyer la note
        </button>
      </form>
    </div>
  );
}
