'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/stores/store';
import { fetchTitanData } from '@/stores/titanSlice';

type AdminStoreProviderProps = {
  children: React.ReactNode;
};

const AdminStoreProvider = ({ children }: AdminStoreProviderProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      console.log('🚀 Chargement initial des données TITAN pour admin...');

      store
        .dispatch(fetchTitanData())
        .then(() => {
          console.log('✅ Données TITAN chargées avec succès pour admin');
        })
        .catch((error) => {
          console.error('❌ Erreur lors du chargement des données:', error);
        });
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

AdminStoreProvider.displayName = 'AdminStoreProvider';

export default AdminStoreProvider;
