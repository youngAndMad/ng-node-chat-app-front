import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly _http:HttpClient) { }

  editUsername = (id:number, username:string) :Observable<any> => {
    
  }
}
