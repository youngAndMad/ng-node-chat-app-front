import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TuiModule } from 'src/app/shared/tui/tui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, TuiModule, FormsModule, ReactiveFormsModule],
  exports:[FileUploadComponent]
})
export class FileModule {}
