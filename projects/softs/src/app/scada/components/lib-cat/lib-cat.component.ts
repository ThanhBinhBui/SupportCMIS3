import { Component, OnInit } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ScadaService } from '../../services/scada.service';

@Component({
  selector: 'app-lib-cat',
  templateUrl: './lib-cat.component.html',
  styleUrls: ['./lib-cat.component.css', '../../../../styles.css'],
  providers: [MessageService, ConfirmationService]
})
export class LibCatComponent implements OnInit {
  loading: boolean;
  lstMain: any[];
  docDialog: boolean;
  doc: any;
  selectedDocs: any[];
  submitted: boolean;
  isUpdate: boolean = false;

  constructor(private scadaService: ScadaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Danh mục chủ đề', routerLink: 'admin/lib-cat' }
    ]);
  }

  ngOnInit() {
    this.config.setTranslation({
      dayNames: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
      dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
      dayNamesMin: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
      monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
      monthNamesShort: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
      today: 'Hôm nay',
      clear: 'Hủy',
      weekHeader: 'Tuần'
    });
    this.search();
  }

  search() {
    this.loading = true;
    this.lstMain = [];
    this.scadaService.DOC_CATEGORY({}).subscribe(
      data => {
        this.lstMain = data;
        this.loading = false;
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: error.message });
        this.loading = false;
      });
  }

  openNew() {
    this.doc = { IS_ACTIVE: true };
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
      message: 'Bạn có chắc chắn muốn xóa chủ đề ' + doc.CATEGORY_NAME + '?',
      accept: () => {
        this.scadaService.DOC_CATEGORY_DEL({ CATEGORY_ID: doc.CATEGORY_ID }).subscribe(result => {
          if (result == "OK") {
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thông báo', detail: 'Xóa thành công' });
            this.search();
            this.doc = {};
          }
          else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: result });
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
    if (this.doc) {
      let myFormFilesToUpload = {
        CATEGORY_ID: this.doc.CATEGORY_ID,
        ORD: this.doc.ORD,
        CATEGORY_NAME: this.doc.CATEGORY_NAME,
        IS_ACTIVE: this.doc.IS_ACTIVE
      };
      this.scadaService.DOC_CATEGORY_CRU(myFormFilesToUpload).subscribe(result => {
        if (result > -1) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thông báo', detail: this.isUpdate ? 'Cập nhật thành công' : 'Thêm mới thành công' });
          this.search();
          this.docDialog = false;
          this.doc = {};
        }
        else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: this.isUpdate ? 'Cập nhật thất bại' : 'Thêm mới thất bại' });
        }
      });
    }
  }
}