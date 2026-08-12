import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Input';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, description, confirmLabel = 'Confirmer', isDangerous, onConfirm, onCancel }: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1300 flex items-center justify-center bg-gray-950/50 p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="animate-scale-in w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">
        <div className={`mb-3 inline-flex rounded-full p-3 ${isDangerous ? 'bg-danger/10 text-danger' : 'bg-primary-50 text-primary-500'}`}>
          <AlertTriangle size={22} />
        </div>
        <h2 className="font-heading text-lg font-bold text-primary">{title}</h2>
        <p className="mt-1.5 text-sm text-secondary">{description}</p>

        <div className="mt-5 flex gap-3">
          <Button className="flex-1 justify-center" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button className={`flex-1 justify-center ${isDangerous ? 'bg-danger hover:bg-danger/90' : 'bg-primary hover:bg-primary/90'}`} loading={isSubmitting} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}