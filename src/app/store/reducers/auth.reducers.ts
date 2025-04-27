import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  token: string | null;
  error: any;
  loading: boolean;
  user: any | null;
}

export const initialState: AuthState = {
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
  error: null,
  loading: false,
  user: null,
};

export const authReducer = createReducer(
  initialState,

 
  on(AuthActions.login, AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

 
  on(
    AuthActions.loginSuccess,
    AuthActions.signupSuccess,
    (state, { token }) => {
      console.log('login/signup success in reducer. Token:', token);
      return {
        ...state,
        token,
        loading: false,
      };
    }
  ),

  on(
    AuthActions.loginFailure,
    AuthActions.signupFailure,
    (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })
  ),

  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    error: null,
    loading: false,
  }))
);
