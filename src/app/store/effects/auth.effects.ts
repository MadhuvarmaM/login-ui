import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AuthService } from '../../auth/authservices/auth.service';
import * as AuthActions from "../actions/auth.actions";
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) { }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(({ payload }) => console.log('Login action received with payload:', payload)),
      mergeMap(({ payload }) =>
        this.authService.login(payload).pipe(
          map((res) => AuthActions.loginSuccess({ token: res.accessToken })), // optionally add `user: res.user`
          catchError((error) => {
            const errorMsg = error?.error?.message || 'Login failed';
            console.error('Login API error:', errorMsg);
            return of(AuthActions.loginFailure({ error: errorMsg }));
          })
        )
      )
    )
  );
  

  

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          localStorage.setItem('access_token', token);
          this.router.navigate(['/dashboard']); 
        })
      ),
    { dispatch: false } 
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          console.log(error)
          alert(error); // Show error message
        })
      ),
    { dispatch: false } // No need to dispatch any further actions
  );
}
