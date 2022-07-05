import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { EncryptionService } from '../../services/encryption.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../assets/scss/tabledemo.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  submitted: boolean;
  phoneNumber: number;
  otpNumber: number;
  returnUrl: string;
  sendOTP: boolean;
  msgs: Message[] = [];
  token: string = "";
  errorCode: any = 0;
  selectedORG_CODE: any;
  username: string;
  password: string;
  LOAI_KBAO: number = 0;
  submittedCBCNV: boolean;
  errorLogin: boolean;
  lstORG: [];
  errorLoginINFO: boolean;
  messageLoginINFO: string;
  types = [
    { label: 'Đăng nhập bằng mã nhân viên', value: 'MSNV' },
    { label: 'Đăng nhập bằng tài khoản AD', value: 'AD' }
  ];
  selectedType = 'AD';

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private loginService: LoginService,
    private encryptService: EncryptionService) { }

  ngOnInit(): void {
    // this.loginToken();
    //   this.loginService.login( {
    //     "FULL_NAME":"Phạm Tiến Thắng",
    //     "ORG_CODE":"F02",
    //     "ROLE":[
    //        "QUAN_TRI",
    //        "BAO_CAO"
    //     ]
    //  });
  }

  // tokenGen(param: any): void {
  //   this.loginService.getEmployIdByToken(param)
  //     .subscribe(
  //       (data) => {
  //         if (data != "-1") {
  //           let claims = data.claims;
  //           let pEMPLOYEE_ID = claims.employid;
  //           let pEMAIL = claims.employid;
  //           let pFULL_NAME = claims.fullname;
  //           let pORG_CODE = claims.orgcode;
  //           let pUSER_ID = claims.userid;
  //           let pUSER_NAME = claims.username;
  //           let resLogin = {
  //             EMAIL: pEMAIL, EMPLOYEE_ID: pEMPLOYEE_ID, FULL_NAME: pFULL_NAME, ORG_CODE: pORG_CODE, STATUS: 1, USER_ID: pUSER_ID, USER_NAME: pUSER_NAME
  //           };
  //           this.loginService.login(resLogin);
  //         } else {
  //           this.msgs.push({ severity: 'error', summary: 'Thông báo', detail: 'Tài khoản không hợp lệ vui lòng đăng nhập bằng tài khoản chương trình' });
  //           this.router.navigate(['/']);
  //         }
  //       },
  //       (err) => {
  //         console.log(err)
  //       }
  //     );
  // }

  // loginToken(): void {
  //   this.activatedRoute.queryParams.subscribe(
  //     (query) => {
  //       if (query.token) {
  //         const param = {
  //           TOKEN: query.token
  //         }
  //         this.tokenGen(param)
  //       }
  //     },
  //     (err) => {
  //       this.msgs.push({ severity: 'error', summary: 'Thông báo', detail: 'Thông tin đăng nhập không chính xác - vui lòng thử lại.' });
  //     }
  //   )
  // }

  login() {
    this.submittedCBCNV = true;
    this.errorLogin = false;
    this.errorLoginINFO = false;
    if (this.username && this.password) {
      if (this.username === '1') {
        this.router.navigate([""]);
        localStorage.setItem('user', JSON.stringify({maDonVi:'PB0606',fullname:'Bùi Thanh Bình',role:0}));
      }
      else {
        this.errorLoginINFO = true;
        this.messageLoginINFO = "Lỗi trong quá trình đăng nhập";
      }
    }
  }
}