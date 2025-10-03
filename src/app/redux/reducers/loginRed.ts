import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appStorage } from '@/app/helpers/appStorage';
import type { RootState, LoginState, SessionUser } from '@/types/Redux.types';
import type { Middleware } from '@reduxjs/toolkit';
import type { MarketMenu } from '@/types/AppStorage.types';

const initialState: LoginState = {
  isLoggedIn: false,
  sessionToken: null,
  webSocketPath: null,
  user: null,
  userAuthorizations: null,
  userGroups: [],
  timeoutLength: 900,
  loginTime: 0,
  titanDate: 0,
  universes: [],
  marketMenu: null,
  calculationHypotheses: [],
  selectedHypothesis: '',
};

const persistenceMiddleware: Middleware<object, RootState> = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState().login;

  appStorage.saveLoginState({
    isLoggedIn: state.isLoggedIn,
    sessionToken: state.sessionToken || '',
    webSocketPath: state.webSocketPath || '',
    loginTime: state.loginTime,
    timeoutLength: state.timeoutLength,
    titanDate: state.titanDate,
  });

  if (state.user) {
    appStorage.saveUserData({
      user: { id: state.user.id, email: state.user.email, role: state.user.role },
      userAuthorizations: state.userAuthorizations ?? {},
      userGroups: state.userGroups,
    });
  }

  const marketMenu: MarketMenu = state.marketMenu ?? {};
  appStorage.saveAppData({
    universes: state.universes,
    marketMenu,
    calculationHypotheses: state.calculationHypotheses,
    selectedHypothesis: state.selectedHypothesis,
  });

  return result;
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.sessionToken = null;
      state.webSocketPath = null;
      state.user = null;
      state.userAuthorizations = null;
      state.userGroups = [];
      state.loginTime = 0;
      state.titanDate = 0;
      state.universes = [];
      state.marketMenu = null;
      state.calculationHypotheses = [];
      state.selectedHypothesis = '';

      appStorage.clear();
    },

    setSessionToken: (state, action: PayloadAction<string>) => {
      state.sessionToken = action.payload;
    },

    setWebSocketPath: (state, action: PayloadAction<string>) => {
      state.webSocketPath = action.payload;
    },

    setLoginTime: (state, action: PayloadAction<number>) => {
      state.loginTime = action.payload;
    },

    setTimeoutLength: (state, action: PayloadAction<number>) => {
      state.timeoutLength = action.payload;
    },

    setTitanDate: (state, action: PayloadAction<number>) => {
      state.titanDate = action.payload;
    },

    setUser: (state, action: PayloadAction<SessionUser>) => {
      state.user = action.payload;
    },

    setUserAuthorizations: (state, action: PayloadAction<Record<string, boolean> | null>) => {
      state.userAuthorizations = action.payload;
    },

    setUserGroups: (
      state,
      action: PayloadAction<Array<{ value: string; description: string }>>,
    ) => {
      state.userGroups = action.payload;
    },

    setUniverses: (
      state,
      action: PayloadAction<Array<{ id: number; name: string; color: string }>>,
    ) => {
      state.universes = action.payload;
    },

    setMarketMenu: (state, action: PayloadAction<MarketMenu | null>) => {
      state.marketMenu = action.payload;
    },

    setCalculationHypotheses: (state, action: PayloadAction<string[]>) => {
      state.calculationHypotheses = action.payload;
    },

    setSelectedHypothesis: (state, action: PayloadAction<string>) => {
      state.selectedHypothesis = action.payload;
    },

    restoreFromStorage: (state) => {
      console.log('Restauration depuis le stockage...');
      const loginState = appStorage.loadLoginState();
      const userData = appStorage.loadUserData();
      const appData = appStorage.loadAppData();

      console.log('LoginState chargé:', loginState);
      console.log('UserData chargé:', userData);

      if (loginState && loginState.sessionToken) {
        const now = Date.now();
        const sessionDuration = now - loginState.loginTime;
        const maxDuration = loginState.timeoutLength * 1000;

        if (sessionDuration < maxDuration) {
          state.isLoggedIn = loginState.isLoggedIn;
          state.sessionToken = loginState.sessionToken;
          state.webSocketPath = loginState.webSocketPath;
          state.loginTime = loginState.loginTime;
          state.timeoutLength = loginState.timeoutLength;
          state.titanDate = loginState.titanDate;
          console.log('État de connexion restauré (session valide):', loginState.isLoggedIn);
        } else {
          console.log('Session expirée, nettoyage du stockage');
          appStorage.clear();
        }
      } else {
        console.log('Aucune session valide trouvée');
      }

      if (userData) {
        if (
          userData.user &&
          typeof userData.user === 'object' &&
          'id' in userData.user &&
          'email' in userData.user &&
          'role' in userData.user
        ) {
          state.user = userData.user as SessionUser;
        }
        state.userAuthorizations = userData.userAuthorizations;
        state.userGroups = userData.userGroups;
      }

      if (appData) {
        state.universes = appData.universes;
        state.marketMenu = appData.marketMenu;
        state.calculationHypotheses = appData.calculationHypotheses;
        state.selectedHypothesis = appData.selectedHypothesis;
      }
    },
  },
});

export const {
  login,
  logout,
  setSessionToken,
  setWebSocketPath,
  setLoginTime,
  setTimeoutLength,
  setTitanDate,
  setUser,
  setUserAuthorizations,
  setUserGroups,
  setUniverses,
  setMarketMenu,
  setCalculationHypotheses,
  setSelectedHypothesis,
  restoreFromStorage,
} = loginSlice.actions;

export const getIsLoggedIn = (state: RootState): boolean => state.login.isLoggedIn;
export const getSessionToken = (state: RootState): string | null => state.login.sessionToken;
export const getWebSocketPath = (state: RootState): string | null => state.login.webSocketPath;
export const getUser = (state: RootState): SessionUser | null => state.login.user;
export const getUserAuthorizations = (state: RootState): Record<string, boolean> | null =>
  state.login.userAuthorizations;
export const getUserGroups = (state: RootState): Array<{ value: string; description: string }> =>
  state.login.userGroups;
export const getTimeoutLength = (state: RootState): number => state.login.timeoutLength;
export const getLoginTime = (state: RootState): number => state.login.loginTime;
export const getTitanDate = (state: RootState): number => state.login.titanDate;
export const getUniverses = (
  state: RootState,
): Array<{ id: number; name: string; color: string }> => state.login.universes;
export const getMarketMenu = (
  state: RootState,
): Record<string, string | number | boolean | null> | null => state.login.marketMenu;
export const getCalculationHypotheses = (state: RootState): string[] =>
  state.login.calculationHypotheses;
export const getSelectedHypothesis = (state: RootState): string => state.login.selectedHypothesis;

export { persistenceMiddleware };
export default loginSlice.reducer;
