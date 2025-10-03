'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import {
  SettingsIcon,
  LogoutIcon,
  CloseIcon,
  AddUserIcon,
  EditIcon,
  DeleteIcon,
} from '@/components/Icons';
import { PageLayout } from '@/components/layout/PageLayout';
import { $login } from '@/app/services/login';
import { sessionManager } from '@/app/services/sessionManager';
import { logout, setUser, getUser } from '@/app/redux/reducers/loginRed';
import type { AppDispatch, RootState } from '@/stores';

import userInfoStyles from './AdminUserInfo.module.scss';

type UserRole = 'user' | 'admin';

type NewUserForm = {
  email: string;
  password: string;
  role: UserRole;
};

type EditingUser = {
  id: number;
  email: string;
  role: UserRole;
};

type UserListItem = {
  id: number;
  email: string;
  role: UserRole;
};

const UserInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const user = useSelector((state: RootState) => getUser(state));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({ email: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);

  const handleSignOut = async () => {
    try {
      await $login.logout();
      dispatch(logout());
      sessionManager.stopPing();
      router.push('/login');
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

  const handleOpenAddUser = () => {
    setShowCreateUserPopup(true);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    if (user) {
      loadUsers();
    }
  };

  useEffect(() => {
    if (session?.user && !user) {
      const userData = {
        id: 1,
        email: session.user.email || '',
        role: 'admin' as UserRole,
      };
      dispatch(setUser(userData));
    }
  }, [session, user, dispatch]);

  useEffect(() => {
    if (user) {
      sessionManager.startPing();
      return () => {
        sessionManager.stopPing();
      };
    }
  }, [user]);

  const handleCloseCreateUser = () => {
    setShowCreateUserPopup(false);
    setNewUser({ email: '', password: '', role: 'user' });
  };

  if (!user) {
    return <div className={userInfoStyles.userInfo__loading}>Chargement...</div>;
  }

  return (
    <>
      <div className={userInfoStyles.userInfo}>
        <span className={userInfoStyles.userInfo__session}>
          <div className={userInfoStyles.userInfo__statusIndicator}></div>
          <span>
            Connecté en tant que{' '}
            <strong className={userInfoStyles.userInfo__userName}>{user.email}</strong>
          </span>
        </span>
        <button
          onClick={handleOpenSettings}
          className={userInfoStyles.userInfo__settingsButton}
          title="Paramètres"
        >
          <SettingsIcon width={16} height={16} className={userInfoStyles.userInfo__settingsIcon} />
        </button>
        <button
          onClick={handleSignOut}
          className={userInfoStyles.userInfo__logoutButton}
          title="Déconnexion"
        >
          <LogoutIcon width={16} height={16} className={userInfoStyles.userInfo__logoutIcon} />
        </button>
      </div>

      {isSettingsOpen && (
        <div className={userInfoStyles.popupOverlay}>
          <div className={userInfoStyles.popupContainer}>
            <div className={userInfoStyles.popup} onClick={(e) => e.stopPropagation()}>
              <div className={userInfoStyles.popup__header}>
                <h2 className={userInfoStyles.popup__title}>Paramètres</h2>
                <button
                  onClick={handleCloseSettings}
                  className={userInfoStyles.popup__closeButton}
                  title="Fermer"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              </div>

              <div className={userInfoStyles.popup__section}>
                <h3 className={userInfoStyles.popup__sectionTitle}>
                  {editingUser ? "Modifier l'utilisateur" : ''}
                </h3>

                {showCreateForm && (
                  <form
                    onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                    className={userInfoStyles.popup__form}
                  >
                    <div className={userInfoStyles.popup__inputGroup}>
                      <label className={userInfoStyles.popup__label}>Email</label>
                      <input
                        type="email"
                        className={userInfoStyles.popup__input}
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className={userInfoStyles.popup__inputGroup}>
                      <label className={userInfoStyles.popup__label}>Mot de passe</label>
                      <input
                        type="password"
                        className={userInfoStyles.popup__input}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder={
                          editingUser ? 'Laisser vide pour ne pas changer' : 'Mot de passe'
                        }
                        required={!editingUser}
                      />
                    </div>
                    <div className={userInfoStyles.popup__inputGroup}>
                      <label className={userInfoStyles.popup__label}>Rôle</label>
                      <div className={userInfoStyles.popup__radioGroup}>
                        <label className={userInfoStyles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={newUser.role === 'user'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value });
                              }
                            }}
                            className={userInfoStyles.popup__radioInput}
                          />
                          <span className={userInfoStyles.popup__radioText}>Utilisateur</span>
                        </label>
                        <label className={userInfoStyles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={newUser.role === 'admin'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value });
                              }
                            }}
                            className={userInfoStyles.popup__radioInput}
                          />
                          <span className={userInfoStyles.popup__radioText}>Administrateur</span>
                        </label>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className={userInfoStyles.popup__button}>
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
                        className={`${userInfoStyles.popup__button} ${userInfoStyles['popup__button--secondary']}`}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className={userInfoStyles.popup__section}>
                <div className={userInfoStyles.popup__sectionHeader}>
                  <h3 className={userInfoStyles.popup__sectionTitle}>Gestion des comptes</h3>
                  <button
                    onClick={handleOpenAddUser}
                    className={`${userInfoStyles.popup__actionButton} ${userInfoStyles['popup__actionButton--add']}`}
                    title="Ajouter un utilisateur"
                  >
                    <AddUserIcon width={16} height={16} />
                  </button>
                </div>
                <div className={userInfoStyles.popup__userList}>
                  {isLoadingUsers ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Chargement des utilisateurs...
                    </div>
                  ) : users.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Aucun utilisateur trouvé
                    </div>
                  ) : (
                    users.map((user: UserListItem) => (
                      <div key={user.id} className={userInfoStyles.popup__userItem}>
                        <div className={userInfoStyles.popup__userInfo}>
                          <div className={userInfoStyles.popup__userEmail}>{user.email}</div>
                          <span
                            className={`${userInfoStyles.popup__userRole} ${userInfoStyles[`popup__userRole--${user.role}`]}`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className={userInfoStyles.popup__userActions}>
                          <button
                            onClick={() => handleEditUser(user)}
                            className={`${userInfoStyles.popup__actionButton} ${userInfoStyles['popup__actionButton--edit']}`}
                            title="Modifier"
                          >
                            <EditIcon width={14} height={14} />
                          </button>

                          {user.id !== 1 && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className={`${userInfoStyles.popup__actionButton} ${userInfoStyles['popup__actionButton--delete']}`}
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
              <div className={userInfoStyles.popup} onClick={(e) => e.stopPropagation()}>
                <div className={userInfoStyles.popup__header}>
                  <h2 className={userInfoStyles.popup__title}>Créer un nouvel utilisateur</h2>
                  <button
                    onClick={handleCloseCreateUser}
                    className={userInfoStyles.popup__closeButton}
                    title="Fermer"
                  >
                    <CloseIcon width={16} height={16} />
                  </button>
                </div>

                <div className={userInfoStyles.popup__section}>
                  <form onSubmit={handleCreateUser} className={userInfoStyles.popup__form}>
                    <div className={userInfoStyles.popup__inputGroup}>
                      <label className={userInfoStyles.popup__label}>Email</label>
                      <input
                        type="email"
                        className={userInfoStyles.popup__input}
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className={userInfoStyles.popup__inputGroup}>
                      <label className={userInfoStyles.popup__label}>Mot de passe</label>
                      <input
                        type="password"
                        className={userInfoStyles.popup__input}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mot de passe"
                        required
                      />
                    </div>
                    <div className={userInfoStyles.popup__inputGroup}>
                      <label className={userInfoStyles.popup__label}>Rôle</label>
                      <div className={userInfoStyles.popup__radioGroup}>
                        <label className={userInfoStyles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={newUser.role === 'user'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value });
                              }
                            }}
                            className={userInfoStyles.popup__radioInput}
                          />
                          <span className={userInfoStyles.popup__radioText}>Utilisateur</span>
                        </label>
                        <label className={userInfoStyles.popup__radioLabel}>
                          <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={newUser.role === 'admin'}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'user' || value === 'admin') {
                                setNewUser({ ...newUser, role: value });
                              }
                            }}
                            className={userInfoStyles.popup__radioInput}
                          />
                          <span className={userInfoStyles.popup__radioText}>Administrateur</span>
                        </label>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className={userInfoStyles.popup__button}>
                        Créer
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseCreateUser}
                        className={`${userInfoStyles.popup__button} ${userInfoStyles['popup__button--secondary']}`}
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

const Dashboard = dynamic(() => import('@/features/weather-status/components/Dashboard'), {
  ssr: true,
  loading: () => null,
});

const AdminPage = () => {
  return (
    <PageLayout>
      <UserInfo />
      <Dashboard />
    </PageLayout>
  );
};

export default AdminPage;
