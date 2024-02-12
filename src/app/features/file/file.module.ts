import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiModule } from 'src/app/shared/tui/tui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, TuiModule, FormsModule, ReactiveFormsModule],
  exports: [],
})
export class FileModule {}
