import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { TuiModule } from 'src/app/shared/tui/tui.module';
import { ToastrModule } from 'ngx-toastr';
import { SingleChatComponent } from './components/single-chat/single-chat.component';

@NgModule({
  declarations: [ChatComponent, SingleChatComponent],
  imports: [
    CommonModule,
    TuiModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot({
      maxOpened: 5,
    }),
  ],
  exports: [ChatComponent],
})
export class ChatModule {}
