import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

export const EmailVerifiedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const localStorageService = inject(LocalStorageService);

  const profile = localStorageService.getProfile();

  return profile && profile.emailVerified;
};
