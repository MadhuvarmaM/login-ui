import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isAuthenticated } from '../../store/selectors/auth.selectors';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(isAuthenticated).pipe(
    take(1),
    map((isAuth) => {
      const userRole = sessionStorage.getItem('role');

      if (!isAuth || userRole !== 'admin') {
        return false;
      }

      return true;
    })
  );
};
