import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { LoginService } from './core/services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(private bnIdle: BnNgIdleService, private router: Router, private loginService: LoginService) { }

    // initiate it in your component OnInit
    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit(): void {
        this.bnIdle.startWatching(1200).subscribe((isTimedOut: boolean) => {
            if (isTimedOut) {
                this.logout();
            }
        });
    }

    logout(): void {
        this.loginService.logout();
        this.router.navigate(['/login']);
    }
}
