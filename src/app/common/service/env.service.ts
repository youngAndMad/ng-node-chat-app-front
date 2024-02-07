import { Injectable } from '@angular/core';
import { IEnvironment } from 'src/environments/environment.interface';
import { Environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvService implements IEnvironment {
  get apiUrl() {
    return Environment.apiUrl;
  }

  get socketUrl() {
    return Environment.socketUrl;
  }

  get production() {
    return Environment.production;
  }
}
