import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authservices/auth.service';
import {
  catchError,
  filter,
  switchMap,
  take,
  throwError,
  BehaviorSubject,
} from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();

  const authRequest = accessToken
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : request;

  return next(authRequest).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!refreshToken) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((tokens) => {
              isRefreshing = false;
              authService.storeTokens(tokens);
              refreshTokenSubject.next(tokens.accessToken);

              const retryRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              });

              return next(retryRequest);
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              const retryRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return next(retryRequest);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
