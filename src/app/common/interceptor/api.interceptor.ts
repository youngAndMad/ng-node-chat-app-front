import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../service/local-storage.service';
import { EnvService } from '../service/env.service';
import { TokenDto } from 'src/app/features/auth/model/token.dto';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private readonly _localStorageService: LocalStorageService,
    private readonly _env: EnvService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('api') || request.url.includes('socket')) {
      const modifiedReq = request.clone({
        url: this._env.apiUrl + request.url,
        setHeaders: {
          Authorization:
            this._localStorageService.getItem<TokenDto>('tokens')
              ?.accessToken || '',
        },
      });
      return next.handle(modifiedReq);
    }
    return next.handle(request);
  }
}
