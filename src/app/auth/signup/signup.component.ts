import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { signup } from '../../store/actions/auth.actions';
import { SignupPayload } from '../models/auth.model';
import { Store } from '@ngrx/store';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthService } from '../authservices/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        password: ['', Validators.required, Validators.minLength(6)],
        confirmPassword: ['', Validators.required],
      },
      { Validators: this.passwordMatchValidators }
    );
  }

  passwordMatchValidators(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData: SignupPayload = this.signupForm.value;
      console.log('Dispatching signup with data:', formData);

      this.store.dispatch(signup({ payload: formData }));
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
