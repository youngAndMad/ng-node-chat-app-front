import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { EnvService } from 'src/app/common/service/env.service';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { TokenDto } from '../../auth/model/token.dto';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private socket: Socket;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private readonly _envService: EnvService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  connect() {
    this.socket = io(this._envService.socketUrl, {
      auth: {
        token:
          'Bearer ' +
          this._localStorageService.getItem<TokenDto>('tokens')?.accessToken,
      },
    });

    this.isConnected.next(true);
  }

  sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  getNewMessage = () => {
    this.socket.on('greeting', (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
