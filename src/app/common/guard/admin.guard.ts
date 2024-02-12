import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

export const AdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  const profile = localStorageService.getProfile();

  if (!(profile && profile.emailVerified && profile.role === 'ADMIN')) {
    console.log('access rejected');
    router.navigate([`/not-found`]);
    return false;
  }

  return true;
};
