// ============================================================
//  Bolso Direito v2 — store/hooks.js
//  Hooks tipados para uso nos componentes.
//  Importar useAppDispatch e useAppSelector ao invés de
//  useDispatch/useSelector diretamente.
// ============================================================

import { useDispatch, useSelector } from 'react-redux'

/**
 * Hook tipado para dispatch.
 * @returns {import('@reduxjs/toolkit').Dispatch}
 */
export const useAppDispatch = useDispatch

/**
 * Hook tipado para selector.
 * @type {import('react-redux').TypedUseSelectorHook}
 */
export const useAppSelector = useSelector
