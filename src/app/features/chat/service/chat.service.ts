import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../model/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly _http: HttpClient) {}

  delete = (id: number): Observable<any> =>
    this._http.delete(`/api/v1/chat/${id}`);

  create = (senderId: number, receiverId: number): Observable<{ id: number }> =>
    this._http.post<{ id: number }>('/api/v1/chat', { senderId, receiverId });

  sendMessage = (
    userId: number,
    chatId: number,
    content: string
  ): Observable<any> => {
    return this._http.post('/api/v1/message', { userId, chatId, content });
  };

  getChats = (): Observable<Chat[]> => this._http.get<Chat[]>('/api/v1/chat');
}
