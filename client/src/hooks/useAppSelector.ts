import { useSelector } from 'react-redux';
import type { RootState } from '../features/store';

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
