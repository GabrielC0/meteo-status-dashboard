'use client';

import type { PortalUserInfoProps } from '@/types/Component.types';
import styles from '@/styles/components/portal/PortalUserInfo.module.scss';

const PortalUserInfo = ({ user, isLoading = false, onLogout }: PortalUserInfoProps) => {
  if (isLoading) {
    return (
      <div className={styles.portalUserInfo__loading}>
        Chargement des informations utilisateur...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.portalUserInfo__container}>
      <div className={styles.portalUserInfo__userInfo}>
        <div className={styles.portalUserInfo__statusIndicator}></div>
        <span>{user.email}</span>
      </div>

      <button
        onClick={onLogout}
        className={styles.portalUserInfo__logoutButton}
        aria-label="Se déconnecter"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16,17 21,12 16,7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default PortalUserInfo;
