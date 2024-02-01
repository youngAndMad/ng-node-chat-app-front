import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationDto } from '../model/registration.dto';
import { Observable } from 'rxjs';
import { LoginDto } from '../model/login.dto';
import { TokenDto } from '../model/token.dto';
import { ConfirmEmailDto } from '../model/confirm-email.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly _http: HttpClient) {}

  register = (dto: RegistrationDto): Observable<boolean> =>
    this._http.post<boolean>('/api/v1/user/register', dto);

  login = (dto: LoginDto): Observable<TokenDto> =>
    this._http.post<TokenDto>('/api/v1/user/login', dto);

  confirmEmail = (dto: ConfirmEmailDto): Observable<TokenDto> =>
    this._http.post<TokenDto>('/api/v1/user/comfirm-email', dto);

  refreshToken = (token: string): Observable<TokenDto> =>
    this._http.post<TokenDto>(
      '/api/v1/user/refresh-token',
      {},
      {
        headers: {
          'refresh-token': token,
        },
      }
    );
}
