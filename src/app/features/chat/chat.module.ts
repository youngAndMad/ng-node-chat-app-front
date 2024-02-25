import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { TuiModule } from 'src/app/shared/tui/tui.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [ChatComponent],
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
