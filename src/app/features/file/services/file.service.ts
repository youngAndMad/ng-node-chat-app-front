import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private readonly _http: HttpClient) {}

  uploadUserAvatar = (userId: number, file: File): Observable<any> => {
    let formData = new FormData().append('file', file);
    return this._http.post(
      `/api/v1/file/upload/profile-image/${userId}`,
      formData
    );
  };

  downloadUserAvatar = (userId: number): Observable<Blob> =>
    this._http.get(`/api/v1/file/upload/profile-image/${userId}`, {
      responseType: 'blob',
    });
}
