import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/common/model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly _http: HttpClient) {}

  editUsername = (id: number, username: string): Observable<User> =>
    this._http.patch<User>(`/api/v1/user/${id}`, {}, { params: { username } });
}
