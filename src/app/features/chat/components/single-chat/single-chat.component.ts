import { Component, Input } from '@angular/core';
import { Chat } from '../../model/chat';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.component.html',
  styleUrls: ['./single-chat.component.scss'],
})
export class SingleChatComponent {
  @Input() chat: Chat;

  constructor() {}
}
