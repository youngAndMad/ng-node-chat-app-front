import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../service/socket-io.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor(private readonly _socketIoService: SocketIoService) {}

  ngOnInit(): void {
    this._socketIoService.getNewMessage().subscribe((message) => {
      console.log(message);
    });
  }
}
