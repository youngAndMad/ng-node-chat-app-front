import { Component, HostListener } from '@angular/core';
import { UserService } from './features/user/services/user.service';
import { LocalStorageService } from './common/service/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly _userService: UserService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: any) {
    console.log('window:beforeunload', event);
    let user = this._localStorageService.getProfile();
    if (!user) {
      return;
    }
    [1, 2, 4, 5].forEach((id) => {
      this._userService.clearSocket(id).subscribe();
    });
  }
}
