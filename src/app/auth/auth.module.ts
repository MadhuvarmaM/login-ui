import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from '../store/reducers/auth.reducers';
import { AuthEffects } from '../store/effects/auth.effects';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class AuthModule {}
