import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../authservices/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { login } from '../../store/actions/auth.actions';
import { State, Store } from '@ngrx/store';
import { LoginPayload } from '../models/auth.model';
import { isAuthenticated } from '../../store/selectors/auth.selectors';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


 

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: LoginPayload = this.loginForm.value;
      this.store.dispatch(login({ payload: loginData }));

      // Wait for auth state to reflect success
      this.store
        .select(isAuthenticated)
        .pipe(take(1))
        .subscribe((isAuth) => {
          if (isAuth) {
            this.router.navigate(['/dashboard']);
          } else {
            console.warn('Invalid credentials');
          }
        });
    }
  }
}
