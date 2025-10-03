import LZString from 'lz-string';
import type {
  StorageValue,
  StoredLoginState,
  StoredUserData,
  StoredAppData,
} from '@/types/AppStorage.types';

const STORAGE_PREFIX = 'appStorage_';

class AppStorage {
  private compress = (data: string): string => {
    return LZString.compress(data);
  };

  private decompress = (compressedData: string): string => {
    return LZString.decompress(compressedData) || '';
  };

  private getStorageKey = (key: string): string => {
    return `${STORAGE_PREFIX}${key}`;
  };

  setItem = (key: string, value: StorageValue): void => {
    try {
      const serializedValue = JSON.stringify(value);
      const compressedValue = this.compress(serializedValue);
      const storageKey = this.getStorageKey(key);

      sessionStorage.setItem(storageKey, compressedValue);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  };

  getItem = <T = StorageValue>(key: string): T | null => {
    try {
      const storageKey = this.getStorageKey(key);
      const compressedValue = sessionStorage.getItem(storageKey);

      if (!compressedValue) {
        return null;
      }

      const decompressedValue = this.decompress(compressedValue);
      const parsed = JSON.parse(decompressedValue);
      return parsed as T;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  };

  removeItem = (key: string): void => {
    try {
      const storageKey = this.getStorageKey(key);
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
    }
  };

  clear = (): void => {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage:', error);
    }
  };

  getAllKeys = (): string[] => {
    try {
      const keys = Object.keys(sessionStorage);
      return keys
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .map((key) => key.replace(STORAGE_PREFIX, ''));
    } catch (error) {
      console.error('Erreur lors de la récupération des clés:', error);
      return [];
    }
  };

  getStorageSize = (): number => {
    try {
      const keys = this.getAllKeys();
      const totalSize = keys.reduce((sum, key) => {
        const storageKey = this.getStorageKey(key);
        const value = sessionStorage.getItem(storageKey);
        return sum + (value ? value.length : 0);
      }, 0);
      return totalSize;
    } catch (error) {
      console.error('Erreur lors du calcul de la taille du stockage:', error);
      return 0;
    }
  };

  saveLoginState = (state: StoredLoginState): void => {
    this.setItem('loginState', state);
  };

  loadLoginState = (): StoredLoginState | null => {
    return this.getItem('loginState');
  };

  saveUserData = (userData: StoredUserData): void => {
    this.setItem('userData', userData);
  };

  loadUserData = (): StoredUserData | null => {
    return this.getItem('userData');
  };

  saveAppData = (appData: StoredAppData): void => {
    this.setItem('appData', appData);
  };

  loadAppData = (): StoredAppData | null => {
    return this.getItem('appData');
  };
}

export const appStorage = new AppStorage();
