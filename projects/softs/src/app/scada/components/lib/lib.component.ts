import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ScadaService } from '../../services/scada.service';
import * as FileSaver from 'file-saver';
import { HISMessageService } from '../../services/his-message.service';

@Component({
  selector: 'app-lib',
  templateUrl: './lib.component.html',
  styleUrls: ['./lib.component.css', '../../../../styles.css'],
  providers: [MessageService, ConfirmationService]
})
export class LibComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  loading: boolean;
  lstMain: any[];
  lstCAT: any[];
  lstCATEdit: any[];
  CATEGORY_ID: any;
  docDialog: boolean;
  documents: any[];
  doc: any;
  selectedDocs: any[];
  submitted: boolean;
  isUpdate: boolean = false;
  user: any;
  isDauNguon: boolean = false;
  maDD: string;

  constructor(private scadaService: ScadaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private hisMessageService: HISMessageService,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Thiết bị treo tháo', routerLink: '/ThietBiTreoThao' }
    ]);
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);

  }

  search() {
    this.loading = true;
    this.lstMain = [];
    debugger;
    this.hisMessageService.getCMISDoDemThietBiTreoThao({
      "maDonVi": this.user.maDonVi,
      // "maDD": "PB06060053120001",
      "maDD": this.maDD,
      "isDauNguon": this.isDauNguon === true ? 1 : 0
    }).subscribe(
      data => {
        debugger;
        if (data !== null && data !== undefined) {
          this.lstMain = data.result;
        }
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  openNew() {
    this.doc = {};
    this.submitted = false;
    this.docDialog = true;
    this.isUpdate = false;
  }

  editDoc(doc: any) {
    this.doc = { ...doc };
    this.submitted = false;
    this.docDialog = true;
    this.isUpdate = true;
  }

  deleteDoc(doc: any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa tài liệu ' + doc.TITLE + '?',
      accept: () => {
        this.scadaService.DOC_FILE_DEL({ FILE_ID: doc.FILE_ID }).subscribe(result => {
          if (result > 0) {
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thông báo', detail: 'Xóa thành công' });
            this.search();
            this.doc = {};
          }
          else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.docDialog = false;
    this.submitted = false;
    this.isUpdate = false;
  }

  saveDoc() {
    this.submitted = true;
    if (this.doc && (this.isUpdate || this.fileInput.files.length > 0)) {
      let myFormFilesToUpload = {
        FILE_CONTENT: this.fileInput.files.length > 0 ? this.fileInput.files[0] : null,
        CATEGORY_ID: this.doc.CATEGORY_ID,
        ORD: this.doc.ORD,
        TITLE: this.doc.TITLE,
        FILE_ID: this.doc.FILE_ID
      };
      this.scadaService.DOC_FILE_CRU(myFormFilesToUpload).subscribe(result => {
        if (result > -1) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thông báo', detail: this.isUpdate ? 'Cập nhật thành công' : 'Thêm mới thành công' });
          this.search();
          this.docDialog = false;
          this.doc = {};
          this.scadaService.DOC_CATEGORY_ACTIVE({}).subscribe(
            data => {
              if (data.length > 0) {
                this.lstCATEdit = Object.assign([], data);
                data.unshift({ CATEGORY_NAME: "Tất cả" });
                this.lstCAT = data;
                this.CATEGORY_ID = data[0].CATEGORY_ID;
              }
            });
        }
        else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: this.isUpdate ? 'Cập nhật thất bại' : 'Thêm mới thất bại' });
        }
      });
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  downloadFile(fileID, fileName, fileType) {
    let paramFile = { FILE_ID: fileID };
    this.scadaService.GetFileById(paramFile).subscribe(file => {
      const data: Blob = new Blob([file], { type: "application/octet-stream" });
      FileSaver.saveAs(data, fileName + "." + fileType);
    });
  }
}