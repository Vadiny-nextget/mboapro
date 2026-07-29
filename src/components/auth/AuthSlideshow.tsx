import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Badge } from '../ui/Badge';
import { authSlides } from '../../data/authSlides';
import 'swiper/css';
import 'swiper/css/pagination';
import { Img } from '../ui/Img';

/**
 * Partie gauche du layout d'auth : slideshow plein écran avec
 * badges de confiance, titre et description par slide.
 */
export default function AuthSlideshow() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-900">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full w-full"
      >
        {authSlides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <Img
                src={slide.imageUrl}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Voile sombre pour la lisibilité du texte */}
              <div className="absolute inset-0 bg-linear-to-t from-gray-950/90 via-gray-950/40 to-gray-950/10" />

              <div className={`animate-fade-in-up absolute inset-x-0 bottom-0 md:bottom-1/6 max-w-xl flex flex-col gap-3 p-6 lg:p-10`}>
                <div className="hidden md:flex flex-wrap gap-2">
                  {slide.badges.map((badge) => (
                    <Badge key={badge} variant="accent" className="bg-white/15 text-white backdrop-blur-sm animate-fade-in-up">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <h2 className="font-heading text-3xl! font-bold text-white! md:text-5xl! animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="max-w-md hidden md:flex text-sm text-white/50! lg:text-base animate-fade-in-up">{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}