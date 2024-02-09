import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SocketIoService } from '../service/socket-io.service';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { Observable, Subscription, catchError } from 'rxjs';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { User } from 'src/app/common/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../../file/services/file.service';

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
    private readonly _userService: UserService,
    private readonly _toast: ToastrService,
    private readonly _fileService: FileService
  ) {}

  ngOnInit(): void {
    this.user = this._localStorageService.getProfile();
    this._socketIoService.connect();
    this._socketIoService.isConnected
      .pipe(
        catchError((error: any) => {
          console.error('Error connecting to socket:', error);
          return new Observable<never>();
        })
      )
      .subscribe((isConnected) => {
        if (isConnected === true) {
          console.log('isConnected', isConnected);
          this._socketIoService.getNewMessage().subscribe((msg) => {
            console.log(msg);
          });
        }
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
    if (!this.editProfileForm.valid) {
      this._toast.error('Invalid form', 'Error', {
        timeOut: 2000,
      });
      return;
    }

    const username = this.editProfileForm.get('username')?.value!;

    this._userService.editUsername(this.user.id, username).subscribe((data) => {
      this._localStorageService.setProfile(data);
      this.user = this._localStorageService.getProfile();

      this.closeEditProfileModal();

      this._toast.success('Profile updated successfully', '', {
        timeOut: 2000,
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this._fileService
        .uploadUserAvatar(this.user.id, file)
        .subscribe((response) => {
          console.log('Avatar uploaded successfully:', response);
        });
    }
  }

  imageLink = (id: number): string => this._fileService.imageLink(id);
}
