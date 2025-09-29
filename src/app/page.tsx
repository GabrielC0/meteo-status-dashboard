import dynamic from 'next/dynamic';
import { ClientLogoIcon } from '@/components/icons/LogoIcon';
import styles from '@/styles/app/page.module.scss';
export const metadata = {
  title: 'Accueil | Météo Statuts',
  description: 'Tableau de bord principal des statuts et données de marché.',
};

const Dashboard = dynamic(
  () => import('@/features/weather-status/components').then((m) => m.Dashboard),
  {
    ssr: true,
    loading: () => null,
  },
);

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoBackground}>
        <ClientLogoIcon />
      </div>
      <div className={styles.content}>
        <Dashboard />
      </div>
    </div>
  );
};

export default HomePage;
