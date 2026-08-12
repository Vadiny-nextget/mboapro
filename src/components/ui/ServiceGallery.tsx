import { useState } from 'react';
import { Zap } from 'lucide-react';
import clsx from 'clsx';

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

export default function ServiceGallery({ images, title }: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-surface-alt text-muted">
        <Zap size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="animate-fade-in aspect-video overflow-hidden rounded-lg bg-surface-alt">
        <img key={activeIndex} src={images[activeIndex]} alt={`${title} — image ${activeIndex + 1}`} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                'h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                i === activeIndex ? 'border-primary-500' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}