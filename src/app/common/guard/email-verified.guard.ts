import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

export const EmailVerifiedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  const profile = localStorageService.getProfile();

  if (!(profile && profile.emailVerified)) {
    router.navigate(['/user-login']);
  }

  return true;
};
