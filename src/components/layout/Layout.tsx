import { ReactNode } from 'react';
import Header from './Header';

import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  hideHeader?: boolean;
}

const Layout = ({
  children,
  title = 'Weather Status Dashboard',
  hideHeader = false,
}: LayoutProps) => {
  return (
    <div className={styles.layout}>
      {!hideHeader && <Header title={title} />}
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
