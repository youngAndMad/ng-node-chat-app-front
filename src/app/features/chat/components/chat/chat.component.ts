import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { SocketIoService } from '../../service/socket-io.service';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import {
  Observable,
  Subscription,
  catchError,
  debounceTime,
  filter,
  throwError,
} from 'rxjs';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { User } from 'src/app/common/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/features/user/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FileService } from 'src/app/features/file/services/file.service';
import { Router } from '@angular/router';
import { ChatService } from '../../service/chat.service';
import { Chat } from '../../model/chat';
import { Message } from '../../model/message';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { TokenDto } from 'src/app/features/auth/model/token.dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  modalSubscription: Subscription;
  user: User;
  editProfileForm: FormGroup;
  userSearchForm: FormGroup;
  messageForm: FormGroup;

  fetchedUsers: Observable<User[]>;
  chats: Chat[];
  onlineUsers: number[] = [];

  currentChat?: Chat;

  constructor(
    private readonly _socketIoService: SocketIoService,
    @Inject(TuiDialogService) private readonly _dialogs: TuiDialogService,
    private readonly _localStorageService: LocalStorageService,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _toast: ToastrService,
    private readonly _chatService: ChatService,
    private readonly _fileService: FileService,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _cdr: ChangeDetectorRef
  ) {
    this.userSearchForm = this._fb.group({
      query: [],
    });
    this.messageForm = this._fb.group({
      value: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this._localStorageService.getProfile();
    this._socketIoService.connect();
    this.fetchUserSearch();
    this._socketIoService.isConnected$
      .pipe(
        catchError((error: any) => {
          console.error('Error connecting to socket:', error);
          return new Observable<never>();
        })
      )
      .subscribe((isConnected) => {
        if (isConnected === true) {
          console.log('isConnected', isConnected);
          this._socketIoService
            .getNewMessage()
            ?.pipe(
              filter((value: any) => {
                return value !== '' && value.userId !== this.user.id;
              })
            )
            .subscribe((msg) => {
              this.currentChat?.messages.push(msg);
              this._cdr.detectChanges();
            });
        }
      });

    this._socketIoService.errorMessage$
      .pipe(filter((error) => error !== ''))
      .subscribe((error: any) => {
        console.error(error);
        this._toast.error(JSON.stringify(error), 'Socket io error', {
          timeOut: 3000,
          closeButton: false,
        });
        if (error.name && error.name === 'TokenExpiredError') {
          this._toast.info('Refresh token attempt', 'Debug', {
            timeOut: 3000,
            closeButton: false,
          });
          this._authService
            .refreshToken(
              this._localStorageService.getItem<TokenDto>('tokens')
                ?.refreshToken!
            )
            .pipe(
              catchError((err) => {
                this._toast.error(JSON.stringify(err), 'Socket io error', {
                  timeOut: 3000,
                  closeButton: false,
                });
                setTimeout(() => {
                  this._router.navigate(['/user-login']);
                }, 3000);
                return throwError(
                  () =>
                    new Error(
                      'An error occurred during refresh token ' + err.name
                    )
                );
              })
            )
            .subscribe((tokens) => {
              this._localStorageService.setItem('tokens', tokens);
              this._toast.success('Refresh updated successfully', 'Success', {
                timeOut: 3000,
                closeButton: false,
              });
              this.loadChats();
            });
        }
      });

    this._socketIoService.onlineUsers$.subscribe((data) => {
      this.onlineUsers = data;
      console.log('fetched online user list', data);
      this._cdr.detectChanges();
    });

    this.loadChats();
  }

  isUserOnline = (id: number) =>
    this.onlineUsers.some((userId) => userId === id);

  loadChats() {
    this._chatService.getChats().subscribe((res) => {
      this.chats = res;
      if (res.length !== 0) {
        this.currentChat = res[0];
      }

      this._cdr.detectChanges();
    });
  }

  getSecondMember(chat: Chat): User {
    return chat?.members?.filter(
      (member) => member.email !== this.user.email
    )[0];
  }

  getLastMessage(chat: Chat): Message | undefined {
    if (chat.messages && chat.messages.length > 0) {
      console.log('wanna return ', chat.messages[chat.messages.length - 1]);
      return chat.messages[chat.messages.length - 1];
    } else {
      console.log('wanna return undefined');
      return undefined;
    }
  }

  onSelectChat(chat: Chat) {
    this.currentChat = chat;
  }

  sendMessage() {
    if (!this.messageForm.valid) {
      this._toast.error('Can not send empty message', 'Error');
      return;
    }

    let message = this.messageForm.get('value')!.value;

    this._chatService
      .sendMessage(this.user.id, this.currentChat!.id, message)
      .subscribe((savedMessage) => {
        this.currentChat?.messages.push(savedMessage);
        this.messageForm.reset();
        this._cdr.detectChanges();
      });
  }

  showDialog(
    content: PolymorpheusContent<TuiDialogContext>,
    label: string
  ): void {
    if (label === 'Edit profile') {
      this.editProfileForm = this._fb.group({
        username: [
          this.user.username,
          [Validators.required, Validators.minLength(4)],
        ],
      });
    }

    this.modalSubscription = this._dialogs
      .open(content, { size: 's', label: label })
      .subscribe();
  }

  closeEditProfileModal = () => this.modalSubscription.unsubscribe();

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

      this._toast.success('Username updated successfully', '', {
        timeOut: 2000,
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this._fileService.uploadUserAvatar(this.user.id, file).subscribe(() => {
        this._toast.success('Profile updated successfully', '', {
          timeOut: 2000,
        });

        document
          .getElementById('avatar')
          ?.setAttribute(
            'avatar-url',
            this.imageLink(this.user.id) + '?timestamp=' + new Date().getTime()
          ); // todo
      });
    }
  }

  imageLink = (id: number): string => this._fileService.imageLink(id);

  fetchUserSearch() {
    this.userSearchForm
      .get('query')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((query) => {
        this.fetchedUsers = this._userService.fetchSuggestions(
          this.user.id,
          query
        );
      });
  }

  navigateToUsersPage() {
    this._router.navigate(['/users']);
  }

  createChat(id: number) {
    this._chatService.create(this.user.id, id).subscribe(() => {
      this._toast.success('Chat created successfully', 'Success');
      this.modalSubscription.unsubscribe();
      this.loadChats();
    });
  }

  logout() {
    this._localStorageService.clear();
    this.modalSubscription.unsubscribe();
    this._router.navigate(['/user-login']);
  }
}
