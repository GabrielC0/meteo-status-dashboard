'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  SettingsIcon,
  LogoutIcon,
  CloseIcon,
  AddUserIcon,
  EditIcon,
  DeleteIcon,
} from '@/components/Icons';
import styles from './AdminUserInfo.module.scss';
import type {
  UserInfoProps,
  UserRole,
  NewUserForm,
  EditingUser,
  UserListItem,
} from '@/types/Component.types';

const UserInfo = ({ user, isLoading = false, onLogout }: UserInfoProps) => {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({ email: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);

  const handleSignOut = async () => {
    try {
      onLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      router.push('/login');
    }
  };

  const loadUsers = async () => {
    if (!user || user.role !== 'admin') {
      console.log('Utilisateur non admin - chargement des utilisateurs ignoré');
      return;
    }

    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('Erreur lors du chargement des utilisateurs:', response.status, errorData);

        if (response.status === 403) {
          console.log('Utilisateur non autorisé - chargement ignoré');
          return;
        }

        alert(
          `Erreur ${response.status}: ${errorData.error || 'Impossible de charger les utilisateurs'}`,
        );
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      if (response.ok) {
        setNewUser({ email: '', password: '', role: 'user' });
        setShowCreateForm(false);
        setShowCreateUserPopup(false);
        await loadUsers();
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      alert("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleEditUser = (user: UserListItem) => {
    setEditingUser(user);
    setNewUser({ email: user.email, password: '', role: user.role });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password || undefined,
          role: newUser.role,
        }),
      });

      if (response.ok) {
        setEditingUser(null);
        setNewUser({ email: '', password: '', role: 'user' });
        await loadUsers();
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (userId === 1) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadUsers();
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      alert("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    setEditingUser(null);
    setNewUser({ email: '', password: '', role: 'user' });
    setShowCreateForm(false);
    setShowCreateUserPopup(false);
  };

  const handleOpenAddUser = () => setShowCreateUserPopup(true);
  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    if (user) loadUsers();
  };
  const handleCloseCreateUser = () => {
    setShowCreateUserPopup(false);
    setNewUser({ email: '', password: '', role: 'user' });
  };

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
        <span className={styles.userInfo__session}>
          <div className={styles.userInfo__statusIndicator}></div>
          <span>
            <strong className={styles.userInfo__userName}>{user.email}</strong>
          </span>
        </span>
        <button
          onClick={handleOpenSettings}
          className={styles.userInfo__settingsButton}
          title="Paramètres"
        >
          <SettingsIcon width={16} height={16} className={styles.userInfo__settingsIcon} />
        </button>
        <button
          onClick={handleSignOut}
          className={styles.userInfo__logoutButton}
          title="Déconnexion"
        >
          <LogoutIcon width={16} height={16} className={styles.userInfo__logoutIcon} />
        </button>
      </div>

      {isSettingsOpen && (
        <div className={styles.popupOverlay} onClick={handleCloseSettings}>
          <div className={styles.popupContainer}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
              <div className={styles.popup__header}>
                <h2 className={styles.popup__title}>Paramètres</h2>
                <button
                  onClick={handleCloseSettings}
                  className={styles.popup__closeButton}
                  title="Fermer"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              </div>

              <div className={styles.popup__section}>
                <h3 className={styles.popup__sectionTitle}>
                  {editingUser ? "Modifier l'utilisateur" : ''}
                </h3>

                {showCreateForm && (
                  <form
                    onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                    className={styles.popup__form}
                  >
                    <div className={styles.popup__inputGroup}>
                      <label className={styles.popup__label}>Email</label>
                      <input
                        type="email"
                        className={styles.popup__input}
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className={styles.popup__inputGroup}>
                      <label className={styles.popup__label}>Mot de passe</label>
                      <input
                        type="password"
                        className={styles.popup__input}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder={
                          editingUser ? 'Laisser vide pour ne pas changer' : 'Mot de passe'
                        }
                        required={!editingUser}
                      />
                    </div>
                    <div className={styles.popup__inputGroup}>
                      <label className={styles.popup__label}>Rôle</label>
                      <div className={styles.popup__radioGroup}>
                        <label className={styles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={newUser.role === 'user'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value as UserRole });
                              }
                            }}
                            className={styles.popup__radioInput}
                          />
                          <span className={styles.popup__radioText}>Utilisateur</span>
                        </label>
                        <label className={styles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={newUser.role === 'admin'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value as UserRole });
                              }
                            }}
                            className={styles.popup__radioInput}
                          />
                          <span className={styles.popup__radioText}>Administrateur</span>
                        </label>
                      </div>
                    </div>
                    <div className={styles.popup__buttonGroup}>
                      <button type="submit" className={styles.popup__button}>
                        {editingUser ? 'Mettre à jour' : 'Créer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setNewUser({ email: '', password: '', role: 'user' });
                          setShowCreateForm(false);
                          setShowCreateUserPopup(false);
                        }}
                        className={`${styles.popup__button} ${styles['popup__button--secondary']}`}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className={styles.popup__section}>
                <div className={styles.popup__sectionHeader}>
                  <h3 className={styles.popup__sectionTitle}>Gestion des comptes</h3>
                  <button
                    onClick={handleOpenAddUser}
                    className={`${styles.popup__actionButton} ${styles['popup__actionButton--add']}`}
                    title="Ajouter un utilisateur"
                  >
                    <AddUserIcon width={16} height={16} />
                  </button>
                </div>
                <div className={styles.popup__userList}>
                  {isLoadingUsers ? (
                    <div className={styles.popup__loadingMessage}>
                      Chargement des utilisateurs...
                    </div>
                  ) : users.length === 0 ? (
                    <div className={styles.popup__emptyMessage}>Aucun utilisateur trouvé</div>
                  ) : (
                    users.map((user: UserListItem) => (
                      <div key={user.id} className={styles.popup__userItem}>
                        <div className={styles.popup__userInfo}>
                          <div className={styles.popup__userEmail}>{user.email}</div>
                          <span
                            className={`${styles.popup__userRole} ${styles[`popup__userRole--${user.role}`]}`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className={styles.popup__userActions}>
                          <button
                            onClick={() => handleEditUser(user)}
                            className={`${styles.popup__actionButton} ${styles['popup__actionButton--edit']}`}
                            title="Modifier"
                          >
                            <EditIcon width={14} height={14} />
                          </button>

                          {user.id !== 1 && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className={`${styles.popup__actionButton} ${styles['popup__actionButton--delete']}`}
                              title="Supprimer"
                            >
                              <DeleteIcon width={14} height={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {showCreateUserPopup && (
              <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <div className={styles.popup__header}>
                  <h2 className={styles.popup__title}>Créer un nouvel utilisateur</h2>
                  <button
                    onClick={handleCloseCreateUser}
                    className={styles.popup__closeButton}
                    title="Fermer"
                  >
                    <CloseIcon width={16} height={16} />
                  </button>
                </div>

                <div className={styles.popup__section}>
                  <form onSubmit={handleCreateUser} className={styles.popup__form}>
                    <div className={styles.popup__inputGroup}>
                      <label className={styles.popup__label}>Email</label>
                      <input
                        type="email"
                        className={styles.popup__input}
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className={styles.popup__inputGroup}>
                      <label className={styles.popup__label}>Mot de passe</label>
                      <input
                        type="password"
                        className={styles.popup__input}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mot de passe"
                        required
                      />
                    </div>
                    <div className={styles.popup__inputGroup}>
                      <label className={styles.popup__label}>Rôle</label>
                      <div className={styles.popup__radioGroup}>
                        <label className={styles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={newUser.role === 'user'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value as UserRole });
                              }
                            }}
                            className={styles.popup__radioInput}
                          />
                          <span className={styles.popup__radioText}>Utilisateur</span>
                        </label>
                        <label className={styles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={newUser.role === 'admin'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value as UserRole });
                              }
                            }}
                            className={styles.popup__radioInput}
                          />
                          <span className={styles.popup__radioText}>Administrateur</span>
                        </label>
                      </div>
                    </div>
                    <div className={styles.popup__buttonGroup}>
                      <button type="submit" className={styles.popup__button}>
                        Créer
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseCreateUser}
                        className={`${styles.popup__button} ${styles['popup__button--secondary']}`}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
