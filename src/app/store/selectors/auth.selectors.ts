import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducers';

export const selectAuthState = createFeatureSelector<AuthState>('auth');


export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const isAuthenticated = createSelector(
  selectAuthToken,
  (token) => !!token
);


export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);


export const selectUserRoles = createSelector(
  selectUser,
  (user) => user?.roles || []
);
