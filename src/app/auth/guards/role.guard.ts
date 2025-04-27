import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/selectors/auth.selectors';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  return store.select(selectUser).pipe(
    take(1),
    map(user => {
      const hasRole = user && requiredRoles.some(role => user.roles.includes(role));
      if (!hasRole) {
        router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    })
  );
};
