import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  fileForm: FormGroup;

  @Output() onFileUpload = new EventEmitter<File>();

  constructor(private readonly _fb: FormBuilder) {
    this.fileForm = this._fb.group({
      file: [],
    });
  }

  onFormSubmit = () => this.onFileUpload.emit(this.fileForm.get('file')!.value);
}
