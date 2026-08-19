import { useState } from 'react';
import { X } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { ApiError } from '../../types/api.types';
import type { ContactRequestSummary } from '../../types/dashboard.types';
import { Button } from '../ui/Input';

interface CreateOrderModalProps {
  contactRequest: ContactRequestSummary;
  serviceId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateOrderModal({ contactRequest, serviceId, onClose, onCreated }: CreateOrderModalProps) {
  const [agreedPrice, setAgreedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedPrice) {
      setError('Le prix convenu est requis.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await orderService.createOrder({
        contactRequestId: contactRequest.id,
        serviceId,
        agreedPrice: Number(agreedPrice),
        notes: notes || undefined,
      });
      onCreated();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1300 flex items-center justify-center bg-gray-950/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-scale-in w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-primary">Confirmer la mission</h2>
          <button onClick={onClose} aria-label="Fermer"><X size={20} /></button>
        </div>
        <p className="mb-4 text-sm text-secondary">
          Avec {contactRequest.personName} — « {contactRequest.serviceTitle} »
        </p>

        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary">Prix convenu (FCFA)</label>
            <input
              type="number"
              value={agreedPrice}
              onChange={(e) => setAgreedPrice(e.target.value)}
              className="rounded-md border border-subtle bg-surface px-3 py-2.5 text-sm text-primary outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary">Notes (optionnel)</label>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-md border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" onClick={handleSubmit} loading={isSubmitting} backgroundColor="var(--color-primary-500)" className="justify-center text-white">
            Confirmer la commande
          </Button>
        </form>
      </div>
    </div>
  );
}