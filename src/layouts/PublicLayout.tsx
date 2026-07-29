import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/layout/PublicHeader';
import Footer from '../components/layout/Footer';

/** Layout du site vitrine : accueil, listing de services, profils publics. */
export default function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-(--bg-page)">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}