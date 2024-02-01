import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { debounceTime } from 'rxjs/operators';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registrationForm: FormGroup;
  otpForm: FormGroup;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authService: AuthService,
    @Inject(TuiDialogService) private readonly _dialogs: TuiDialogService,
    private readonly _localStorageService: LocalStorageService
  ) {
    this.loginForm = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });

    this.registrationForm = this._fb.group({
      email: ['kkraken22@gmail.com', [Validators.required, Validators.email]],
      password: ['nulllllll', [Validators.required, Validators.minLength(8)]],
      username: [
        'danekerscode',
        [Validators.required, Validators.minLength(3)],
      ],
    });

    this.otpForm = this._fb.group({
      otp: [],
    });
  }

  ngOnInit(): void {
    this.setupOtpChangeHandler();
  }

  onSignupClick() {
    const userForms = document.getElementById('user_options-forms');
    if (userForms) {
      userForms.classList.remove('bounceRight');
      userForms.classList.add('bounceLeft');
    }
  }

  onLoginClick() {
    const userForms = document.getElementById('user_options-forms');
    if (userForms) {
      userForms.classList.remove('bounceLeft');
      userForms.classList.add('bounceRight');
    }
  }

  onLoginFormSubmit() {
    console.log(this.loginForm.value);
    this._authService.login(this.loginForm.value).subscribe((response) => {
      this._localStorageService.setItem('tokens', response);
    });
  }

  onRegistrationFormSubmit() {
    console.log(this.registrationForm.value);
    this._authService
      .register(this.registrationForm.value)
      .subscribe((success) => {
        if (success) {
          document.getElementById('hiddenOtpButton')?.click();
        }
      });
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this._dialogs.open(content).subscribe();
  }

  setupOtpChangeHandler() {
    this.otpForm
      .get('otp')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((otpValue: string) => {
        if (otpValue.length === 6) {
          this._authService
            .confirmEmail({
              otp: +otpValue,
              email: this.registrationForm.get('email')!.value,
            })
            .subscribe((response) => {
              this._localStorageService.setItem('tokens', response);
            });
        }
      });
  }
}
