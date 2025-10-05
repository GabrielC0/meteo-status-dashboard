'use client';

import { useState } from 'react';

import styles from './AdminUserInfo.module.scss';
import type { AdminUserInfoProps } from '@/types/Component.types';

const AdminUserInfo = ({ user, isLoading = false, onLogout }: AdminUserInfoProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  const handleLogoutClick = () => onLogout();

  if (isLoading) {
    return (
      <div className={styles.userInfo__loading}>Chargement des informations utilisateur...</div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className={styles.userInfo}>
        <div className={styles.userInfo__session}>
          <div className={styles.userInfo__statusIndicator}></div>
          <span className={styles.userInfo__userName}>{user.email}</span>
        </div>

        <button
          className={styles.userInfo__settingsButton}
          onClick={handleSettingsClick}
          aria-label="Ouvrir les paramètres"
        >
          <svg
            className={styles.userInfo__settingsIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-4.24 4.24M6.74 17.74l-4.24 4.24m0-15l4.24 4.24M17.74 6.74l4.24 4.24"></path>
          </svg>
        </button>

        <button
          className={styles.userInfo__logoutButton}
          onClick={handleLogoutClick}
          aria-label="Se déconnecter"
        >
          <svg
            className={styles.userInfo__logoutIcon}
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

      {showSettings && (
        <div className={styles.popupOverlay} onClick={handleCloseSettings}>
          <div className={styles.popupContainer}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
              <div className={styles.popup__header}>
                <h2 className={styles.popup__title}>Paramètres</h2>
                <button
                  className={styles.popup__closeButton}
                  onClick={handleCloseSettings}
                  aria-label="Fermer les paramètres"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className={styles.popup__section}>
                <div className={styles.popup__sectionHeader}>
                  <h3 className={styles.popup__sectionTitle}>Informations du compte</h3>
                </div>
                <div className={styles.popup__form}>
                  <div className={styles.popup__inputGroup}>
                    <label className={styles.popup__label}>Email</label>
                    <input
                      type="email"
                      className={styles.popup__input}
                      value={user.email}
                      readOnly
                    />
                  </div>
                  <div className={styles.popup__inputGroup}>
                    <label className={styles.popup__label}>Rôle</label>
                    <input type="text" className={styles.popup__input} value={user.role} readOnly />
                  </div>
                </div>
              </div>

              <div className={styles.popup__section}>
                <div className={styles.popup__sectionHeader}>
                  <h3 className={styles.popup__sectionTitle}>Actions</h3>
                </div>
                <div className={styles.popup__actions}>
                  <button
                    className={`${styles.popup__button} ${styles['popup__button--secondary']}`}
                    onClick={handleCloseSettings}
                  >
                    Fermer
                  </button>
                  <button className={styles.popup__button} onClick={handleLogoutClick}>
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUserInfo;
