import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { LocalStorageService } from '../service/local-storage.service';
import { EnvService } from '../service/env.service';
import { TokenDto } from 'src/app/features/auth/model/token.dto';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private readonly _localStorageService: LocalStorageService,
    private readonly _env: EnvService,
    private readonly _authService: AuthService,
    private readonly _router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('api') || request.url.includes('socket')) {
      const modifiedReq = this.addAuthorizationHeader(request);
      return next.handle(modifiedReq).pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            return this._authService
              .refreshToken(
                this._localStorageService.getItem<TokenDto>('tokens')
                  ?.refreshToken!
              )
              .pipe(
                switchMap(() => {
                  const updatedReq = this.addAuthorizationHeader(modifiedReq);
                  return next.handle(updatedReq);
                }),
                catchError((refreshError) => {
                  console.error('Error refreshing token:', refreshError);
                  this._router.navigate(['/user-login']);
                  return throwError(error);
                })
              );
          } else {
            return throwError(error);
          }
        })
      );
    }
    return next.handle(request);
  }

  private addAuthorizationHeader(
    request: HttpRequest<unknown>
  ): HttpRequest<unknown> {
    return request.clone({
      url: this._env.apiUrl + request.url,
      setHeaders: {
        Authorization:
          'Bearer ' +
            this._localStorageService.getItem<TokenDto>('tokens')
              ?.accessToken || '',
      },
    });
  }
}
