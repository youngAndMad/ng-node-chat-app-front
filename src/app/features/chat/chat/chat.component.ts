import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { SocketIoService } from '../service/socket-io.service';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { User } from 'src/app/common/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  editProfileSubscription: Subscription;
  user: User;
  editProfileForm: FormGroup;

  constructor(
    private readonly _socketIoService: SocketIoService,
    @Inject(TuiDialogService) private readonly _dialogs: TuiDialogService,
    private readonly _localStorageService: LocalStorageService,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this._localStorageService.getProfile();
    this._socketIoService.getNewMessage().subscribe((msg) => {
      console.log(msg);
    });
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.editProfileForm = this._fb.group({
      username: [
        this.user.username,
        [Validators.required, Validators.minLength(4)],
      ],
    });
    this.editProfileSubscription = this._dialogs
      .open(content, { size: 's', label: 'Edit profile' })
      .subscribe();
  }

  closeEditProfileModal = () => this.editProfileSubscription.unsubscribe();

  onEditUsername() {
    const username = this.editProfileForm.get('username')?.value!;

    this._userService.editUsername(this.user.id, username).subscribe((data) => {
      this._localStorageService.setProfile(data);
      this.user = this._localStorageService.getProfile();
    });
  }
}
