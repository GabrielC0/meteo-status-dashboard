import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TitanState, MockCompany, MockSession, MockTicketsStats } from '@/types/Redux.types';

const initialState: TitanState = {
  companies: [],
  sessions: [],
  ticketsStats: null,
  isLoading: false,
  error: null,
  lastUpdate: null,
};

const mockCompanies: MockCompany[] = [
  {
    id: 1,
    name: 'Banque A',
    marketDataStatus: 'SUCCESS',
    operations: [
      {
        operation_type: 'FXCROSS',
        devise1: 'EUR',
        devise2: 'USD',
        type_recuperation: 'REALTIME',
        last_market_data_update: '2024-01-15T10:30:00Z',
        status: 'SUCCESS',
      },
      {
        operation_type: 'PTSWAP',
        devise1: 'GBP',
        devise2: 'EUR',
        type_recuperation: 'REALTIME',
        last_market_data_update: '2024-01-15T10:25:00Z',
        status: 'SUCCESS',
      },
    ],
  },
  {
    id: 2,
    name: 'Banque B',
    marketDataStatus: 'WARNING',
    operations: [
      {
        operation_type: 'FXCROSS',
        devise1: 'USD',
        devise2: 'JPY',
        type_recuperation: 'BATCH',
        last_market_data_update: '2024-01-15T09:45:00Z',
        status: 'WARNING',
      },
    ],
  },
  {
    id: 3,
    name: 'Banque C',
    marketDataStatus: 'ERROR',
    operations: [
      {
        operation_type: 'PTSWAP',
        devise1: 'CHF',
        devise2: 'EUR',
        type_recuperation: 'REALTIME',
        last_market_data_update: '2024-01-15T08:15:00Z',
        status: 'ERROR',
      },
    ],
  },
  {
    id: 4,
    name: 'Institution D',
    marketDataStatus: 'SUCCESS',
    operations: [
      {
        operation_type: 'FXCROSS',
        devise1: 'EUR',
        devise2: 'GBP',
        type_recuperation: 'REALTIME',
        last_market_data_update: '2024-01-15T10:20:00Z',
        status: 'SUCCESS',
      },
      {
        operation_type: 'PTSWAP',
        devise1: 'USD',
        devise2: 'CAD',
        type_recuperation: 'BATCH',
        last_market_data_update: '2024-01-15T09:30:00Z',
        status: 'SUCCESS',
      },
      {
        operation_type: 'FXCROSS',
        devise1: 'AUD',
        devise2: 'NZD',
        type_recuperation: 'REALTIME',
        last_market_data_update: '2024-01-15T10:10:00Z',
        status: 'SUCCESS',
      },
    ],
  },
];

const mockSessions: MockSession[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
  active_sessions: Math.floor(Math.random() * 100) + 50,
  cpu_usage_percent: Math.floor(Math.random() * 80) + 10,
  memory_usage_mb: Math.floor(Math.random() * 1000) + 500,
}));

const mockTicketsStats: MockTicketsStats = {
  tickets_nouveau: 12,
  tickets_ouvert: 8,
  tickets_en_attente: 5,
};

export const fetchTitanData = createAsyncThunk('titan/fetchAll', async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      companies: mockCompanies,
      sessions: mockSessions,
      ticketsStats: mockTicketsStats,
    };
  } catch (_error) {
    return rejectWithValue('Erreur lors du chargement des données TITAN');
  }
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
        state.error = null;
      })
      .addCase(fetchTitanData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
