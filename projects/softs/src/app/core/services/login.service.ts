import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config/services/config.service';
import { Router } from '@angular/router';
@Injectable()
export class LoginService {

  protected url = ConfigService.config.url;

  constructor(private http: HttpClient, private router: Router) { }

  checkLogin(param: any): any {
    return this.http.post(this.url.qtht + 'checkUserLogin', param);
  }

  checkUserLogin(param: any): any {
    return this.http.post(this.url.qtht + 'checkUserLogin', param);
  }

  // getEmployIdByToken(param: any): any {
  //   return this.http.post(this.url.udht + 'getEmployIdByToken', param);
  // }

  changePassword(param: any): any {
    return this.http.post(this.url.qtht + 'changePassword', param);
  }

  getEmployeeByID(param: any): any {
    return this.http.post(this.url.hrms + 'getEmployeeByID', param);
  }

  login(user: any): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    if (user.BUSINESS_CODE) {
      this.setMADVI_KD(user, user.BUSINESS_CODE);
      this.router.navigate(['']);
    }
    else {
      const param = {
        ORG_CODE: user?.ORG_CODE,
        EMPLOYEE_ID: user?.EMPLOYEE_ID
      }
      this.getEmployeeByID(param).subscribe(
        (data) => {
          this.setMADVI_KD(user, data?.MADVI_KD);
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }

  setMADVI_KD(user, MADVI_KD) {
    localStorage.setItem("MADVI_KD", MADVI_KD);
    // if (user.ROLE && user.ROLE.includes('THI_CONG')) {
    //   this.router.navigate(['/task/list']);
    // } else if (user.ROLE && user.ROLE.includes('XEM_BCAO')) {
    //   this.router.navigate(['/report/bc-khang-theo-ngay']);
    // } else {
    //   this.router.navigate(['']);
    // }
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('user');
    localStorage.removeItem('MADVI_KD');
  }

  checkDomainLogin(param: any): any {
    return this.http.post(this.url.qtht_ad + 'checkDomainLogin', param);
  }
}