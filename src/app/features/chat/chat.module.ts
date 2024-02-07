import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { TuiModule } from 'src/app/shared/tui/tui.module';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    TuiModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  exports: [ChatComponent],
})
export class ChatModule {}
