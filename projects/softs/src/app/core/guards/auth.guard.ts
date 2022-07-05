import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data["roles"] as Array<string> || [];
    const user = JSON.parse(localStorage.getItem('user'));
    debugger
    if (user) {
      const userRoles = this.getRoles(user);
      if (!roles || roles.length == 0 || (roles.some((r) => userRoles.includes(r)))) {
        return true;
      }
      else {
        this.router.navigate(['access']);
      }
    }
    else {
      this.router.navigate(['/login']);
    }
    return false;
  }

  public isLoggedIn(): any {
    const user = JSON.parse(localStorage.getItem('user'));
    const maDv = localStorage.getItem('MADVI_KD');
    if (localStorage.getItem('isLoggedIn') === 'true' && user?.ORG_CODE && maDv) {
      return maDv
    }
    return false;
  }

  public getRoles(user) {
    if (localStorage.getItem('isLoggedIn') === 'true' && user?.ROLE) {
      return user?.ROLE
    }
    return [];
  }
}
