'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { store } from './store';
import { fetchTitanData } from './titanSlice';

type StoreProviderProps = {
  children: React.ReactNode;
};

const StoreProvider = ({ children }: StoreProviderProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      console.log('🚀 Chargement initial des données TITAN...');

      store
        .dispatch(fetchTitanData())
        .then(() => {
          console.log('✅ Données TITAN chargées avec succès');
        })
        .catch((error) => {
          console.error('❌ Erreur lors du chargement des données:', error);
        });
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

StoreProvider.displayName = 'Stores.StoreProvider';

export default StoreProvider;
