import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/authservices/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private auth: AuthService, private router: Router){}

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

}
