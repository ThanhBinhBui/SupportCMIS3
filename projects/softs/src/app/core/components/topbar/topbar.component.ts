import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  user: any;

  constructor(
    public app: MainComponent,
    private router: Router,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  routeCA(): void {
    this.router.navigate(['/ca-image']);
  }
}
