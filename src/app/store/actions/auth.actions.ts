import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ payload: { email: string; password: string } }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const signup = createAction(
  '[Auth] Signup',
  props<{ payload: { email: string; password: string } }>()
);
export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ token: string }>()
);
export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');
