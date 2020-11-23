import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
} from '@angular/core';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { SocialAuthService } from 'angularx-social-login';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  user: SocialUser;
  loggedIn = false;
  submitted = false;
  loginErr = '';
  sessionExpired = false;
  topBodyEl: HTMLBodyElement;
  topBodyClass = 'admin-login-body';

  constructor(
    private formBuilder: FormBuilder,
    private authService: SocialAuthService,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.authService.initState.subscribe(
      () => {},
      console.error,
      () => {
        console.log('all providers are ready');
      }
    );
    this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      this.loggedIn = user != null;
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Apply styling on top <body>.
    this.topBodyEl = this.elementRef.nativeElement.ownerDocument.body;
    this.renderer.addClass(this.topBodyEl, this.topBodyClass);
  }

  signInWithGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((_) => this.router.navigate(['home/appointment']));
  }

  signInWithFB(): void {
    this.authService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((_) => this.router.navigate(['home/appointment']));
  }

  onSubmit() {
    this.loginService
      .userLogin(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value
      )
      .subscribe(
        (res) => {
          if (Object.keys(res).length === 0) {
            this.loginErr = 'Invalid User';
            throw throwError(res);
          }

          sessionStorage.setItem('token', 'token');
          this.router.navigate(['home/appointment']);
        },
        (error) => {
          this.loginErr = error;
          console.log(error);
          this.router.navigate(['home/login']);
        }
      );
  }

  resetError() {
    this.loginErr = '';
  }

  ngOnDestroy() {
    // Remove styling on top <body>.
    this.renderer.removeClass(this.topBodyEl, this.topBodyClass);
  }
}
