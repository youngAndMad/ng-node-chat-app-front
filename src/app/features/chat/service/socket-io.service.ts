import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { EnvService } from 'src/app/common/service/env.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private socket: Socket;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private readonly _envService: EnvService) {
    // this.socket = io(this._envService.socketUrl);
  }

  sendMessage(message: any) {
    console.log('sendMessage: ', message);
    this.socket.emit('message', message);
  }

  getNewMessage = () => {
    // this.socket.on('message', (message) => {
    //   this.message$.next(message);
    // });

    return this.message$.asObservable();
  };
}
