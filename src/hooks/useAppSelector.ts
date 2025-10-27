import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../stores/userStore';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
