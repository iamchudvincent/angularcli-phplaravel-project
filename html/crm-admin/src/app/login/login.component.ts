import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from './shared/login.service';
import { LoginModel } from './shared/login.model';
import { LocalStorageService } from 'ng2-webstorage';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService } from './../shared/header/shared/header.service';
import * as $ from 'jquery';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  title = 'Login Page';
  public loginForm: FormGroup;
  public isSubmit = false;
  public errMess: string[];

  constructor(public fb: FormBuilder,
    private loginService: LoginService,
    private headerService: HeaderService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { };

  ngOnInit() {
    this.loginForm = this.fb.group(this.initForm());
  };

  initForm() {
    const emailRegex = `[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}`;

    const model = {
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }

    return model;
  }

  login() {
    this.isSubmit = true;
    this.isSubmit = false;
    let loginModel = this.loginForm.value;

    // this.loginService.submit(model).sub
    this.loginService.submit(loginModel).subscribe((res) => {
      if (res) {
        this.localStorageService.store('token', res['token']);
        this.getProfile();

      }
    }, (err) => {
      this.errMess = ['Email or password is incorrect'];
    });
  }

  public getProfile() {
    this.headerService.getProfile().subscribe(
      (res) => {
        this.localStorageService.store('user', res);
        setTimeout(() => {
          this.router.navigate(['/reservation']);
        }, 200);
      },
      (error) => {
        if (error.status == 401) {
          alert('Get profile error');
          this.localStorageService.clear();
          this.router.navigate(['/login']);
        }
      }
    )
  }
}
