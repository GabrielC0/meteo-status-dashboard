import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TitanState } from '@/types/Titan.types';

const initialState: TitanState = {
  companies: [],
  sessions: [],
  ticketsStats: null,
  isLoading: false,
  error: null,
  lastUpdate: null,
};

export const fetchTitanData = createAsyncThunk('titan/fetchAll', async () => {
  const response = await fetch('/api/titan-data');

  if (!response.ok) {
    throw new Error('Erreur lors du chargement des données TITAN');
  }

  const result = await response.json();

  return {
    companies: result.data.companies || [],
    sessions: result.data.sessions || [],
    ticketsStats: result.data.ticketsStats || null,
  };
});

const titanSlice = createSlice({
  name: 'titan',
  initialState,
  reducers: {
    clearTitanData: (state) => {
      state.companies = [];
      state.sessions = [];
      state.ticketsStats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTitanData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTitanData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload.companies;
        state.sessions = action.payload.sessions;
        state.ticketsStats = action.payload.ticketsStats;
        state.lastUpdate = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchTitanData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur inconnue';
      });
  },
});

export const { clearTitanData } = titanSlice.actions;

export const getTitanCompanies = (state: { titan: TitanState }) => state.titan.companies;
export const getTitanSessions = (state: { titan: TitanState }) => state.titan.sessions;
export const getTitanTicketsStats = (state: { titan: TitanState }) => state.titan.ticketsStats;
export const getTitanIsLoading = (state: { titan: TitanState }) => state.titan.isLoading;
export const getTitanError = (state: { titan: TitanState }) => state.titan.error;

export default titanSlice.reducer;
