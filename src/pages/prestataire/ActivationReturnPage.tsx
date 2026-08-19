import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

export default function ActivationReturnPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'active' | 'pending'>('checking');

  const checkStatus = async () => {
    setStatus('checking');
    const result = await paymentService.getActivationStatus();
    setStatus(result.activationStatus === 'active' ? 'active' : 'pending');
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      {status === 'active' ? (
        <>
          <CheckCircle2 size={40} className="mx-auto text-success" />
          <h1 className="mt-3 font-heading text-xl font-bold text-primary">Compte activé !</h1>
          <p className="mt-2 text-sm text-secondary">Vous pouvez maintenant publier vos services.</p>
          <button onClick={() => navigate('/prestataire/prestations/nouveau')} className="mt-6 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white">
            Publier mon premier service
          </button>
        </>
      ) : (
        <>
          <Clock size={40} className="mx-auto text-warning" />
          <h1 className="mt-3 font-heading text-xl font-bold text-primary">Paiement en cours de confirmation</h1>
          <p className="mt-2 text-sm text-secondary">
            {status === 'checking' ? 'Vérification...' : 'Cela peut prendre quelques instants selon votre opérateur.'}
          </p>
          <button onClick={checkStatus} disabled={status === 'checking'} className="mt-6 flex items-center gap-2 rounded-md border border-subtle px-5 py-2.5 text-sm font-semibold text-primary disabled:opacity-50">
            <RotateCcw size={15} /> Revérifier
          </button>
        </>
      )}
    </div>
  );
}