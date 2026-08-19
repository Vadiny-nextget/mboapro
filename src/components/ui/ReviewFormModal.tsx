import { useState } from 'react';
import { Star, X } from 'lucide-react';
import clsx from 'clsx';
import { orderService } from '../../services/orderService';
import { ApiError } from '../../types/api.types';
import { Button } from './Input';

export default function ReviewFormModal({ orderId, serviceTitle, onClose, onSubmitted }: { orderId: string; serviceTitle: string; onClose: () => void; onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Sélectionnez une note.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await orderService.submitReview(orderId, rating, comment || undefined);
      onSubmitted();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-gray-950/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-primary">Noter la prestation</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <p className="mb-3 text-sm text-secondary">{serviceTitle}</p>

        <div className="mb-4 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n} étoiles`}>
              <Star size={28} className={clsx(n <= rating ? 'fill-accent-500 text-accent-500' : 'text-gray-300')} />
            </button>
          ))}
        </div>

        <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Votre expérience (optionnel)..." className="w-full rounded-md border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500" />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <Button loading={isSubmitting} onClick={handleSubmit} backgroundColor="var(--color-primary-500)" className="mt-3 w-full justify-center text-white">
          Envoyer mon avis
        </Button>
      </div>
    </div>
  );
}