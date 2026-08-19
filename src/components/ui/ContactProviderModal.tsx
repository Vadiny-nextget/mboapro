import { useState } from 'react';
import { X, MessageCircle, Phone, Mail } from 'lucide-react';
import { catalogService } from '../../services/catalogService';
import { ApiError } from '../../types/api.types';
import type { ProviderContactInfo } from '../../types/catalog.types';
import { Button } from './Input';

interface ContactProviderModalProps {
  serviceId: string;
  serviceTitle: string;
  onClose: () => void;
}

export default function ContactProviderModal({ serviceId, serviceTitle, onClose }: ContactProviderModalProps) {
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState<ProviderContactInfo | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReveal = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      setContact(await catalogService.sendContactRequest(serviceId, message.trim() || undefined));
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-1300 flex items-center justify-center bg-gray-950/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-scale-in w-full max-w-md rounded-lg bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-primary">Contacter le prestataire</h2>
            <p className="text-sm text-muted">À propos de « {serviceTitle} »</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="text-muted hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {contact ? (
          <div className="flex flex-col gap-2.5">
            {contact.whatsapp && (
              <a href={`https://wa.me/237${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md border border-subtle p-3 text-sm font-medium text-primary hover:bg-surface-alt">
                <MessageCircle size={18} className="text-success" /> WhatsApp — {contact.whatsapp}
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-3 rounded-md border border-subtle p-3 text-sm font-medium text-primary hover:bg-surface-alt">
                <Phone size={18} className="text-primary-500" /> {contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-md border border-subtle p-3 text-sm font-medium text-primary hover:bg-surface-alt">
                <Mail size={18} className="text-primary-500" /> {contact.email}
              </a>
            )}
            {!contact.whatsapp && !contact.phone && !contact.email && (
              <p className="py-4 text-center text-sm text-muted">Ce prestataire n'a pas encore renseigné de coordonnées.</p>
            )}
            <p className="mt-1 text-center text-xs text-muted">Soyez respectueux et précis dans votre premier message.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message optionnel : décrivez votre besoin, vos disponibilités..." className="w-full rounded-md border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500" />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button loading={isSubmitting} onClick={handleReveal} backgroundColor="var(--color-primary-500)" className="justify-center text-white">
              Voir les coordonnées
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


// import { useState } from 'react';
// import { X, Send } from 'lucide-react';
// import { catalogService } from '../../services/catalogService';
// import { ApiError } from '../../types/api.types';
// import { Button } from './Input';

// interface ContactProviderModalProps {
//   serviceId: string;
//   serviceTitle: string;
//   onClose: () => void;
// }

// const MIN_LENGTH = 20;

// export default function ContactProviderModal({ serviceId, serviceTitle, onClose }: ContactProviderModalProps) {
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSent, setIsSent] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (message.trim().length < MIN_LENGTH) {
//       setError(`Votre message doit contenir au moins ${MIN_LENGTH} caractères.`);
//       return;
//     }

//     setIsSubmitting(true);
//     setError('');
//     try {
//       await catalogService.sendContactRequest(serviceId, message.trim());
//       setIsSent(true);
//     } catch (err) {
//       setError((err as ApiError).message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-1300 flex items-center justify-center bg-gray-950/50 p-4" onClick={onClose}>
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="animate-scale-in w-full max-w-md rounded-lg bg-surface p-6 shadow-lg"
//       >
//         <div className="mb-4 flex items-start justify-between">
//           <div>
//             <h2 className="font-heading text-lg font-bold text-primary">Contacter le prestataire</h2>
//             <p className="text-sm text-muted">À propos de « {serviceTitle} »</p>
//           </div>
//           <button onClick={onClose} aria-label="Fermer" className="text-muted hover:text-primary">
//             <X size={20} />
//           </button>
//         </div>

//         {isSent ? (
//           <div className="flex flex-col items-center gap-3 py-4 text-center">
//             <div className="rounded-full bg-success/10 p-3 text-success">
//               <Send size={24} />
//             </div>
//             <p className="font-medium text-primary">Message envoyé !</p>
//             <p className="text-sm text-secondary">Le prestataire vous répondra directement par email.</p>
//             <Button onClick={onClose} className="mt-2 justify-center">
//               Fermer
//             </Button>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//             <textarea
//               rows={5}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Décrivez votre besoin, vos disponibilités, votre budget approximatif..."
//               className="w-full rounded-md border border-subtle bg-surface p-3 text-sm text-primary outline-none focus:border-primary-500"
//             />
//             <div className="flex justify-between text-xs text-muted">
//               <span>{message.trim().length}/{MIN_LENGTH} caractères minimum</span>
//             </div>
//             {error && <p className="text-sm text-danger">{error}</p>}
//             <Button type="submit" loading={isSubmitting} leftIcon={<Send size={16} />}>
//               Envoyer la demande
//             </Button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }