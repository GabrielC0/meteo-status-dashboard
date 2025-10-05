import { ReactNode } from 'react';

import { ClientLogoIcon } from '@/components/Icons';

import styles from '@/styles/app/page.module.scss';

type PageLayoutProps = {
  children: ReactNode;
  showLogo?: boolean;
};

export const PageLayout = ({ children, showLogo = true }: PageLayoutProps) => (
  <div className={styles.container}>
    {showLogo && (
      <div className={styles.logoBackground}>
        <ClientLogoIcon />
      </div>
    )}
    <div className={styles.content}>{children}</div>
  </div>
);
