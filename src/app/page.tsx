import { Dashboard } from "@/features/weather-status/components";
import { ClientLogoIcon } from "@/components/icons/LogoIcon";
import styles from "@/styles/app/page.module.scss";

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
