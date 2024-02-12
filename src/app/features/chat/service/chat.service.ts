import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly _http: HttpClient) {}

  delete = (id: number): Observable<any> =>
    this._http.delete(`/api/v1/chat/${id}`);

  create = (senderId: number, receiverId: number): Observable<{ id: number }> =>
    this._http.post<{ id: number }>('/api/v1/chat', { senderId, receiverId });

  getChats = (): Observable<any> => this._http.get('/api/v1/chat');
}
