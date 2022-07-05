import { Component, OnInit } from '@angular/core';
import { HISMessageService } from './../../services/his-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { EncryptService } from '../../../core/services/encrypt.service';
import { Tinh } from '../dm-tinh/tinh';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  tinhDialog: boolean;
  filterTinhs: any[];
  listMain: any[];
  listRole: any[];
  cities: any[];
  roleCurrent: any;
  mainCurrent: any;
  tinhs: any[];
  tinh: any;
  selectedTinhs: Tinh[];
  submitted: boolean;
  cols: any[];
  isUpdate: boolean = false;
  selectedMulti: string[] = [];
  countries: any[];
  selectedTinh: any;
  listUser:any[];
  userSelected:any;
  filterListUser:any[];

  constructor(private hisMessageService: HISMessageService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService,
    private encryptService: EncryptService) {
    this.breadcrumbService.setItems([
      { label: 'SCADA' },
      { label: 'Quản lý tài khoản', routerLink: ['/scada/account'] }
    ]);
  }

  ngOnInit() {
    this.hisMessageService.getDMTinh().subscribe(data => this.tinhs = data);
    this.hisMessageService.getAllRole().subscribe(data => {console.log(data);this.listRole = data});
    this.getAllUser();
    this.countries = [
      { "name": "Afghanistan", "code": "AF" },
      { "name": "Albania", "code": "AL" },
      { "name": "Algeria", "code": "DZ" },
      { "name": "American Samoa", "code": "AS" },
      { "name": "Andorra", "code": "AD" }
    ];
    this.cities = [
      { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
      { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
      { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
      { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
      { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    ];
    this.cols = [
      { field: 'MA_TINH', header: 'Mã Tỉnh' },
      { field: 'TEN_TINH', header: 'Tên Tỉnh' },
      { field: 'TEN_DVIQLY', header: 'Tên Đơn Vị Quản Lý' },
      { field: 'TEN_PHATTUYEN', header: 'Tên Phát Tuyến' }
    ];
  }
  getAllUser() {
    this.hisMessageService.getAllUser().subscribe(data => this.listMain = data);
  }

  checkPassword(password) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password) === false) {
      return 'Mật khẩu có độ dài 8 ký tự và phải có 1 ký tự hoa, 1 ký tự thường, 1 số, 1 ký tự đặc biệt';
    } else {
      return 'SUCCESS';
    }
  }

  openNew() {
    this.mainCurrent = {};
    this.selectedTinh = null;
    this.submitted = false;
    this.tinhDialog = true;
  }

  deleteItem(main) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xoá user ' + main.USERNAME + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hisMessageService.deleteUser({ ID: main.ID }).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.getAllUser();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã xoá thành công', life: 3000 });
          }
        })
      }
    });
  }
  getAllUserHRMS(e){
    this.hisMessageService.getAllUserByDonViHRM({ "DEPT_ID": -1, "ORG_ID": Number(e.ORG_ID) }).subscribe(data => {
      console.log(data);
      this.listUser = data
    });
  }
  getAllDMTinh() {
    this.hisMessageService.getDMTinh().subscribe(data => this.tinhs = data);
    this.isUpdate = false;
    this.submitted = false;
    this.tinhDialog = false;
  }

  editItem(main) {
    this.mainCurrent = { ...main };
    // this.mainCurrent.PASSWORD =this.encryptService.decrypt('scada',this.mainCurrent.PASSWORD);
    this.mainCurrent.PASSWORD = '';
    this.selectedTinh = this.tinhs.filter(i => i.MA_DVIQLY === main.MA_DVIQLY)[0];
    this.isUpdate = true;
    this.tinhDialog = true;
  }

  hideDialog() {
    this.tinhDialog = false;
    this.mainCurrent = {};
    this.isUpdate = false;
    this.submitted = false;
  }
  getDataRole(data) {
    if (data !== undefined && data !== null && data.length !== 0) {
      return data.map(i => i.ROLE);
    } else {
      return '';
    }

  }
  validateForm(item) {
    const check = this.checkPassword(item.PASSWORD);
    if (check === 'SUCCESS') {
      if (item.FULLNAME.length < 256 && item.USERNAME.length < 256 && item.USERNAME !== '' && item.USERNAME !== '' && item.USERNAME !== undefined && item.PASSWORD !== '' && item.PASSWORD !== undefined && item.ORG_ID !== null) {
        return 'SUCCESS';
      }
      else {
        return 'Dữ liệu không hợp lệ';
      }
    } else {
      return check;
    }
  }
  saveItem() {
    this.submitted = true;

    this.mainCurrent.MA_DVIQLY = this.selectedTinh.MA_DVIQLY;
    this.mainCurrent.ID_HRMS = this.userSelected===undefined||this.userSelected===null?'tmp': this.userSelected.ORG_ID.toString();

    const check = this.validateForm(this.mainCurrent);
    if (check === 'SUCCESS') {
      this.mainCurrent.PASSWORD = this.encryptService.encrypt('scada', this.mainCurrent.PASSWORD);
      if (this.isUpdate === false) {
        debugger;
        this.hisMessageService.insertUser(this.mainCurrent).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã thêm thành công', life: 3000 });
            this.getAllUser();
            this.hideDialog();
          }
        });
      } else {
        debugger;
        this.hisMessageService.updateUser(this.mainCurrent).subscribe(result => {
          if (result.result === 'SUCCESS') {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Đã cập nhật thành công', life: 3000 });
            this.getAllUser();
            this.hideDialog();
          }
        })
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Successful', detail: check, life: 3000 });
    }

  }

  filterTinh(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.tinhs.length; i++) {
      const tinh = this.tinhs[i];
      if (tinh.TEN_TINH.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tinh);
      }
    }

    this.filterTinhs = filtered;
  }
  filterUser(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.listUser.length; i++) {
      const user = this.listUser[i];
      if (user.EMPLOYEE_NAME.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(user);
      }
    }

    this.filterListUser = filtered;
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.tinhs);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "reportDMTinh");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xls';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

}
