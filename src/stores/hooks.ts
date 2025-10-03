import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from './store';

export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector);
export const useAppDispatch = () => useDispatch<AppDispatch>();
