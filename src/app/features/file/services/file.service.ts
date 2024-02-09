import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/common/service/env.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private readonly _http: HttpClient, private readonly _envService:EnvService) {}

  uploadUserAvatar = (userId: number, file: File): Observable<any> => {
    let formData = new FormData();
    formData.append('file', file);
    return this._http.post(
      `/api/v1/file/upload/profile-image/${userId}`,
      formData
    );
  };

  downloadUserAvatar = (userId: number): Observable<Blob> =>
    this._http.get(`/api/v1/file/download/profile-image/${userId}`, {
      responseType: 'blob',
    });

    imageLink = (id:number):string  => this._envService.apiUrl + "/api/v1/file/download/profile-image/" + id
}
