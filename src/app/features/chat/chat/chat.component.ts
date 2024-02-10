import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { SocketIoService } from '../service/socket-io.service';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { Observable, Subscription, catchError, debounceTime } from 'rxjs';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { User } from 'src/app/common/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../../file/services/file.service';
import { Router } from '@angular/router';
import { ChatService } from '../service/chat.service';

interface Friends {
  list?: HTMLElement;
  all: NodeListOf<HTMLElement>;
  name: string;
}

interface Chat {
  container?: HTMLElement;
  current?: HTMLElement;
  person?: string;
  name?: HTMLElement;
}

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
  userSearchForm: FormGroup;
  fetchedUsers: Observable<User[]>;

  constructor(
    private readonly _socketIoService: SocketIoService,
    @Inject(TuiDialogService) private readonly _dialogs: TuiDialogService,
    private readonly _localStorageService: LocalStorageService,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _toast: ToastrService,
    private readonly _chatService: ChatService,
    private readonly _fileService: FileService,
    private readonly _router: Router
  ) {
    this.userSearchForm = this._fb.group({
      query: [],
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
          this._socketIoService.getNewMessage().subscribe((msg) => {
            console.log(msg);
          });
          this._socketIoService.sendMessage('daneker sila');
        }
      });

    this._socketIoService.errorMessage$.subscribe((error: any) => {
      console.error(error);
      this._toast.error(JSON.stringify(error), 'Socket io error', {
        timeOut: 3000,
        closeButton: false,
      });
      if (error.name && error.name === 'TokenExpiredError') {
        setTimeout(() => {
          this._router.navigate(['/user-login']);
        }, 3000);
      }
    });

    this.chatStyles();
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

    this.editProfileSubscription = this._dialogs
      .open(content, { size: 's', label: label })
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

  createChat(id: number) {
    this._chatService.create(this.user.id, id).subscribe(console.log);
  }

  chatStyles() {
    document
      .querySelector('.chat[data-chat=person2]')
      ?.classList.add('active-chat');
    document
      .querySelector('.person[data-chat=person2]')
      ?.classList.add('active');

    const friends: Friends = {
      list: document.querySelector('ul.people') as HTMLElement,
      all: document.querySelectorAll('.left .person'),
      name: '',
    };

    const chat: Chat = {
      container: document.querySelector('.container .right') as HTMLElement,
      current: undefined,
      person: undefined,
      name: document.querySelector(
        '.container .right .top .name'
      ) as HTMLElement,
    };

    friends.all.forEach((f) => {
      f.addEventListener('mousedown', () => {
        if (!f.classList.contains('active')) {
          this.setActiveChat(f, friends, chat);
        }
      });
    });
  }

  setActiveChat(f: HTMLElement, friends: Friends, chat: Chat) {
    if (friends.list) {
      friends.list.querySelector('.active')?.classList.remove('active');
    }
    f.classList.add('active');

    if (chat.container) {
      chat.current = chat.container.querySelector(
        '.active-chat'
      ) as HTMLElement;
    }

    if (f.dataset?.['chat']) {
      chat.person = f.dataset?.['chat'];
    }

    if (chat.current) {
      chat.current.classList.remove('active-chat');
    }

    if (chat.container && chat.person) {
      chat.container
        .querySelector(`[data-chat="${chat.person}"]`)
        ?.classList.add('active-chat');
    }

    if (f.querySelector('.name')) {
      const nameElement = f.querySelector('.name') as HTMLElement;
      friends.name = nameElement.innerText || '';
    }

    if (chat.name) {
      chat.name.innerHTML = friends.name;
    }
  }
}
