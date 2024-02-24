import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { EnvService } from 'src/app/common/service/env.service';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { TokenDto } from '../../auth/model/token.dto';
import { User } from 'src/app/common/model/user';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private socket: Socket;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public isConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public errorMessage$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private readonly _envService: EnvService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  connect() {
    console.log(
      this._localStorageService.getItem<TokenDto>('tokens')?.accessToken
    );
    this.socket = io(this._envService.socketUrl, {
      auth: {
        token:
          'Bearer ' +
          this._localStorageService.getItem<TokenDto>('tokens')?.accessToken,
      },
    });

    this.socket.on('error', (error) => {
      this.errorMessage$.next(error);
    });
    this.isConnected$.next(true);
  }

  sendMessage(message: any) {
    this.socket.emit('newMessage', message);
  }

  getNewMessage = () => {
    const user = this._localStorageService.getProfile();

    if (!user) {
      console.warn(
        'user from local storage service is null, could not connect to new message event'
      );
      return;
    }

    this.socket.on(`newMessage`, (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
