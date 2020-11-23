import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { isEmpty } from 'rxjs/operators';
import { User } from '../../model/user';
import { LoginService } from '../../service/login.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loggedIn = false;
  submitted = false;
  loginErr = '';
  sessionExpired = false;
  topBodyEl: HTMLBodyElement;
  topBodyClass = 'admin-login-body';
  userId: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private loginService: LoginService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Apply styling on top <body>.
    this.topBodyEl = this.elementRef.nativeElement.ownerDocument.body;
    this.renderer.addClass(this.topBodyEl, this.topBodyClass);
  }

  getUserIdByUsername(username: string) {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        const user = users.filter((u) => u.username === username);
        if (user && user[0]) {
          return user[0].userId;
        }
        return 0;
      },
    });
    return 0;
  }

  onSubmit() {
    this.loginService
      .adminLogin(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value
      )
      .subscribe(
        (res) => {
          if (Object.keys(res).length === 0) {
            this.loginErr = 'Invalid User';
            throw throwError(res);
          }

          const username = this.loginForm.controls.username.value || '';
          const userId = this.getUserIdByUsername(username) || 0;
          sessionStorage.setItem('token', 'token');
          sessionStorage.setItem('userId', userId.toString());
          this.router.navigate(['admin/dashboard']);
        },
        (error) => {
          this.loginErr = error;
          this.router.navigate(['admin/login']);
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
